/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Seed Data Generator for Database Initialization & Offline Pre-population
 */

import {
  User,
  Party,
  Product,
  Vehicle,
  Driver,
  GatePass,
  SystemSettings,
  AuditLog
} from '../types';

export const INITIAL_SETTINGS: SystemSettings = {
  companyProfile: {
    name: 'SALEEM DAAL FACTORY',
    tagline: 'Premium Pulse Processing & Grain Milling Unit',
    address: 'Plot # 45-B, Industrial Estate, Phase II, G.T. Road',
    city: 'Gujranwala, Punjab, Pakistan',
    phone: '+92-55-3859001',
    mobile: '+92-300-6421890',
    email: 'gatepass@saleemdaalfactory.com',
    ntnNumber: '2847193-7',
    strnNumber: '32-77-8765-432-19',
  },
  printerName: 'Default System Printer',
  paperSize: 'A5',
  marginTopMm: 5,
  marginBottomMm: 5,
  marginLeftMm: 5,
  marginRightMm: 5,
  igpPrefix: 'IGP-2026-',
  ogpPrefix: 'OGP-2026-',
  nextIgpNumber: 108,
  nextOgpNumber: 85,
  autoBackupDays: 1,
  theme: 'light'
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    username: 'admin',
    fullName: 'Muhammad Saleem (Admin)',
    role: 'Administrator',
    email: 'admin@saleemdaal.com',
    phone: '0300-6421890',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z',
    lastLogin: '2026-07-30T08:15:00Z'
  },
  {
    id: 'usr_operator',
    username: 'operator',
    fullName: 'Rana Yasir (Gate In-Charge)',
    role: 'Gate Operator',
    email: 'yasir@saleemdaal.com',
    phone: '0321-7788112',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z',
    lastLogin: '2026-07-30T13:00:00Z'
  },
  {
    id: 'usr_security',
    username: 'security',
    fullName: 'Havaldar Akbar (Main Gate)',
    role: 'Security',
    email: 'security@saleemdaal.com',
    phone: '0345-1234567',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'usr_manager',
    username: 'manager',
    fullName: 'Sheikh Usman (Factory Manager)',
    role: 'Manager',
    email: 'usman@saleemdaal.com',
    phone: '0301-8899000',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'usr_viewer',
    username: 'viewer',
    fullName: 'Audit Inspector',
    role: 'Read Only',
    email: 'auditor@saleemdaal.com',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Whole Chana (Raw Desi)',
    category: 'Raw Pulses',
    bagSizeKg: 50,
    packingType: 'Jute Bag',
    defaultWeightKg: 50,
    description: 'Imported / Local Raw Desi Chickpeas',
    status: 'Active'
  },
  {
    id: 'prod_2',
    name: 'Chana Daal (Special Grade A)',
    category: 'Finished Daal',
    bagSizeKg: 50,
    packingType: 'PP Bag',
    defaultWeightKg: 50,
    description: 'Polished Special Chana Pulse',
    status: 'Active'
  },
  {
    id: 'prod_3',
    name: 'Chana Daal (Standard Grade B)',
    category: 'Finished Daal',
    bagSizeKg: 50,
    packingType: 'PP Bag',
    defaultWeightKg: 50,
    description: 'Standard Milled Chana Pulse',
    status: 'Active'
  },
  {
    id: 'prod_4',
    name: 'Whole Moong (Unwashed)',
    category: 'Raw Pulses',
    bagSizeKg: 50,
    packingType: 'Jute Bag',
    defaultWeightKg: 50,
    description: 'Raw Mung Beans',
    status: 'Active'
  },
  {
    id: 'prod_5',
    name: 'Moong Daal (Washed / Polished)',
    category: 'Finished Daal',
    bagSizeKg: 25,
    packingType: 'PP Bag',
    defaultWeightKg: 25,
    description: 'Yellow Washed Split Mung Beans',
    status: 'Active'
  },
  {
    id: 'prod_6',
    name: 'Masoor Daal (Whole Black)',
    category: 'Raw Pulses',
    bagSizeKg: 50,
    packingType: 'Jute Bag',
    defaultWeightKg: 50,
    description: 'Raw Lentils',
    status: 'Active'
  },
  {
    id: 'prod_7',
    name: 'Masoor Daal (Red Split)',
    category: 'Finished Daal',
    bagSizeKg: 50,
    packingType: 'PP Bag',
    defaultWeightKg: 50,
    description: 'Processed Red Lentils',
    status: 'Active'
  },
  {
    id: 'prod_8',
    name: 'Daal Choker / Bran (By-Product)',
    category: 'By-Products',
    bagSizeKg: 40,
    packingType: 'PP Bag',
    defaultWeightKg: 40,
    description: 'Animal Feed Pulse Husk & Bran',
    status: 'Active'
  },
  {
    id: 'prod_9',
    name: 'Wheat Grain (Shakkar Grade)',
    category: 'Grains',
    bagSizeKg: 100,
    packingType: 'Jute Bag',
    defaultWeightKg: 100,
    description: 'Cleaned Milling Wheat',
    status: 'Active'
  }
];

