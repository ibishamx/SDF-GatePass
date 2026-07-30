/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Global TypeScript Interfaces & Data Definitions
 */

export type UserRole = 'Administrator' | 'Gate Operator' | 'Security' | 'Manager' | 'Read Only';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export type PartyType = 'Supplier' | 'Customer' | 'Broker' | 'Transport Company';

export interface Party {
  id: string;
  companyName: string;
  partyType: PartyType;
  contactPerson: string;
  phone: string;
  cnic?: string;
  address: string;
  city: string;
  ntn?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface ProductCategory {
  id: string;
  name: string; // e.g. Raw Pulses, Finished Daal, Grains, By-Products
}

export interface Product {
  id: string;
  name: string;
  category: string;
  bagSizeKg: number; // e.g., 50, 25, 100, 40
  packingType: string; // Jute Bag, PP Bag, Bulk, Poly Pack
  defaultWeightKg: number;
  description?: string;
  status: 'Active' | 'Inactive';
}

export interface Vehicle {
  id: string;
  vehicleNumber: string; // e.g., TLB-492, LES-8821
  vehicleType: 'Trailer' | 'Bedford Truck' | 'Mazda 6-Wheeler' | 'Dumper' | 'Pickup' | 'Tractor Trolley' | 'Container';
  capacityTons: number;
  transporterName?: string;
  status: 'Active' | 'Maintenance' | 'Blacklisted';
  notes?: string;
}

export interface Driver {
  id: string;
  name: string;
  fatherName?: string;
  cnic: string;
  phone: string;
  licenseNumber?: string;
  assignedVehicleNumber?: string;
  status: 'Active' | 'Inactive';
  remarks?: string;
}

export type GatePassType = 'IGP' | 'OGP';

export type GatePassStatus =
  | 'Draft'
  | 'Pending'
  | 'Approved'
  | 'Vehicle Entered'
  | 'Vehicle Exited'
  | 'Completed'
  | 'Cancelled';

export interface GatePassItem {
  id: string;
  productId: string;
  productName: string;
  description?: string;
  bagSizeKg: number;
  packingType: string;
  numberOfBags: number;
  weightPerBagKg: number;
  grossWeightKg: number; // numberOfBags * weightPerBagKg or measured
  remarks?: string;
}

export interface WeighmentDetails {
  firstWeightKg: number;  // Gross weight on weighbridge
  secondWeightKg: number; // Tare weight on weighbridge
  netWeightKg: number;    // Calculated: Math.abs(firstWeightKg - secondWeightKg)
  firstWeightTime?: string;
  secondWeightTime?: string;
  operatorNotes?: string;
  isOverridden?: boolean;
  overriddenBy?: string;
  overrideReason?: string;
}

export interface GatePass {
  id: string;
  gatePassNo: string; // e.g., IGP-2026-000001 or OGP-2026-000001
  type: GatePassType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  vehicleNumber: string;
  vehicleType?: string;
  driverName: string;
  driverPhone: string;
  driverCnic?: string;
  partyId: string;
  partyName: string;
  partyType: PartyType;
  transporterName?: string;
  referenceNumber: string; // Bilty No / PO / Delivery Order / Invoice No
  status: GatePassStatus;
  items: GatePassItem[];
  totalBags: number;
  totalItemWeightKg: number;
  weighment: WeighmentDetails;
  remarks?: string;
  entryTime?: string;
  exitTime?: string;
  createdById: string;
  createdByUsername: string;
  approvedById?: string;
  approvedByUsername?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  userRole: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PRINT' | 'APPROVE' | 'CANCEL' | 'WEIGHT_OVERRIDE' | 'LOGIN' | 'LOGOUT' | 'BACKUP_CREATE' | 'BACKUP_RESTORE';
  entityType: 'GATE_PASS' | 'PRODUCT' | 'PARTY' | 'VEHICLE' | 'DRIVER' | 'USER' | 'SETTINGS' | 'SYSTEM';
  entityId?: string;
  details: string;
  ipAddress?: string;
}

export interface CompanyProfile {
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  mobile: string;
  email: string;
  ntnNumber: string;
  strnNumber: string;
  logoUrl?: string;
}

export interface SystemSettings {
  companyProfile: CompanyProfile;
  printerName: string;
  paperSize: 'A5' | 'A4' | 'Thermal 80mm';
  marginTopMm: number;
  marginBottomMm: number;
  marginLeftMm: number;
  marginRightMm: number;
  igpPrefix: string; // IGP-2026-
  ogpPrefix: string; // OGP-2026-
  nextIgpNumber: number;
  nextOgpNumber: number;
  autoBackupDays: number;
  theme: 'light' | 'dark' | 'system';
}

export interface DashboardKPIs {
  todaysIGPCount: number;
  todaysOGPCount: number;
  vehiclesInsideCount: number;
  vehiclesExitedTodayCount: number;
  pendingPassesCount: number;
  completedPassesCount: number;
  todaysTotalBags: number;
  todaysTotalNetWeightTons: number;
}
