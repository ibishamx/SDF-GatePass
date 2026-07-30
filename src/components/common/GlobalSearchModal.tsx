/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Global Search Modal (Ctrl+K)
 */

import React, { useState, useEffect } from 'react';
import { Search, X, Printer, Truck, FileText, ArrowRight } from 'lucide-react';
import { useGatePass } from '../../context/GatePassContext';
import { dbRepository } from '../../db/storage';
import { GatePass } from '../../types';

export const GlobalSearchModal: React.FC = () => {
  const { isGlobalSearchOpen, setIsGlobalSearchOpen, gatePasses, setSelectedPrintPass, setActiveView } = useGatePass();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isGlobalSearchOpen) {
      setQuery('');
    }
  }, [isGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const results = query.trim()
    ? gatePasses.filter((gp) => {
        const q = query.toLowerCase().trim();
        return (
          gp.gatePassNo.toLowerCase().includes(q) ||
          gp.vehicleNumber.toLowerCase().includes(q) ||
          gp.driverName.toLowerCase().includes(q) ||
          gp.partyName.toLowerCase().includes(q) ||
          gp.driverPhone?.includes(q) ||
          gp.referenceNumber?.toLowerCase().includes(q) ||
          gp.items.some((i) => i.productName.toLowerCase().includes(q))
        );
      })
    : gatePasses.slice(0, 5);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-16 p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <Search className="w-4 h-4 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Gate Passes, Vehicles, Drivers, Suppliers, Customers..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-800/60 p-2">
          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No records found matching "{query}"
            </div>
          ) : (
            results.map((pass) => (
              <div
                key={pass.id}
                className="p-3 hover:bg-slate-800/80 rounded-lg transition-colors flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      pass.type === 'IGP' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                    }`}
                  >
                    {pass.type}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-100">{pass.gatePassNo}</span>
                      <span className="text-slate-500 font-mono text-[10px]">• {pass.date}</span>
                    </div>
                    <div className="text-slate-300 mt-0.5">
                      <span className="font-mono font-bold text-blue-400">{pass.vehicleNumber}</span> ({pass.driverName}) — {pass.partyName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-300">{pass.totalBags} Bags</span>

                  <button
                    onClick={() => {
                      setSelectedPrintPass(pass);
                      setIsGlobalSearchOpen(false);
                    }}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded"
                    title="Print Gate Pass"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
          <span>Esc to close</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
};
