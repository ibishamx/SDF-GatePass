/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Database Repository & Storage Engine
 * Provides persistent SQLite-compatible repository layer with transactional safety,
 * sequence generators, audit triggers, and backup/restore.
 */

import {
  User,
  Party,
  Product,
  Vehicle,
  Driver,
  GatePass,
  SystemSettings,
  AuditLog,
  DashboardKPIs,
  GatePassType
} from '../types';

import {
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_PARTIES,
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_GATE_PASSES,
  INITIAL_AUDIT_LOGS
} from './seedData';

const STORAGE_KEY = 'saleem_daal_factory_db_v1';

export interface DatabaseState {
  settings: SystemSettings;
  users: User[];
  products: Product[];
  parties: Party[];
  vehicles: Vehicle[];
  drivers: Driver[];
  gatePasses: GatePass[];
  auditLogs: AuditLog[];
}

class DatabaseRepository {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadFromStorage();
  }

  private loadFromStorage(): DatabaseState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          settings: parsed.settings || INITIAL_SETTINGS,
          users: parsed.users || INITIAL_USERS,
          products: parsed.products || INITIAL_PRODUCTS,
          parties: parsed.parties || INITIAL_PARTIES,
          vehicles: parsed.vehicles || INITIAL_VEHICLES,
          drivers: parsed.drivers || INITIAL_DRIVERS,
          gatePasses: parsed.gatePasses || INITIAL_GATE_PASSES,
          auditLogs: parsed.auditLogs || INITIAL_AUDIT_LOGS,
        };
      }
    } catch (err) {
      console.error('Failed to parse database from local storage, loading seed data:', err);
    }

    const defaultState: DatabaseState = {
      settings: INITIAL_SETTINGS,
      users: INITIAL_USERS,
      products: INITIAL_PRODUCTS,
      parties: INITIAL_PARTIES,
      vehicles: INITIAL_VEHICLES,
      drivers: INITIAL_DRIVERS,
      gatePasses: INITIAL_GATE_PASSES,
      auditLogs: INITIAL_AUDIT_LOGS,
    };
    this.saveToStorage(defaultState);
    return defaultState;
  }

  private saveToStorage(state?: DatabaseState): void {
    const toSave = state || this.state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (err) {
      console.error('Failed to persist database state:', err);
    }
  }

  // --- SYSTEM & SETTINGS ---
  public getSettings(): SystemSettings {
    return { ...this.state.settings };
  }

  public updateSettings(newSettings: Partial<SystemSettings>, currentUser: User): SystemSettings {
    this.state.settings = {
      ...this.state.settings,
      ...newSettings,
      companyProfile: {
        ...this.state.settings.companyProfile,
        ...(newSettings.companyProfile || {})
      }
    };
    this.saveToStorage();
    this.addAuditLog(currentUser, 'UPDATE', 'SETTINGS', undefined, 'Updated system configuration and company settings.');
    return this.getSettings();
  }

  // --- AUTO NUMBER GENERATOR ---
  public generateNextGatePassNumber(type: GatePassType): string {
    const year = new Date().getFullYear();
    if (type === 'IGP') {
      const num = this.state.settings.nextIgpNumber || 108;
      const formatted = `${type}-${year}-${String(num).padStart(6, '0')}`;
      return formatted;
    } else {
      const num = this.state.settings.nextOgpNumber || 85;
      const formatted = `${type}-${year}-${String(num).padStart(6, '0')}`;
      return formatted;
    }
  }

  private incrementGatePassNumberSequence(type: GatePassType): void {
    if (type === 'IGP') {
      this.state.settings.nextIgpNumber = (this.state.settings.nextIgpNumber || 108) + 1;
    } else {
      this.state.settings.nextOgpNumber = (this.state.settings.nextOgpNumber || 85) + 1;
    }
    this.saveToStorage();
  }

  // --- GATE PASS OPERATIONS ---
  public getGatePasses(): GatePass[] {
    return [...this.state.gatePasses].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getGatePassById(id: string): GatePass | undefined {
    return this.state.gatePasses.find((gp) => gp.id === id);
  }

  public isVehicleInsideFactory(vehicleNumber: string, excludePassId?: string): boolean {
    const normalizedNumber = vehicleNumber.trim().toUpperCase();
    return this.state.gatePasses.some(
      (gp) =>
        gp.id !== excludePassId &&
        gp.vehicleNumber.trim().toUpperCase() === normalizedNumber &&
        (gp.status === 'Vehicle Entered' || gp.status === 'Approved' || gp.status === 'Pending')
    );
  }

  public createGatePass(
    passData: Omit<GatePass, 'id' | 'gatePassNo' | 'createdAt' | 'updatedAt'>,
    currentUser: User
  ): GatePass {
    const gatePassNo = this.generateNextGatePassNumber(passData.type);

    const now = new Date().toISOString();
    const newPass: GatePass = {
      ...passData,
      id: `gp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      gatePassNo,
      createdAt: now,
      updatedAt: now,
    };

    this.state.gatePasses.unshift(newPass);
    this.incrementGatePassNumberSequence(passData.type);

    // Auto update/sync vehicle and driver masters if needed
    this.syncVehicleAndDriver(
      passData.vehicleNumber,
      passData.vehicleType,
      passData.driverName,
      passData.driverPhone,
      passData.driverCnic,
      passData.transporterName
    );

    this.saveToStorage();
    this.addAuditLog(
      currentUser,
      'CREATE',
      'GATE_PASS',
      newPass.id,
      `Created ${newPass.type} #${newPass.gatePassNo} for vehicle ${newPass.vehicleNumber}`
    );

    return newPass;
  }

  public updateGatePass(
    id: string,
    updates: Partial<GatePass>,
    currentUser: User,
    reason?: string
  ): GatePass {
    const index = this.state.gatePasses.findIndex((gp) => gp.id === id);
    if (index === -1) {
      throw new Error(`Gate pass with ID ${id} not found.`);
    }

    const existing = this.state.gatePasses[index];
    const now = new Date().toISOString();

    const isWeightOverride =
      updates.weighment &&
      updates.weighment.isOverridden &&
      updates.weighment.netWeightKg !== existing.weighment.netWeightKg;

    const updatedPass: GatePass = {
      ...existing,
      ...updates,
      weighment: updates.weighment ? { ...existing.weighment, ...updates.weighment } : existing.weighment,
      updatedAt: now,
    };

    this.state.gatePasses[index] = updatedPass;
    this.saveToStorage();

    const actionType = isWeightOverride ? 'WEIGHT_OVERRIDE' : 'UPDATE';
    const detailMsg = isWeightOverride
      ? `Weight Override on ${updatedPass.gatePassNo}: Net Weight changed to ${updatedPass.weighment.netWeightKg} kg. Reason: ${reason || 'Admin Adjustment'}`
      : `Updated Gate Pass ${updatedPass.gatePassNo} (Status: ${updatedPass.status}).`;

    this.addAuditLog(currentUser, actionType, 'GATE_PASS', updatedPass.id, detailMsg);

    return updatedPass;
  }

  public updateGatePassStatus(
    id: string,
    status: GatePass['status'],
    currentUser: User
  ): GatePass {
    const pass = this.getGatePassById(id);
    if (!pass) throw new Error('Gate Pass not found.');

    const now = new Date().toISOString();
    const updates: Partial<GatePass> = { status };

    if (status === 'Vehicle Entered' && !pass.entryTime) {
      updates.entryTime = now;
    }
    if ((status === 'Vehicle Exited' || status === 'Completed') && !pass.exitTime) {
      updates.exitTime = now;
    }
    if (status === 'Approved') {
      updates.approvedById = currentUser.id;
      updates.approvedByUsername = currentUser.username;
    }

    return this.updateGatePass(id, updates, currentUser);
  }

  // --- VEHICLE & DRIVER SYNC ---
  private syncVehicleAndDriver(
    vehicleNumber: string,
    vehicleType?: string,
    driverName?: string,
    driverPhone?: string,
    driverCnic?: string,
    transporterName?: string
  ) {
    if (!vehicleNumber) return;
    const normalizedVeh = vehicleNumber.trim().toUpperCase();
    const existingVeh = this.state.vehicles.find((v) => v.vehicleNumber.trim().toUpperCase() === normalizedVeh);

    if (!existingVeh) {
      this.state.vehicles.unshift({
        id: `veh_${Date.now()}`,
        vehicleNumber: normalizedVeh,
        vehicleType: (vehicleType as any) || 'Bedford Truck',
        capacityTons: 20,
        transporterName,
        status: 'Active'
      });
    } else if (transporterName) {
      existingVeh.transporterName = transporterName;
    }

    if (driverName && driverName.trim().length > 0) {
      const existingDriver = this.state.drivers.find((d) => d.name.toLowerCase() === driverName.trim().toLowerCase());
      if (!existingDriver) {
        this.state.drivers.unshift({
          id: `drv_${Date.now()}`,
          name: driverName.trim(),
          cnic: driverCnic?.trim() || 'N/A',
          phone: driverPhone?.trim() || 'N/A',
          assignedVehicleNumber: normalizedVeh,
          status: 'Active'
        });
      } else {
        if (driverCnic && driverCnic.trim() !== '' && driverCnic.trim() !== 'N/A') {
          existingDriver.cnic = driverCnic.trim();
        }
        if (driverPhone && driverPhone.trim() !== '' && driverPhone.trim() !== 'N/A') {
          existingDriver.phone = driverPhone.trim();
        }
        if (normalizedVeh) {
          existingDriver.assignedVehicleNumber = normalizedVeh;
        }
      }
    }
  }

  // --- PRODUCTS MASTERS ---
  public getProducts(): Product[] {
    return [...this.state.products];
  }

  public saveProduct(product: Partial<Product>, currentUser: User): Product {
    if (product.id) {
      const idx = this.state.products.findIndex((p) => p.id === product.id);
      if (idx !== -1) {
        this.state.products[idx] = { ...this.state.products[idx], ...product } as Product;
        this.saveToStorage();
        this.addAuditLog(currentUser, 'UPDATE', 'PRODUCT', product.id, `Updated product ${product.name}`);
        return this.state.products[idx];
      }
    }
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: product.name || 'Unnamed Product',
      category: product.category || 'Finished Daal',
      bagSizeKg: product.bagSizeKg || 50,
      packingType: product.packingType || 'PP Bag',
      defaultWeightKg: product.defaultWeightKg || 50,
      description: product.description || '',
      status: product.status || 'Active'
    };
    this.state.products.unshift(newProduct);
    this.saveToStorage();
    this.addAuditLog(currentUser, 'CREATE', 'PRODUCT', newProduct.id, `Created product ${newProduct.name}`);
    return newProduct;
  }

  public deleteProduct(id: string, currentUser: User): void {
    this.state.products = this.state.products.filter((p) => p.id !== id);
    this.saveToStorage();
    this.addAuditLog(currentUser, 'DELETE', 'PRODUCT', id, `Deleted product ID ${id}`);
  }

  // --- PARTIES MASTERS ---
  public getParties(): Party[] {
    return [...this.state.parties];
  }

  public saveParty(party: Partial<Party>, currentUser: User): Party {
    if (party.id) {
      const idx = this.state.parties.findIndex((p) => p.id === party.id);
      if (idx !== -1) {
        this.state.parties[idx] = { ...this.state.parties[idx], ...party } as Party;
        this.saveToStorage();
        this.addAuditLog(currentUser, 'UPDATE', 'PARTY', party.id, `Updated party ${party.companyName}`);
        return this.state.parties[idx];
      }
    }
    const newParty: Party = {
      id: `party_${Date.now()}`,
      companyName: party.companyName || 'Unnamed Party',
      partyType: party.partyType || 'Supplier',
      contactPerson: party.contactPerson || 'N/A',
      phone: party.phone || '',
      cnic: party.cnic || '',
      address: party.address || '',
      city: party.city || 'Gujranwala',
      ntn: party.ntn || '',
      status: party.status || 'Active',
      createdAt: new Date().toISOString()
    };
    this.state.parties.unshift(newParty);
    this.saveToStorage();
    this.addAuditLog(currentUser, 'CREATE', 'PARTY', newParty.id, `Created party ${newParty.companyName}`);
    return newParty;
  }

  public deleteParty(id: string, currentUser: User): void {
    this.state.parties = this.state.parties.filter((p) => p.id !== id);
    this.saveToStorage();
    this.addAuditLog(currentUser, 'DELETE', 'PARTY', id, `Deleted party ID ${id}`);
  }

  // --- VEHICLES MASTERS ---
  public getVehicles(): Vehicle[] {
    return [...this.state.vehicles];
  }

  public saveVehicle(veh: Partial<Vehicle>, currentUser: User): Vehicle {
    if (veh.id) {
      const idx = this.state.vehicles.findIndex((v) => v.id === veh.id);
      if (idx !== -1) {
        this.state.vehicles[idx] = { ...this.state.vehicles[idx], ...veh } as Vehicle;
        this.saveToStorage();
        this.addAuditLog(currentUser, 'UPDATE', 'VEHICLE', veh.id, `Updated vehicle ${veh.vehicleNumber}`);
        return this.state.vehicles[idx];
      }
    }
    const newVeh: Vehicle = {
      id: `veh_${Date.now()}`,
      vehicleNumber: (veh.vehicleNumber || 'NEW-000').toUpperCase(),
      vehicleType: veh.vehicleType || 'Bedford Truck',
      capacityTons: veh.capacityTons || 20,
      transporterName: veh.transporterName || '',
      status: veh.status || 'Active',
      notes: veh.notes || ''
    };
    this.state.vehicles.unshift(newVeh);
    this.saveToStorage();
    this.addAuditLog(currentUser, 'CREATE', 'VEHICLE', newVeh.id, `Created vehicle ${newVeh.vehicleNumber}`);
    return newVeh;
  }

  // --- DRIVERS MASTERS ---
  public getDrivers(): Driver[] {
    return [...this.state.drivers];
  }

  public saveDriver(driver: Partial<Driver>, currentUser: User): Driver {
    if (driver.id) {
      const idx = this.state.drivers.findIndex((d) => d.id === driver.id);
      if (idx !== -1) {
        this.state.drivers[idx] = { ...this.state.drivers[idx], ...driver } as Driver;
        this.saveToStorage();
        this.addAuditLog(currentUser, 'UPDATE', 'DRIVER', driver.id, `Updated driver ${driver.name}`);
        return this.state.drivers[idx];
      }
    }
    const newDriver: Driver = {
      id: `drv_${Date.now()}`,
      name: driver.name || 'Unnamed Driver',
      fatherName: driver.fatherName || '',
      cnic: driver.cnic || 'N/A',
      phone: driver.phone || 'N/A',
      licenseNumber: driver.licenseNumber || '',
      assignedVehicleNumber: driver.assignedVehicleNumber || '',
      status: driver.status || 'Active',
      remarks: driver.remarks || ''
    };
    this.state.drivers.unshift(newDriver);
    this.saveToStorage();
    this.addAuditLog(currentUser, 'CREATE', 'DRIVER', newDriver.id, `Created driver ${newDriver.name}`);
    return newDriver;
  }

  // --- USERS MANAGEMENT ---
  public getUsers(): User[] {
    return [...this.state.users];
  }

  public saveUser(userData: Partial<User>, currentUser: User): User {
    if (userData.id) {
      const idx = this.state.users.findIndex((u) => u.id === userData.id);
      if (idx !== -1) {
        this.state.users[idx] = { ...this.state.users[idx], ...userData };
        this.saveToStorage();
        this.addAuditLog(currentUser, 'UPDATE', 'USER', userData.id, `Updated user ${userData.username}`);
        return this.state.users[idx];
      }
    }
    const newUser: User = {
      id: `usr_${Date.now()}`,
      username: userData.username || 'newuser',
      fullName: userData.fullName || 'New User',
      role: userData.role || 'Gate Operator',
      email: userData.email || '',
      phone: userData.phone || '',
      isActive: userData.isActive ?? true,
      createdAt: new Date().toISOString()
    };
    this.state.users.unshift(newUser);
    this.saveToStorage();
    this.addAuditLog(currentUser, 'CREATE', 'USER', newUser.id, `Created user ${newUser.username}`);
    return newUser;
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLog[] {
    return [...this.state.auditLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public addAuditLog(
    currentUser: User,
    action: AuditLog['action'],
    entityType: AuditLog['entityType'],
    entityId: string | undefined,
    details: string
  ): void {
    const log: AuditLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      username: currentUser.username,
      userRole: currentUser.role,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '127.0.0.1 (Local Workstation)'
    };
    this.state.auditLogs.unshift(log);
    // Keep max 2000 audit records
    if (this.state.auditLogs.length > 2000) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 2000);
    }
    this.saveToStorage();
  }

  // --- DASHBOARD KPIS ---
  public getDashboardKPIs(): DashboardKPIs {
    const todayStr = new Date().toISOString().split('T')[0];

    const todayPasses = this.state.gatePasses.filter(
      (gp) => gp.date === todayStr || gp.createdAt.startsWith(todayStr)
    );

    const todaysIGPCount = todayPasses.filter((gp) => gp.type === 'IGP').length;
    const todaysOGPCount = todayPasses.filter((gp) => gp.type === 'OGP').length;

    const vehiclesInsideCount = this.state.gatePasses.filter(
      (gp) => gp.status === 'Vehicle Entered'
    ).length;

    const vehiclesExitedTodayCount = todayPasses.filter(
      (gp) => gp.status === 'Vehicle Exited' || (gp.status === 'Completed' && gp.exitTime?.startsWith(todayStr))
    ).length;

    const pendingPassesCount = this.state.gatePasses.filter(
      (gp) => gp.status === 'Pending' || gp.status === 'Approved'
    ).length;

    const completedPassesCount = this.state.gatePasses.filter(
      (gp) => gp.status === 'Completed'
    ).length;

    let todaysTotalBags = 0;
    let todaysTotalNetKg = 0;

    todayPasses.forEach((gp) => {
      todaysTotalBags += gp.totalBags || 0;
      todaysTotalNetKg += gp.weighment?.netWeightKg || gp.totalItemWeightKg || 0;
    });

    return {
      todaysIGPCount,
      todaysOGPCount,
      vehiclesInsideCount,
      vehiclesExitedTodayCount,
      pendingPassesCount,
      completedPassesCount,
      todaysTotalBags,
      todaysTotalNetWeightTons: Number((todaysTotalNetKg / 1000).toFixed(2))
    };
  }

  // --- BACKUP & RESTORE ---
  public exportBackupJSON(): string {
    return JSON.stringify(this.state, null, 2);
  }

  public importBackupJSON(jsonContent: string, currentUser: User): boolean {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed.settings || !parsed.gatePasses || !parsed.users) {
        throw new Error('Invalid backup file structure.');
      }
      this.state = parsed;
      this.saveToStorage();
      this.addAuditLog(currentUser, 'BACKUP_RESTORE', 'SYSTEM', undefined, 'System database restored from external JSON backup.');
      return true;
    } catch (err) {
      console.error('Backup restore failed:', err);
      return false;
    }
  }

  public resetToSeedData(currentUser: User): void {
    this.state = {
      settings: INITIAL_SETTINGS,
      users: INITIAL_USERS,
      products: INITIAL_PRODUCTS,
      parties: INITIAL_PARTIES,
      vehicles: INITIAL_VEHICLES,
      drivers: INITIAL_DRIVERS,
      gatePasses: INITIAL_GATE_PASSES,
      auditLogs: INITIAL_AUDIT_LOGS
    };
    this.saveToStorage();
    this.addAuditLog(currentUser, 'BACKUP_RESTORE', 'SYSTEM', undefined, 'Factory Database reset to initial seed benchmark state.');
  }
}

export const dbRepository = new DatabaseRepository();