export const INITIAL_PARTIES: Party[] = [
  {
    id: 'party_1',
    companyName: 'Punjab Grain Suppliers Ltd',
    partyType: 'Supplier',
    contactPerson: 'Malik Mohammad Akram',
    phone: '0300-8451122',
    cnic: '34101-1234567-1',
    address: 'Galla Mandi, Sargodha',
    city: 'Sargodha',
    ntn: '1284920-4',
    status: 'Active',
    createdAt: '2026-01-10T00:00:00Z'
  },
  {
    id: 'party_2',
    companyName: 'Karachi Wholesale Pulses Corp',
    partyType: 'Customer',
    contactPerson: 'Haji Abdul Jabbar',
    phone: '0321-2233445',
    cnic: '42101-9876543-3',
    address: 'Jodia Bazaar, Wholesale Market',
    city: 'Karachi',
    ntn: '4820193-1',
    status: 'Active',
    createdAt: '2026-01-12T00:00:00Z'
  },
  {
    id: 'party_3',
    companyName: 'Bismillah Goods Transport Co',
    partyType: 'Transport Company',
    contactPerson: 'Chaudhry Bilal Ahmed',
    phone: '0333-6677889',
    cnic: '34202-3344556-7',
    address: 'Truck Adda, G.T. Road',
    city: 'Gujranwala',
    ntn: '9081234-5',
    status: 'Active',
    createdAt: '2026-01-15T00:00:00Z'
  },
  {
    id: 'party_4',
    companyName: 'Master Grain Brokers',
    partyType: 'Broker',
    contactPerson: 'Seth Tariq Saeed',
    phone: '0302-5551234',
    cnic: '35202-8877665-9',
    address: 'Akbari Mandi',
    city: 'Lahore',
    ntn: '3120948-2',
    status: 'Active',
    createdAt: '2026-01-20T00:00:00Z'
  },
  {
    id: 'party_5',
    companyName: 'Faisalabad Food Products',
    partyType: 'Customer',
    contactPerson: 'Mian Rashid Mahmood',
    phone: '0300-9988776',
    address: 'D-Ground, People Colony',
    city: 'Faisalabad',
    status: 'Active',
    createdAt: '2026-02-01T00:00:00Z'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh_1',
    vehicleNumber: 'TLB-492',
    vehicleType: 'Trailer',
    capacityTons: 40,
    transporterName: 'Bismillah Goods Transport Co',
    status: 'Active'
  },
  {
    id: 'veh_2',
    vehicleNumber: 'LES-8821',
    vehicleType: 'Bedford Truck',
    capacityTons: 20,
    transporterName: 'Bismillah Goods Transport Co',
    status: 'Active'
  },
  {
    id: 'veh_3',
    vehicleNumber: 'KBL-902',
    vehicleType: 'Mazda 6-Wheeler',
    capacityTons: 10,
    transporterName: 'Self / Local Hire',
    status: 'Active'
  },
  {
    id: 'veh_4',
    vehicleNumber: 'GUJ-3021',
    vehicleType: 'Tractor Trolley',
    capacityTons: 12,
    transporterName: 'Local Farmer Direct',
    status: 'Active'
  },
  {
    id: 'veh_5',
    vehicleNumber: 'LHR-7721',
    vehicleType: 'Bedford Truck',
    capacityTons: 22,
    transporterName: 'Bismillah Goods Transport Co',
    status: 'Active'
  }
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'drv_1',
    name: 'Tariq Mahmood',
    fatherName: 'Ghulam Qadir',
    cnic: '34101-8899001-3',
    phone: '0300-7654321',
    licenseNumber: 'LHR-98201',
    assignedVehicleNumber: 'TLB-492',
    status: 'Active'
  },
  {
    id: 'drv_2',
    name: 'Muhammad Arshad',
    fatherName: 'Allah Ditta',
    cnic: '34201-1122334-5',
    phone: '0321-6549870',
    licenseNumber: 'GUJ-44321',
    assignedVehicleNumber: 'LES-8821',
    status: 'Active'
  },
  {
    id: 'drv_3',
    name: 'Rasheed Ahmed',
    fatherName: 'Barkat Ali',
    cnic: '35201-5544332-1',
    phone: '0333-1122334',
    assignedVehicleNumber: 'KBL-902',
    status: 'Active'
  },
  {
    id: 'drv_4',
    name: 'Gul Zaman Khan',
    fatherName: 'Khan Bahadur',
    cnic: '13101-7788990-7',
    phone: '0345-9988776',
    licenseNumber: 'KHI-00291',
    assignedVehicleNumber: 'LHR-7721',
    status: 'Active'
  }
];

