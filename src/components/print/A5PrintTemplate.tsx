/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Ultra-Optimized A5 Portrait Print Template Component (Bilingual English & Urdu)
 */

import React from 'react';
import { GatePass } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import dayjs from 'dayjs';

interface A5PrintTemplateProps {
  gatePass: GatePass;
}

export const A5PrintTemplate: React.FC<A5PrintTemplateProps> = ({ gatePass }) => {
  const { settings } = useSettings();
  const profile = settings.companyProfile;

  // Helper to format weights: Print NO numbers if left blank or 0
  const formatWeight = (val?: number | null) => {
    if (val === undefined || val === null || val === ('' as any) || isNaN(val) || val === 0) {
      return '____________________'; // Printed as blank line for handwriting
    }
    return `${val.toLocaleString()} kg`;
  };

  return (
    <div
      id={`a5-voucher-${gatePass.id}`}
      className="w-[148mm] min-h-[210mm] p-4 bg-white text-black font-sans select-none text-[10px] leading-snug border border-slate-400 shadow-xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 print:w-full dir-ltr"
      style={{ boxSizing: 'border-box' }}
    >
      {/* 1. Header: Company Brand */}
      <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2">
        <div>
          <h1 className="text-base font-extrabold tracking-wider uppercase text-black leading-none flex items-center gap-2">
            <span>{profile.name || 'SALEEM DAAL FACTORY'}</span>
            <span className="text-xs text-slate-700 font-bold">(سلیم دال فیکٹری)</span>
          </h1>
          <p className="text-[9px] font-semibold text-slate-700">{profile.tagline || 'High Quality Pulses Processing & Grain Mill'}</p>
          <p className="text-[8px] text-slate-600">{profile.address}, {profile.city}</p>
          <p className="text-[8px] text-slate-600 font-mono">Ph: {profile.phone} | Mob: {profile.mobile}</p>
        </div>

        <div className="text-right">
          <div className="border border-black px-2 py-0.5 text-[8px] font-mono font-bold mb-1 bg-slate-50">
            NTN: {profile.ntnNumber || '1234567-8'}
          </div>
          <div className="text-[8px] text-slate-600 font-mono">
            STRN: {profile.strnNumber || '99887766-5'}
          </div>
        </div>
      </div>

      {/* 2. Badge Title */}
      <div className="flex items-center justify-between mb-2 bg-slate-100 border border-black px-2 py-1">
        <span className="font-extrabold text-sm uppercase font-mono tracking-wider flex items-center gap-2">
          <span>{gatePass.type === 'IGP' ? 'IN GATE PASS (IGP)' : 'OUT GATE PASS (OGP)'}</span>
          <span className="text-xs font-bold text-slate-800">
            ({gatePass.type === 'IGP' ? 'ان گیٹ پاس - آمدی' : 'آؤٹ گیٹ پاس - روانگی'})
          </span>
        </span>
        <span className="font-mono font-black text-sm tracking-wider bg-white px-2 py-0.5 border border-black">
          {gatePass.gatePassNo}
        </span>
      </div>

      {/* 3. Key Logistics Details Grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border border-black p-2 mb-2 text-[9px] bg-slate-50/50">
        <div>
          <span className="font-bold">Date & Time / تاریخ و وقت: </span>
          <span className="font-mono font-semibold">{gatePass.date} {gatePass.time}</span>
        </div>

        <div>
          <span className="font-bold">Vehicle No / گاڑی نمبر: </span>
          <span className="font-mono font-black text-[12px] underline text-black bg-yellow-100 px-1 border border-slate-400">{gatePass.vehicleNumber || '_____________'}</span>
        </div>

        <div>
          <span className="font-bold">{gatePass.type === 'IGP' ? 'Supplier Party / سپلائر: ' : 'Customer Party / گاہک: '}</span>
          <span className="font-bold text-slate-900">{gatePass.partyName || '________________________'}</span>
        </div>

        <div>
          <span className="font-bold">Bilty / Ref No / بلٹی نمبر: </span>
          <span className="font-mono font-semibold">{gatePass.referenceNumber || 'N/A'}</span>
        </div>

        <div className="col-span-2 border-t border-slate-300 pt-1">
          <span className="font-bold">Transport Company / ٹرانسپورٹ کمپنی: </span>
          <span className="font-bold text-slate-900">{gatePass.transporterName || '________________________________________'}</span>
        </div>
      </div>

      {/* 4. Product Item Table */}
      <div className="mb-2">
        <table className="w-full border-collapse border border-black text-[9px]">
          <thead>
            <tr className="bg-slate-200 border-b border-black text-center font-bold">
              <th className="border-r border-black p-1 w-6">#</th>
              <th className="border-r border-black p-1 text-left">Product / جنس کی تفصیل</th>
              <th className="border-r border-black p-1 w-20">Packing / پیکنگ</th>
              <th className="border-r border-black p-1 w-12">Bags / بوریاں</th>
              <th className="border-r border-black p-1 w-16">Wt/Bag / وزن</th>
              <th className="p-1 w-24 text-right">Total Wt (کلو)</th>
            </tr>
          </thead>
          <tbody>
            {gatePass.items && gatePass.items.length > 0 ? (
              gatePass.items.map((item, index) => (
                <tr key={item.id || index} className="border-b border-black/40 text-center">
                  <td className="border-r border-black p-1 font-mono">{index + 1}</td>
                  <td className="border-r border-black p-1 text-left font-bold">{item.productName}</td>
                  <td className="border-r border-black p-1">{item.packingType} ({item.bagSizeKg}kg)</td>
                  <td className="border-r border-black p-1 font-bold font-mono text-[10px]">{item.numberOfBags}</td>
                  <td className="border-r border-black p-1 font-mono">{item.weightPerBagKg} kg</td>
                  <td className="p-1 text-right font-mono font-bold">{item.grossWeightKg ? item.grossWeightKg.toLocaleString() : '—'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-2 text-slate-500 italic">No Items Listed</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold border-t border-black text-center">
              <td colSpan={3} className="border-r border-black p-1 text-right uppercase">
                TOTAL BAGS & WEIGHT / کل بوریاں و وزن:
              </td>
              <td className="border-r border-black p-1 font-mono font-black text-xs bg-yellow-50">
                {gatePass.totalBags || 0}
              </td>
              <td className="border-r border-black p-1"></td>
              <td className="p-1 text-right font-mono font-black text-xs">
                {gatePass.totalItemWeightKg ? `${gatePass.totalItemWeightKg.toLocaleString()} kg` : '—'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 5. Weighbridge Section (Manual or Blank Line Format) */}
      <div className="border-2 border-black p-2 mb-2 bg-slate-50">
        <div className="font-black uppercase tracking-wider text-[8px] border-b border-black pb-0.5 mb-1 text-black flex justify-between">
          <span>WEIGHBRIDGE SLIP / کانٹا وزن کی تفصیل</span>
          <span className="text-slate-600 font-normal">If blank, write manually below</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-[9px]">
          <div className="p-1 border border-slate-300 bg-white">
            <span className="block text-slate-600 text-[8px] font-bold">1st Weight / پہلا وزن (گراس)</span>
            <span className="font-mono font-bold text-xs text-black block mt-0.5">
              {formatWeight(gatePass.weighment?.firstWeightKg)}
            </span>
          </div>

          <div className="p-1 border border-slate-300 bg-white">
            <span className="block text-slate-600 text-[8px] font-bold">2nd Weight / دوسرا وزن (خالی)</span>
            <span className="font-mono font-bold text-xs text-black block mt-0.5">
              {formatWeight(gatePass.weighment?.secondWeightKg)}
            </span>
          </div>

          <div className="p-1 border-2 border-black bg-yellow-50">
            <span className="block text-black font-extrabold text-[8px]">NET WEIGHT / صافی وزن</span>
            <span className="font-mono font-black text-sm text-black underline block mt-0.5">
              {formatWeight(gatePass.weighment?.netWeightKg)}
            </span>
          </div>
        </div>
      </div>

      {/* 6. Driver Info Dedicated Section at Bottom */}
      <div className="border border-black p-2 mb-2 bg-slate-100/80">
        <div className="font-bold uppercase tracking-wider text-[8px] border-b border-black pb-0.5 mb-1 text-black flex justify-between">
          <span>DRIVER INFORMATION / ڈرائیور کی مکمل معلومات</span>
          <span className="font-mono text-[7px]">Verified Security Section</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[9px]">
          <div>
            <span className="text-slate-600 block text-[8px]">Driver Name / ڈرائیور نام:</span>
            <span className="font-bold text-black font-sans">{gatePass.driverName || '_______________________'}</span>
          </div>
          <div>
            <span className="text-slate-600 block text-[8px]">Driver Mobile / فون نمبر:</span>
            <span className="font-mono font-bold text-black">{gatePass.driverPhone || '_______________________'}</span>
          </div>
          <div>
            <span className="text-slate-600 block text-[8px]">Driver CNIC / شناختی کارڈ:</span>
            <span className="font-mono font-bold text-black">{gatePass.driverCnic || '_______________________'}</span>
          </div>
        </div>
      </div>

      {/* 7. Remarks if present */}
      {gatePass.remarks && (
        <div className="mb-2 text-[8px] italic border-l-2 border-black pl-2 py-0.5 bg-slate-50">
          <span className="font-bold not-italic">Remarks / ضروری نوٹ: </span>
          {gatePass.remarks}
        </div>
      )}

      {/* 8. Quad Signatures Block */}
      <div className="grid grid-cols-4 gap-2 pt-4 pb-1 border-t-2 border-black text-[8px] text-center font-bold uppercase mt-4">
        <div>
          <div className="border-b border-black mb-1 h-5"></div>
          <span>Gate Operator / آپریٹر</span>
        </div>

        <div>
          <div className="border-b border-black mb-1 h-5"></div>
          <span>Security / سیکیورٹی</span>
        </div>

        <div>
          <div className="border-b border-black mb-1 h-5"></div>
          <span>Driver / ڈرائیور انگوٹھا</span>
        </div>

        <div>
          <div className="border-b border-black mb-1 h-5"></div>
          <span>Factory Manager / مینیجر</span>
        </div>
      </div>

      {/* 9. Print Footer Stamp */}
      <div className="flex items-center justify-between border-t border-slate-300 pt-1 text-[7px] text-slate-500 font-mono mt-1">
        <span>Printed By: {gatePass.createdByUsername || 'Gate Operator'}</span>
        <span>Date: {dayjs().format('DD-MMM-YYYY HH:mm:ss')}</span>
        <span>Saleem Daal Factory ERP v2.4</span>
      </div>
    </div>
  );
};
