/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Comprehensive English & Urdu Translations Dictionary
 */

export type Language = 'ur' | 'en';

export const translations = {
  en: {
    // App & Header
    appTitle: 'SALEEM DAAL FACTORY',
    appSubtitle: 'Gate Pass & Weight Management System',
    factoryName: 'Saleem Daal Factory',
    welcomeUser: 'Welcome',
    logout: 'Logout',
    languageToggle: 'اردو زبان',
    quickHelp: 'Easy Guide for Operators & Kids',

    // Navigation
    navDashboard: 'Dashboard',
    navNewIGP: 'Inbound Pass (IGP)',
    navNewOGP: 'Outbound Pass (OGP)',
    navRegister: 'Pass Register',
    navWeighbridge: 'Weighbridge (Scale)',
    navParties: 'Suppliers & Customers',
    navProducts: 'Products & Pulses',
    navVehicles: 'Vehicles & Trucks',
    navDrivers: 'Drivers List',
    navUsers: 'User Accounts',
    navSettings: 'System Settings',

    // Dashboard & Kid Simple UI
    trucksInside: 'Trucks Inside Factory',
    todaysInbound: 'Today Inbound (IGP)',
    todaysOutbound: 'Today Outbound (OGP)',
    totalBagsHandled: 'Total Bags Today',
    totalNetWeight: 'Total Net Weight',
    quickActions: 'Quick Easy Buttons',
    createIGPBtn: '1. Truck Entrance (IGP)',
    createOGPBtn: '2. Truck Exit (OGP)',
    viewRegisterBtn: '3. View Pass Book',
    printA5Slip: 'Print A5 Voucher',
    downloadPdf: 'Export PDF',

    // Gate Pass Form Labels
    passDetails: 'Gate Pass Basic Info',
    passType: 'Pass Type',
    inboundIGP: 'Inbound (IGP) - Raw Material Incoming',
    outboundOGP: 'Outbound (OGP) - Finished Goods Outgoing',
    gatePassNo: 'Gate Pass Number',
    dateTime: 'Date & Time',
    
    // Vehicle & Driver
    vehicleAndDriver: 'Step 1: Truck & Driver Details',
    vehicleNumber: 'Truck / Vehicle Number',
    vehicleNumberPlaceholder: 'e.g. TLB-492 or LES-8821',
    vehicleType: 'Vehicle Type',
    driverName: 'Driver Name',
    driverNamePlaceholder: 'e.g. Muhammad Ali',
    driverPhone: 'Driver Mobile Phone',
    driverPhonePlaceholder: 'e.g. 0300-1234567',
    driverCnic: 'Driver CNIC Number',
    driverCnicPlaceholder: 'e.g. 35202-1234567-1',

    // Party & Transport
    partyAndTransport: 'Step 2: Party & Transport Company',
    partyName: 'Supplier / Customer Party',
    selectParty: '-- Select Party --',
    transportCompanyTitle: 'Transport Company Title',
    transportCompanyPlaceholder: 'e.g. Khan Goods Transport / New Faisal Express',
    referenceNumber: 'Bilty / Order / Invoice No.',
    referencePlaceholder: 'e.g. BL-9921 or PO-4412',

    // Products & Bags
    productsAndBags: 'Step 3: Goods & Bags Details',
    productName: 'Product Name',
    packingType: 'Packing Type',
    bagSizeKg: 'Bag Weight (Kg)',
    numberOfBags: 'Number of Bags',
    weightPerBag: 'Weight Per Bag (Kg)',
    grossItemWeight: 'Total Item Weight (Kg)',
    addItem: '+ Add Another Product Item',
    removeItem: 'Remove Item',

    // Weighbridge Weights
    weighbridgeSection: 'Step 4: Weighbridge Weights (Manual Entry Allowed)',
    firstWeightGross: '1st Weight (Gross / کل وزن)',
    secondWeightTare: '2nd Weight (Tare / خالی وزن)',
    netWeight: 'Net Weight (صافی وزن)',
    manualWeightNotice: 'Note: You can type weights manually or leave blank. If left blank, NO NUMBERS will be printed on slip so workers can write by hand!',
    calculateNetWeight: 'Auto Calculate Net',
    clearWeights: 'Leave Weights Blank',

    // Driver Info Section at Bottom
    driverBottomSection: 'Driver Information (Shown at Bottom of Print Slip)',

    // Remarks & Actions
    remarks: 'Special Remarks / Notes',
    remarksPlaceholder: 'Any damage, notes, or instructions...',
    saveAndPrint: 'SAVE & PRINT A5 VOUCHER',
    saveOnly: 'Save Gate Pass',
    cancel: 'Cancel / Back',

    // Statuses
    status: 'Status',
    vehicleEntered: 'Inside Factory',
    vehicleExited: 'Exited Factory',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',

    // Table & List Headers
    searchPlaceholder: 'Search by Pass No, Vehicle, Driver, Party, Bilty...',
    actions: 'Actions',
    viewDetails: 'View',
    edit: 'Edit',
    print: 'Print',
    delete: 'Delete',
    noRecords: 'No records found matching search query.',

    // Common
    successMsg: 'Gate Pass saved successfully!',
    blankWeightText: 'BLANK (Printed as line for handwriting)'
  },

  ur: {
    // App & Header
    appTitle: 'سلیم دال فیکٹری',
    appSubtitle: 'گیٹ پاس اور وزن مینجمنٹ سسٹم',
    factoryName: 'سلیم دال فیکٹری',
    welcomeUser: 'خوش آمدید',
    logout: 'لاگ آؤٹ',
    languageToggle: 'English',
    quickHelp: 'آپریٹر گائیڈ (آسان طریقہ)',

    // Navigation
    navDashboard: 'ڈیش بورڈ (مین صفحہ)',
    navNewIGP: 'گاڑی کی آمد (IGP)',
    navNewOGP: 'گاڑی کی روانگی (OGP)',
    navRegister: 'گیٹ پاس رجسٹر',
    navWeighbridge: 'کانٹا / وزن',
    navParties: 'پارٹیاں اور سپلائرز',
    navProducts: 'جنس / دالیں / سامان',
    navVehicles: 'گاڑیاں اور ٹرک',
    navDrivers: 'ڈرائیوروں کی فہرست',
    navUsers: 'صارفین اکاؤنٹس',
    navSettings: 'سسٹم ترتیبات',

    // Dashboard & Kid Simple UI
    trucksInside: 'فیکٹری کے اندر گاڑیاں',
    todaysInbound: 'آج کی آمدی (IGP)',
    todaysOutbound: 'آج کی روانگی (OGP)',
    totalBagsHandled: 'آج کل بوریوں کی تعداد',
    totalNetWeight: 'آج کا کل وزن (ٹن)',
    quickActions: 'بڑے اور آسان بٹن',
    createIGPBtn: '1. نئی گاڑی فیکٹری داخل کریں (IGP)',
    createOGPBtn: '2. گاڑی فیکٹری سے روانہ کریں (OGP)',
    viewRegisterBtn: '3. تمام پاس کی فہرست دیکھیں',
    printA5Slip: 'پرنٹ A5 پرچی',
    downloadPdf: 'پی ڈی ایف ڈاؤن لوڈ (PDF)',

    // Gate Pass Form Labels
    passDetails: 'گیٹ پاس کی بنیادی معلومات',
    passType: 'پاس کی قسم',
    inboundIGP: 'آمدی (IGP) - فیکٹری میں سامان کی آمد',
    outboundOGP: 'روانگی (OGP) - فیکٹری سے مال کی روانگی',
    gatePassNo: 'گیٹ پاس نمبر',
    dateTime: 'تاریخ اور وقت',
    
    // Vehicle & Driver
    vehicleAndDriver: 'مرحلہ 1: گاڑی اور ڈرائیور کی معلومات',
    vehicleNumber: 'گاڑی / ٹرک نمبر',
    vehicleNumberPlaceholder: 'مثلاً: TLB-492 یا LES-8821',
    vehicleType: 'گاڑی کی قسم',
    driverName: 'ڈرائیور کا نام',
    driverNamePlaceholder: 'مثلاً: محمد علی',
    driverPhone: 'ڈرائیور کا موبائل فون نمبر',
    driverPhonePlaceholder: 'مثلاً: 0300-1234567',
    driverCnic: 'ڈرائیور کا قومی شناختی کارڈ نمبر (CNIC)',
    driverCnicPlaceholder: 'مثلاً: 35202-1234567-1',

    // Party & Transport
    partyAndTransport: 'مرحلہ 2: پارٹی اور ٹرانسپورٹ کمپنی',
    partyName: 'سپلائر / گاہک پارٹی کا نام',
    selectParty: '-- پارٹی منتخب کریں --',
    transportCompanyTitle: 'ٹرانسپورٹ کمپنی کا نام',
    transportCompanyPlaceholder: 'مثلاً: خان گڈز ٹرانسپورٹ / نیو فیصل ایکسپریس',
    referenceNumber: 'بلٹی / آرڈر / انوائس نمبر',
    referencePlaceholder: 'مثلاً: BL-9921 یا PO-4412',

    // Products & Bags
    productsAndBags: 'مرحلہ 3: سامان اور بوریوں کی تفصیلات',
    productName: 'جنس / مال کا نام',
    packingType: 'پیکنگ کی قسم',
    bagSizeKg: 'بوری کا وزن (کلو)',
    numberOfBags: 'بوریوں کی تعداد',
    weightPerBag: 'وزن فی بوری (کلو)',
    grossItemWeight: 'کل سامان کا وزن (کلو)',
    addItem: '+ مزید جنس شامل کریں',
    removeItem: 'سامان ختم کریں',

    // Weighbridge Weights
    weighbridgeSection: 'مرحلہ 4: کانٹا ناپ وزن (خود ٹائپ کریں یا خالی چھوڑیں)',
    firstWeightGross: 'پہلا وزن (گراس / کل وزن)',
    secondWeightTare: 'دوسرا وزن (تارے / خالی وزن)',
    netWeight: 'صافی وزن (نیٹ وزن)',
    manualWeightNotice: 'توجہ: اگر وزن معلوم نہیں تو جگہ خالی چھوڑ دیں۔ پرنٹ پرچی پر کوئی نمبر نہیں چھپے گا تاکہ ہاتھ سے لکھا جا سکے!',
    calculateNetWeight: 'خودکار صافی وزن نکالیں',
    clearWeights: 'وزن خالی چھوڑیں (بغیر نمبر)',

    // Driver Info Section at Bottom
    driverBottomSection: 'ڈرائیور کی معلومات (پرنٹ پرچی کے نیچے دکھائے گی)',

    // Remarks & Actions
    remarks: 'خاص ریمارکس / نوٹ',
    remarksPlaceholder: 'کوئی خاص ہدایت یا معلومات...',
    saveAndPrint: 'محفوظ کریں اور A5 پرچی پرنٹ کریں',
    saveOnly: 'پاس محفوظ کریں',
    cancel: 'منسوخ / واپس',

    // Statuses
    status: 'حالت',
    vehicleEntered: 'فیکٹری کے اندر',
    vehicleExited: 'فیکٹری سے باہر',
    pending: 'زیر التوا',
    completed: 'مکمل',
    cancelled: 'منسوخ شدہ',

    // Table & List Headers
    searchPlaceholder: 'پاس نمبر، گاڑی، ڈرائیور، یا پارٹی تلاش کریں...',
    actions: 'کارروائی',
    viewDetails: 'دیکھیں',
    edit: 'ترمیم',
    print: 'پرنٹ',
    delete: 'حذف',
    noRecords: 'کوئی ریکارڈ نہیں ملا۔',

    // Common
    successMsg: 'گیٹ پاس کامیابی سے محفوظ ہو گیا!',
    blankWeightText: 'خالی (پرنٹ میں ہاتھ سے لکھنے کی لکیر چھپے گی)'
  }
};
