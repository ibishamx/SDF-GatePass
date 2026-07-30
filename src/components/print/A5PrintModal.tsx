/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * A5 Print Preview Modal Container
 */

import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { GatePass } from '../../types';
import { A5PrintTemplate } from './A5PrintTemplate';
import { exportGatePassToA5PDF } from '../../utils/exportUtils';
import { useLanguage } from '../../context/LanguageContext';

interface A5PrintModalProps {
  gatePass: GatePass;
  onClose: () => void;
}

export const A5PrintModal: React.FC<A5PrintModalProps> = ({ gatePass, onClose }) => {
  const { isUrdu } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  const handlePdfDownload = () => {
    exportGatePassToA5PDF(gatePass);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header Controls */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>{isUrdu ? 'A5 گیٹ پاس پرنٹ پریویو' : 'A5 Gate Pass Print Preview'}</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">{gatePass.gatePassNo} • Single Page A5 Portrait</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePdfDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isUrdu ? 'ڈاؤن لوڈ PDF' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition-all ring-2 ring-emerald-400/30"
            >
              <Printer className="w-4 h-4" />
              <span>{isUrdu ? 'پرنٹ A5 پرچی' : 'Print A5 Slip'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Render Area */}
        <div className="p-6 overflow-y-auto bg-slate-950 flex justify-center">
          <div id="printable-area">
            <A5PrintTemplate gatePass={gatePass} />
          </div>
        </div>
      </div>
    </div>
  );
};
