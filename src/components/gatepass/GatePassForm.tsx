/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Unified Gate Pass Form Component (IGP / OGP)
 * Features: Transport Company Title, Manual Weights (Blank handling), Driver Info at bottom, Kid-Simple UI & Urdu
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Trash2,
  Save,
  Printer,
  X,
  AlertTriangle,
  Scale,
  Calendar,
  Clock,
  Truck,
  User as UserIcon,
  Building2,
  Package,
  FileText,
  CheckCircle2,
  Eraser,
  Sparkles
} from 'lucide-react';
import { useGatePass } from '../../context/GatePassContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { dbRepository } from '../../db/storage';
import { GatePassItem, GatePassType, GatePassStatus } from '../../types';
import dayjs from 'dayjs';

interface GatePassFormProps {
  initialType?: GatePassType;
  editPassId?: string;
  onClose?: () => void;
}

export const GatePassForm: React.FC<GatePassFormProps> = ({
  initialType = 'IGP',
  editPassId,
  onClose
}) => {
  const { createGatePass, updateGatePass, isVehicleInside, setSelectedPrintPass, setActiveView, getGatePassById } = useGatePass();
  const { currentUser } = useAuth();
  const { t, isUrdu } = useLanguage();

  const productsList = dbRepository.getProducts();
  const partiesList = dbRepository.getParties();
  const vehiclesList = dbRepository.getVehicles();
  const driversList = dbRepository.getDrivers();

  const transportParties = partiesList.filter((p) => p.partyType === 'Transport Company' || p.partyType === 'Broker');

  const [type, setType] = useState<GatePassType>(initialType);
  const [gatePassNo, setGatePassNo] = useState<string>('');
  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [time, setTime] = useState<string>(dayjs().format('HH:mm:ss'));

  // Step 1: Vehicle & Driver
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('Bedford Truck');
  const [driverName, setDriverName] = useState<string>('');
  const [driverPhone, setDriverPhone] = useState<string>('');
  const [driverCnic, setDriverCnic] = useState<string>('');

  // Step 2: Party & Transport Company
  const [partyId, setPartyId] = useState<string>('');
  const [partyName, setPartyName] = useState<string>('');
  const [transporterName, setTransporterName] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [status, setStatus] = useState<GatePassStatus>('Vehicle Entered');
  const [remarks, setRemarks] = useState<string>('');

  // Step 3: Product Items
  const [items, setItems] = useState<GatePassItem[]>([
    {
      id: `gpi_${Date.now()}_1`,
      productId: productsList[0]?.id || '',
      productName: productsList[0]?.name || 'Whole Chana (Raw Desi)',
      bagSizeKg: 50,
      packingType: 'Jute Bag',
      numberOfBags: 100,
      weightPerBagKg: 50,
      grossWeightKg: 5000,
      remarks: ''
    }
  ]);

  // Step 4: Weighbridge Weights (Manual Entry & Blank Option)
  const [firstWeightKg, setFirstWeightKg] = useState<string | number>(5000);
  const [secondWeightKg, setSecondWeightKg] = useState<string | number>(0);
  const [netWeightKg, setNetWeightKg] = useState<string | number>(5000);
  const [isManualNet, setIsManualNet] = useState<boolean>(false);

  // Quick Add Master Modals
  const [isNewPartyModalOpen, setIsNewPartyModalOpen] = useState(false);
  const [newPartyName, setNewPartyName] = useState('');
  const [newPartyType, setNewPartyType] = useState<'Supplier' | 'Customer' | 'Transport Company' | 'Broker'>('Supplier');
  const [newPartyPhone, setNewPartyPhone] = useState('');
  const [newPartyCity, setNewPartyCity] = useState('Gujranwala');

  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'Raw Grain' | 'Finished Daal' | 'By-Product' | 'Packaging Material'>('Finished Daal');
  const [newProductPacking, setNewProductPacking] = useState<'Jute Bag' | 'PP Bag' | 'Poly Pack' | 'Bulk'>('PP Bag');
  const [newProductBagSize, setNewProductBagSize] = useState<number>(50);

  // Warning & Errors
  const [vehicleWarning, setVehicleWarning] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync initialType when prop changes or on initial load
  useEffect(() => {
    if (!editPassId) {
      setType(initialType);
      const generated = dbRepository.generateNextGatePassNumber(initialType);
      setGatePassNo(generated);
    }
  }, [initialType, editPassId]);

  // Initialize auto-numbering or populate existing pass
  useEffect(() => {
    if (editPassId) {
      const existing = getGatePassById(editPassId);
      if (existing) {
        setType(existing.type);
        setGatePassNo(existing.gatePassNo);
        setDate(existing.date);
        setTime(existing.time);
        setVehicleNumber(existing.vehicleNumber);
        setVehicleType(existing.vehicleType || 'Bedford Truck');
        setDriverName(existing.driverName);
        setDriverPhone(existing.driverPhone);
        setDriverCnic(existing.driverCnic || '');
        setPartyId(existing.partyId);
        setPartyName(existing.partyName);
        setTransporterName(existing.transporterName || '');
        setReferenceNumber(existing.referenceNumber);
        setStatus(existing.status);
        setRemarks(existing.remarks || '');
        setItems(existing.items);
        setFirstWeightKg(existing.weighment?.firstWeightKg ?? '');
        setSecondWeightKg(existing.weighment?.secondWeightKg ?? '');
        setNetWeightKg(existing.weighment?.netWeightKg ?? '');
      }
    }
  }, [editPassId]);

  // Duplicate vehicle check
  useEffect(() => {
    if (vehicleNumber.trim().length > 2) {
      const isInside = isVehicleInside(vehicleNumber, editPassId);
      if (isInside) {
        setVehicleWarning(
          `⚠️ WARNING: Vehicle "${vehicleNumber.toUpperCase()}" is already registered INSIDE the factory!`
        );
      } else {
        setVehicleWarning(null);
      }
    } else {
      setVehicleWarning(null);
    }
  }, [vehicleNumber, editPassId]);

  // Auto-fill party
  const handlePartySelect = (id: string) => {
    setPartyId(id);
    const selected = partiesList.find((p) => p.id === id);
    if (selected) {
      setPartyName(selected.companyName);
    }
  };

  // Auto-fill vehicle & driver details
  const handleVehicleSelect = (vehNum: string) => {
    setVehicleNumber(vehNum);
    const selectedVeh = vehiclesList.find((v) => v.vehicleNumber === vehNum);
    if (selectedVeh) {
      setVehicleType(selectedVeh.vehicleType);
      if (selectedVeh.transporterName) {
        setTransporterName(selectedVeh.transporterName);
      }
    }

    const matchingDriver = driversList.find((d) => d.assignedVehicleNumber === vehNum);
    if (matchingDriver) {
      setDriverName(matchingDriver.name);
      setDriverPhone(matchingDriver.phone);
      setDriverCnic(matchingDriver.cnic || '');
    }
  };

  const handleSaveNewParty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartyName.trim() || !currentUser) return;
    const created = dbRepository.saveParty(
      {
        companyName: newPartyName.trim(),
        partyType: newPartyType,
        phone: newPartyPhone.trim(),
        city: newPartyCity.trim() || 'Gujranwala',
        status: 'Active'
      },
      currentUser
    );
    setPartyId(created.id);
    setPartyName(created.companyName);
    setIsNewPartyModalOpen(false);
    setNewPartyName('');
    setNewPartyPhone('');
  };

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !currentUser) return;
    const created = dbRepository.saveProduct(
      {
        name: newProductName.trim(),
        category: newProductCategory,
        packingType: newProductPacking,
        bagSizeKg: Number(newProductBagSize) || 50,
        defaultWeightKg: Number(newProductBagSize) || 50,
        status: 'Active'
      },
      currentUser
    );
    const newItemRow: GatePassItem = {
      id: `gpi_${Date.now()}`,
      productId: created.id,
      productName: created.name,
      bagSizeKg: created.bagSizeKg,
      packingType: created.packingType,
      numberOfBags: 100,
      weightPerBagKg: created.defaultWeightKg,
      grossWeightKg: 100 * created.defaultWeightKg,
      remarks: ''
    };
    setItems((prev) => [...prev, newItemRow]);
    setIsNewProductModalOpen(false);
    setNewProductName('');
  };

  // Item changes
  const handleItemChange = (index: number, field: keyof GatePassItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };

    if (field === 'productId') {
      const p = productsList.find((prod) => prod.id === value);
      if (p) {
        item.productName = p.name;
        item.bagSizeKg = p.bagSizeKg;
        item.packingType = p.packingType;
        item.weightPerBagKg = p.defaultWeightKg;
      }
    }

    if (field === 'numberOfBags' || field === 'weightPerBagKg') {
      const numBags = field === 'numberOfBags' ? Number(value) : item.numberOfBags;
      const wtPerBag = field === 'weightPerBagKg' ? Number(value) : item.weightPerBagKg;
      item.grossWeightKg = Math.max(0, numBags * wtPerBag);
    }

    updated[index] = item;
    setItems(updated);
  };

  const handleAddRow = () => {
    const firstProd = productsList[0];
    setItems([
      ...items,
      {
        id: `gpi_${Date.now()}_${items.length + 1}`,
        productId: firstProd?.id || '',
        productName: firstProd?.name || 'Chana Daal (Special Grade A)',
        bagSizeKg: 50,
        packingType: 'PP Bag',
        numberOfBags: 50,
        weightPerBagKg: 50,
        grossWeightKg: 2500,
        remarks: ''
      }
    ]);
  };

  const handleRemoveRow = (index: number) => {
    if (items.length <= 1) {
      setErrorMessage('A Gate Pass must contain at least one product row.');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculations
  const calculatedTotalBags = items.reduce((sum, item) => sum + (Number(item.numberOfBags) || 0), 0);
  const calculatedTotalItemWeight = items.reduce((sum, item) => sum + (Number(item.grossWeightKg) || 0), 0);

  // Weight auto calculation helper
  const handleCalculateNet = () => {
    const w1 = Number(firstWeightKg) || 0;
    const w2 = Number(secondWeightKg) || 0;
    if (w1 > 0 && w2 > 0) {
      setNetWeightKg(Math.abs(w1 - w2));
    } else if (w1 > 0) {
      setNetWeightKg(w1);
    } else {
      setNetWeightKg(calculatedTotalItemWeight);
    }
    setIsManualNet(false);
  };

  // Clear weights so NO numbers print
  const handleClearWeightsToBlank = () => {
    setFirstWeightKg('');
    setSecondWeightKg('');
    setNetWeightKg('');
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent, shouldPrint = false) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!vehicleNumber.trim()) {
      setErrorMessage(isUrdu ? 'گاڑی نمبر درج کرنا ضروری ہے۔' : 'Vehicle Number is required.');
      return;
    }
    if (!driverName.trim()) {
      setErrorMessage(isUrdu ? 'ڈرائیور کا نام درج کرنا ضروری ہے۔' : 'Driver Name is required.');
      return;
    }
    if (!partyName.trim()) {
      setErrorMessage(isUrdu ? 'پارٹی / سپلائر کا نام چننا ضروری ہے۔' : 'Party / Supplier selection is required.');
      return;
    }

    const party = partiesList.find((p) => p.companyName === partyName) || partiesList[0];

    // Number conversion: empty string or NaN converts to 0/null
    const parseWt = (val: string | number) => {
      if (val === '' || val === null || val === undefined) return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    };

    const num1st = parseWt(firstWeightKg);
    const num2nd = parseWt(secondWeightKg);
    const numNet = parseWt(netWeightKg);

    const passPayload = {
      type,
      gatePassNo,
      date,
      time,
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      vehicleType,
      driverName: driverName.trim(),
      driverPhone: driverPhone.trim(),
      driverCnic: driverCnic.trim(),
      partyId: party?.id || 'party_custom',
      partyName: partyName.trim(),
      partyType: party?.partyType || (type === 'IGP' ? 'Supplier' : 'Customer'),
      transporterName: transporterName.trim(),
      referenceNumber: referenceNumber.trim() || 'N/A',
      status,
      items,
      totalBags: calculatedTotalBags,
      totalItemWeightKg: calculatedTotalItemWeight,
      weighment: {
        firstWeightKg: num1st,
        secondWeightKg: num2nd,
        netWeightKg: numNet,
        firstWeightTime: dayjs().toISOString()
      },
      remarks: remarks.trim(),
      createdById: currentUser?.id || 'usr_operator',
      createdByUsername: currentUser?.username || 'operator'
    };

    let savedPass;
    if (editPassId) {
      savedPass = updateGatePass(editPassId, passPayload);
    } else {
      savedPass = createGatePass(passPayload);
    }

    if (savedPass) {
      if (shouldPrint) {
        setSelectedPrintPass(savedPass);
      }
      if (onClose) {
        onClose();
      } else {
        setActiveView('register');
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto font-sans select-none pb-20">
      {/* Top Header & Type Switcher */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 mb-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl font-bold ${type === 'IGP' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}>
            {type === 'IGP' ? <ArrowDownRight className="w-7 h-7" /> : <ArrowUpRight className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-wide">
                {type === 'IGP' ? t('inboundIGP') : t('outboundOGP')}
              </h2>
              <span className="bg-slate-800 text-slate-300 font-mono text-xs px-2.5 py-1 rounded-lg border border-slate-700">
                {gatePassNo}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isUrdu ? 'گاڑی کے داخلے اور مال کی روانگی کی پرچی بنانے کا آسان فارم' : 'Easy step-by-step form for factory gate vouchers'}
            </p>
          </div>
        </div>

        {/* Big IGP / OGP Toggle Buttons */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-full md:w-auto justify-center">
          <button
            type="button"
            onClick={() => {
              setType('IGP');
              if (!editPassId) setGatePassNo(dbRepository.generateNextGatePassNumber('IGP'));
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-extrabold text-xs transition-all ${
              type === 'IGP' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>1. IN (آمدی - IGP)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setType('OGP');
              if (!editPassId) setGatePassNo(dbRepository.generateNextGatePassNumber('OGP'));
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-extrabold text-xs transition-all ${
              type === 'OGP' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>2. OUT (روانگی - OGP)</span>
          </button>
        </div>
      </div>

      {/* Error / Warning Banners */}
      {errorMessage && (
        <div className="mb-4 bg-rose-500/10 border-2 border-rose-500 text-rose-600 dark:text-rose-300 p-4 rounded-xl text-sm font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-rose-500/20 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {vehicleWarning && (
        <div className="mb-4 bg-amber-500/10 border-2 border-amber-500 text-amber-700 dark:text-amber-300 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{vehicleWarning}</span>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* STEP 1: TRUCK & DRIVER DETAILS */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">
              1
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>{t('vehicleAndDriver')}</span>
              </h3>
              <p className="text-xs text-slate-500">{isUrdu ? 'گاڑی کا نمبر اور ڈرائیور کی معلومات درج کریں' : 'Truck registration, driver details & phone'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vehicle Number Select / Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('vehicleNumber')} *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder={t('vehicleNumberPlaceholder')}
                  className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold uppercase text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="mt-1 flex gap-1 flex-wrap">
                {vehiclesList.slice(0, 4).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleVehicleSelect(v.vehicleNumber)}
                    className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
                  >
                    + {v.vehicleNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('vehicleType')}
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
              >
                <option value="Bedford Truck">Bedford Truck (بیڈفورڈ ٹرک)</option>
                <option value="Trailer">Trailer (ٹرالر 10/22 ویلر)</option>
                <option value="Mazda 6-Wheeler">Mazda 6-Wheeler (مزدا 6 ویلر)</option>
                <option value="Tractor Trolley">Tractor Trolley (ٹریکٹر ٹرالی)</option>
                <option value="Dumper">Dumper (ڈمپر)</option>
                <option value="Pickup">Pickup / Shahzore (شہزور / پک اپ)</option>
              </select>
            </div>

            {/* Driver Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('driverName')} *
              </label>
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder={t('driverNamePlaceholder')}
                className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Driver Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('driverPhone')}
              </label>
              <input
                type="text"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder={t('driverPhonePlaceholder')}
                className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Driver CNIC */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('driverCnic')}
              </label>
              <input
                type="text"
                value={driverCnic}
                onChange={(e) => setDriverCnic(e.target.value)}
                placeholder={t('driverCnicPlaceholder')}
                className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Visual Notice for Driver Section on Print Voucher */}
          <div className="mt-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-2.5 rounded-xl text-xs text-blue-900 dark:text-blue-300 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>{t('driverBottomSection')}</span>
            </span>
            <span className="font-mono text-[11px] font-bold">
              {driverName || '____'} | {driverPhone || '____'} | CNIC: {driverCnic || '____'}
            </span>
          </div>
        </div>

        {/* STEP 2: PARTY & TRANSPORT COMPANY */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
              2
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>{t('partyAndTransport')}</span>
              </h3>
              <p className="text-xs text-slate-500">{isUrdu ? 'سپلائر / گاہک کی پارٹی اور ٹرانسپورٹ کمپنی کا نام درج کریں' : 'Select Party, Transporter Title & Bilty reference'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Party Name Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('partyName')} *
                </label>
                <button
                  type="button"
                  onClick={() => setIsNewPartyModalOpen(true)}
                  className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isUrdu ? '+ نئی پارٹی' : '+ New Party'}</span>
                </button>
              </div>
              <select
                required
                value={partyId}
                onChange={(e) => handlePartySelect(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">{t('selectParty')}</option>
                {partiesList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.companyName} ({p.partyType}) - {p.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Transport Company Title Field (ALWAYS INCLUDED IN BOTH FORMS) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('transportCompanyTitle')}
              </label>
              <div className="space-y-1">
                <input
                  type="text"
                  value={transporterName}
                  onChange={(e) => setTransporterName(e.target.value)}
                  placeholder={t('transportCompanyPlaceholder')}
                  className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
                <div className="flex gap-1 flex-wrap">
                  {transportParties.slice(0, 3).map((tp) => (
                    <button
                      key={tp.id}
                      type="button"
                      onClick={() => setTransporterName(tp.companyName)}
                      className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold"
                    >
                      + {tp.companyName}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bilty / Reference Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('referenceNumber')}
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder={t('referencePlaceholder')}
                className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Pass Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('status')}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GatePassStatus)}
                className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Vehicle Entered">{t('vehicleEntered')}</option>
                <option value="Pending">{t('pending')}</option>
                <option value="Completed">{t('completed')}</option>
                <option value="Vehicle Exited">{t('vehicleExited')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* STEP 3: PRODUCTS & BAGS TABLE */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-sm">
                3
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  <span>{t('productsAndBags')}</span>
                </h3>
                <p className="text-xs text-slate-500">{isUrdu ? 'دال / جنس کا نام اور بوریوں کی تعداد درج کریں' : 'Product items, bag counts and weight per bag'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsNewProductModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{isUrdu ? '+ نئی جنس / دال' : '+ New Item'}</span>
              </button>
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{t('addItem')}</span>
              </button>
            </div>
          </div>

          {/* Product Items List */}
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    {t('productName')}
                  </label>
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100"
                  >
                    {productsList.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} ({prod.packingType})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    {t('packingType')}
                  </label>
                  <select
                    value={item.packingType}
                    onChange={(e) => handleItemChange(idx, 'packingType', e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100"
                  >
                    <option value="Jute Bag">Jute Bag (جوٹ بوری)</option>
                    <option value="PP Bag">PP Plastic Bag (پی پی بوری)</option>
                    <option value="Poly Pack">Poly Pack (پولی پیک)</option>
                    <option value="Bulk">Bulk (بلک بغیر بوری)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    {t('numberOfBags')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.numberOfBags}
                    onChange={(e) => handleItemChange(idx, 'numberOfBags', e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    {t('weightPerBag')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.weightPerBagKg}
                    onChange={(e) => handleItemChange(idx, 'weightPerBagKg', e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-between gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      {t('grossItemWeight')}
                    </label>
                    <span className="font-mono font-black text-sm text-purple-700 dark:text-purple-300 block">
                      {item.grossWeightKg.toLocaleString()} kg
                    </span>
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950 rounded-lg transition-colors"
                      title={t('removeItem')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Totals Summary */}
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl flex items-center justify-between font-bold text-sm">
            <span>{isUrdu ? 'کل بوریاں اور سامان کا وزن:' : 'TOTAL BAGS & GOODS WEIGHT:'}</span>
            <div className="flex items-center gap-4 font-mono">
              <span className="bg-purple-600 text-white px-3 py-1 rounded-lg">
                {calculatedTotalBags} {isUrdu ? 'بوریاں' : 'Bags'}
              </span>
              <span className="text-purple-900 dark:text-purple-200 font-black text-base">
                {calculatedTotalItemWeight.toLocaleString()} kg
              </span>
            </div>
          </div>
        </div>

        {/* STEP 4: WEIGHBRIDGE WEIGHTS (MANUAL WRITE & LEAVE BLANK OPTION) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-sm">
                4
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-600" />
                  <span>{t('weighbridgeSection')}</span>
                </h3>
                <p className="text-xs text-slate-500">{t('manualWeightNotice')}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearWeightsToBlank}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs border border-slate-300 dark:border-slate-700 transition-all"
            >
              <Eraser className="w-4 h-4 text-amber-600" />
              <span>{t('clearWeights')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1st Weight (Gross) */}
            <div className="p-3 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl">
              <label className="block text-xs font-bold text-amber-900 dark:text-amber-300 mb-1">
                {t('firstWeightGross')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={firstWeightKg}
                  onChange={(e) => setFirstWeightKg(e.target.value)}
                  placeholder="e.g. 15000 (خالی رکھیں)"
                  className="w-full bg-white dark:bg-slate-950 border-2 border-amber-400 rounded-xl px-3 py-2 text-base font-black font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">kg</span>
              </div>
            </div>

            {/* 2nd Weight (Tare) */}
            <div className="p-3 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl">
              <label className="block text-xs font-bold text-amber-900 dark:text-amber-300 mb-1">
                {t('secondWeightTare')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={secondWeightKg}
                  onChange={(e) => setSecondWeightKg(e.target.value)}
                  placeholder="e.g. 5000 (خالی رکھیں)"
                  className="w-full bg-white dark:bg-slate-950 border-2 border-amber-400 rounded-xl px-3 py-2 text-base font-black font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">kg</span>
              </div>
            </div>

            {/* Net Weight */}
            <div className="p-3 bg-emerald-500/10 border-2 border-emerald-500 rounded-2xl">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-extrabold text-emerald-900 dark:text-emerald-300">
                  {t('netWeight')}
                </label>
                <button
                  type="button"
                  onClick={handleCalculateNet}
                  className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md hover:bg-emerald-700"
                >
                  {t('calculateNetWeight')}
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={netWeightKg}
                  onChange={(e) => {
                    setNetWeightKg(e.target.value);
                    setIsManualNet(true);
                  }}
                  placeholder="Net Weight (خالی رکھیں)"
                  className="w-full bg-white dark:bg-slate-950 border-2 border-emerald-500 rounded-xl px-3 py-2 text-base font-black font-mono text-emerald-900 dark:text-emerald-300 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs text-emerald-600 font-bold">kg</span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-500 italic bg-slate-100 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            💡 <span className="font-bold">{isUrdu ? 'پرنٹ نوٹ:' : 'Print Slip Behavior:'}</span> {isUrdu ? 'اگر اوپر وزن کے خانے خالی چھوڑ دیں تو پرنٹ شدہ پرچی پر کوئی نمبر نہیں چھپے گا اور ہاتھ سے وزن لکھنے کی لکیر آئیں گی۔' : 'If weight fields are empty or zero, NO numbers will be printed on the A5 voucher so scale operators can write by hand!'}
          </div>
        </div>

        {/* REMARKS */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {t('remarks')}
          </label>
          <textarea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={t('remarksPlaceholder')}
            className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        </div>

        {/* GIANT ACTION BUTTONS FOR KID-SIMPLE OPERATION */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose || (() => setActiveView('register'))}
            className="w-full sm:w-auto px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold rounded-2xl text-sm transition-all"
          >
            {t('cancel')}
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-sm shadow-md transition-all border border-slate-700"
          >
            {t('saveOnly')}
          </button>

          {/* GIANT PRIMARY SAVE & PRINT BUTTON */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base rounded-2xl shadow-xl transition-all scale-105 ring-4 ring-emerald-400/30 active:scale-100"
          >
            <Printer className="w-6 h-6" />
            <span>{t('saveAndPrint')}</span>
          </button>
        </div>
      </form>

      {/* Quick Add Party Modal */}
      {isNewPartyModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>{isUrdu ? 'نئی پارٹی کا اندراج' : 'Quick Add New Party'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewPartyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewParty} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isUrdu ? 'پارٹی / کمپنی کا نام' : 'Company Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={newPartyName}
                  onChange={(e) => setNewPartyName(e.target.value)}
                  placeholder="e.g. Madina Trading Co."
                  className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isUrdu ? 'نوعیت' : 'Type'}
                  </label>
                  <select
                    value={newPartyType}
                    onChange={(e) => setNewPartyType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-slate-100"
                  >
                    <option value="Supplier">Supplier (سپلائر)</option>
                    <option value="Customer">Customer (گاہک)</option>
                    <option value="Transport Company">Transport Company (ٹرانسپورٹ)</option>
                    <option value="Broker">Broker (بروکر / آڑھتی)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isUrdu ? 'شہر' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={newPartyCity}
                    onChange={(e) => setNewPartyCity(e.target.value)}
                    placeholder="Gujranwala"
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isUrdu ? 'فون / موبائل' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={newPartyPhone}
                  onChange={(e) => setNewPartyPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewPartyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 dark:bg-slate-800"
                >
                  {isUrdu ? 'منسوخ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md"
                >
                  {isUrdu ? 'محفوظ کریں' : 'Save & Select Party'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Product Modal */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span>{isUrdu ? 'نئی دال / جنس کا اندراج' : 'Quick Add New Product'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewProductModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isUrdu ? 'دال / جنْس کا نام' : 'Product Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Masoor Daal Wash Grade A"
                  className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isUrdu ? 'زمرہ (کیٹیگری)' : 'Category'}
                  </label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-slate-100"
                  >
                    <option value="Finished Daal">Finished Daal (تیار دال)</option>
                    <option value="Raw Grain">Raw Grain (خام جنس / جنس)</option>
                    <option value="By-Product">By-Product (چھلکا / سُنڈی)</option>
                    <option value="Packaging Material">Packaging (پیکنگ مٹیریل)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isUrdu ? 'پیکنگ کی قسم' : 'Packing'}
                  </label>
                  <select
                    value={newProductPacking}
                    onChange={(e) => setNewProductPacking(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-slate-100"
                  >
                    <option value="Jute Bag">Jute Bag (سن بوری)</option>
                    <option value="PP Bag">PP Bag (پلاسٹک بوری)</option>
                    <option value="Poly Pack">Poly Pack (پولی پیک)</option>
                    <option value="Bulk">Bulk (کھلا / بلک)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isUrdu ? 'وزن فی بوری (کلو)' : 'Bag Size (kg)'}
                </label>
                <input
                  type="number"
                  value={newProductBagSize}
                  onChange={(e) => setNewProductBagSize(Number(e.target.value))}
                  placeholder="50"
                  className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 dark:bg-slate-800"
                >
                  {isUrdu ? 'منسوخ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md"
                >
                  {isUrdu ? 'اضافہ کریں' : 'Add Product to Form'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