export const INITIAL_GATE_PASSES: GatePass[] = [
  {
    id: 'gp_101',
    gatePassNo: 'IGP-2026-000105',
    type: 'IGP',
    date: '2026-07-30',
    time: '09:15:00',
    vehicleNumber: 'TLB-492',
    vehicleType: 'Trailer',
    driverName: 'Tariq Mahmood',
    driverPhone: '0300-7654321',
    driverCnic: '34101-8899001-3',
    partyId: 'party_1',
    partyName: 'Punjab Grain Suppliers Ltd',
    partyType: 'Supplier',
    transporterName: 'Bismillah Goods Transport Co',
    referenceNumber: 'PO-88291 / Bilty # 4490',
    status: 'Vehicle Entered',
    items: [
      {
        id: 'gpi_1',
        productId: 'prod_1',
        productName: 'Whole Chana (Raw Desi)',
        bagSizeKg: 50,
        packingType: 'Jute Bag',
        numberOfBags: 600,
        weightPerBagKg: 50,
        grossWeightKg: 30000,
        remarks: 'Direct Unloading at Silo A'
      }
    ],
    totalBags: 600,
    totalItemWeightKg: 30000,
    weighment: {
      firstWeightKg: 42500, // Gross
      secondWeightKg: 12500, // Tare expected after unload
      netWeightKg: 30000,
      firstWeightTime: '2026-07-30T09:20:00Z',
      operatorNotes: 'Moisture level 10.5%. Grade clean.'
    },
    entryTime: '2026-07-30T09:15:00Z',
    createdById: 'usr_operator',
    createdByUsername: 'operator',
    createdAt: '2026-07-30T09:15:00Z',
    updatedAt: '2026-07-30T09:20:00Z',
    remarks: 'Raw Material Arrival for Milling Batch # 42'
  },
  {
    id: 'gp_102',
    gatePassNo: 'OGP-2026-000081',
    type: 'OGP',
    date: '2026-07-30',
    time: '10:30:00',
    vehicleNumber: 'LES-8821',
    vehicleType: 'Bedford Truck',
    driverName: 'Muhammad Arshad',
    driverPhone: '0321-6549870',
    driverCnic: '34201-1122334-5',
    partyId: 'party_2',
    partyName: 'Karachi Wholesale Pulses Corp',
    partyType: 'Customer',
    transporterName: 'Bismillah Goods Transport Co',
    referenceNumber: 'INV-2026-00412',
    status: 'Completed',
    items: [
      {
        id: 'gpi_2',
        productId: 'prod_2',
        productName: 'Chana Daal (Special Grade A)',
        bagSizeKg: 50,
        packingType: 'PP Bag',
        numberOfBags: 300,
        weightPerBagKg: 50,
        grossWeightKg: 15000,
        remarks: 'Export Quality Brand Stamped'
      },
      {
        id: 'gpi_3',
        productId: 'prod_5',
        productName: 'Moong Daal (Washed / Polished)',
        bagSizeKg: 25,
        packingType: 'PP Bag',
        numberOfBags: 200,
        weightPerBagKg: 25,
        grossWeightKg: 5000,
        remarks: 'Packed in 25kg Poly Sacks'
      }
    ],
    totalBags: 500,
    totalItemWeightKg: 20000,
    weighment: {
      firstWeightKg: 31200, // Loaded truck
      secondWeightKg: 11200, // Empty truck tare
      netWeightKg: 20000,
      firstWeightTime: '2026-07-30T10:35:00Z',
      secondWeightTime: '2026-07-30T11:45:00Z'
    },
    entryTime: '2026-07-30T10:30:00Z',
    exitTime: '2026-07-30T11:50:00Z',
    createdById: 'usr_operator',
    createdByUsername: 'operator',
    approvedById: 'usr_manager',
    approvedByUsername: 'manager',
    createdAt: '2026-07-30T10:30:00Z',
    updatedAt: '2026-07-30T11:50:00Z',
    remarks: 'Dispatched for Karachi Port Container Terminal'
  },
  {
    id: 'gp_103',
    gatePassNo: 'IGP-2026-000106',
    type: 'IGP',
    date: '2026-07-30',
    time: '11:15:00',
    vehicleNumber: 'KBL-902',
    vehicleType: 'Mazda 6-Wheeler',
    driverName: 'Rasheed Ahmed',
    driverPhone: '0333-1122334',
    partyId: 'party_1',
    partyName: 'Punjab Grain Suppliers Ltd',
    partyType: 'Supplier',
    referenceNumber: 'Delivery Order # 1029',
    status: 'Vehicle Entered',
    items: [
      {
        id: 'gpi_4',
        productId: 'prod_4',
        productName: 'Whole Moong (Unwashed)',
        bagSizeKg: 50,
        packingType: 'Jute Bag',
        numberOfBags: 200,
        weightPerBagKg: 50,
        grossWeightKg: 10000,
        remarks: 'Sample Inspected by QC Lab'
      }
    ],
    totalBags: 200,
    totalItemWeightKg: 10000,
    weighment: {
      firstWeightKg: 16800,
      secondWeightKg: 6800,
      netWeightKg: 10000,
      firstWeightTime: '2026-07-30T11:20:00Z'
    },
    entryTime: '2026-07-30T11:15:00Z',
    createdById: 'usr_operator',
    createdByUsername: 'operator',
    createdAt: '2026-07-30T11:15:00Z',
    updatedAt: '2026-07-30T11:20:00Z'
  },
  {
    id: 'gp_104',
    gatePassNo: 'OGP-2026-000082',
    type: 'OGP',
    date: '2026-07-30',
    time: '12:00:00',
    vehicleNumber: 'GUJ-3021',
    vehicleType: 'Tractor Trolley',
    driverName: 'Sajid Ali',
    driverPhone: '0312-4455667',
    partyId: 'party_5',
    partyName: 'Faisalabad Food Products',
    partyType: 'Customer',
    referenceNumber: 'DO-5521',
    status: 'Pending',
    items: [
      {
        id: 'gpi_5',
        productId: 'prod_8',
        productName: 'Daal Choker / Bran (By-Product)',
        bagSizeKg: 40,
        packingType: 'PP Bag',
        numberOfBags: 250,
        weightPerBagKg: 40,
        grossWeightKg: 10000,
        remarks: 'Cattle Feed Grade'
      }
    ],
    totalBags: 250,
    totalItemWeightKg: 10000,
    weighment: {
      firstWeightKg: 14500,
      secondWeightKg: 4500,
      netWeightKg: 10000
    },
    createdById: 'usr_operator',
    createdByUsername: 'operator',
    createdAt: '2026-07-30T12:00:00Z',
    updatedAt: '2026-07-30T12:00:00Z'
  },
  {
    id: 'gp_100',
    gatePassNo: 'IGP-2026-000104',
    type: 'IGP',
    date: '2026-07-29',
    time: '14:20:00',
    vehicleNumber: 'LHR-7721',
    vehicleType: 'Bedford Truck',
    driverName: 'Gul Zaman Khan',
    driverPhone: '0345-9988776',
    driverCnic: '13101-7788990-7',
    partyId: 'party_1',
    partyName: 'Punjab Grain Suppliers Ltd',
    partyType: 'Supplier',
    transporterName: 'Bismillah Goods Transport Co',
    referenceNumber: 'PO-88190',
    status: 'Completed',
    items: [
      {
        id: 'gpi_6',
        productId: 'prod_6',
        productName: 'Masoor Daal (Whole Black)',
        bagSizeKg: 50,
        packingType: 'Jute Bag',
        numberOfBags: 400,
        weightPerBagKg: 50,
        grossWeightKg: 20000
      }
    ],
    totalBags: 400,
    totalItemWeightKg: 20000,
    weighment: {
      firstWeightKg: 31500,
      secondWeightKg: 11500,
      netWeightKg: 20000,
      firstWeightTime: '2026-07-29T14:30:00Z',
      secondWeightTime: '2026-07-29T16:10:00Z'
    },
    entryTime: '2026-07-29T14:20:00Z',
    exitTime: '2026-07-29T16:15:00Z',
    createdById: 'usr_operator',
    createdByUsername: 'operator',
    approvedById: 'usr_manager',
    approvedByUsername: 'manager',
    createdAt: '2026-07-29T14:20:00Z',
    updatedAt: '2026-07-29T16:15:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_1',
    timestamp: '2026-07-30T08:15:00Z',
    userId: 'usr_admin',
    username: 'admin',
    userRole: 'Administrator',
    action: 'LOGIN',
    entityType: 'SYSTEM',
    details: 'User admin logged into Saleem Daal Factory Gate Pass System.'
  },
  {
    id: 'aud_2',
    timestamp: '2026-07-30T09:15:00Z',
    userId: 'usr_operator',
    username: 'operator',
    userRole: 'Gate Operator',
    action: 'CREATE',
    entityType: 'GATE_PASS',
    entityId: 'gp_101',
    details: 'Created In Gate Pass IGP-2026-000105 for Vehicle TLB-492 (Supplier: Punjab Grain Suppliers Ltd).'
  },
  {
    id: 'aud_3',
    timestamp: '2026-07-30T10:30:00Z',
    userId: 'usr_operator',
    username: 'operator',
    userRole: 'Gate Operator',
    action: 'CREATE',
    entityType: 'GATE_PASS',
    entityId: 'gp_102',
    details: 'Created Out Gate Pass OGP-2026-000081 for Vehicle LES-8821 (Customer: Karachi Wholesale Pulses Corp).'
  },
  {
    id: 'aud_4',
    timestamp: '2026-07-30T11:50:00Z',
    userId: 'usr_manager',
    username: 'manager',
    userRole: 'Manager',
    action: 'APPROVE',
    entityType: 'GATE_PASS',
    entityId: 'gp_102',
    details: 'Approved OGP-2026-000081 and authorized vehicle exit.'
  }
];
