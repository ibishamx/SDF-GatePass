/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Gate Pass Register Component with Advanced Search, Filters, Transport Company & A5 PDF Export
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Printer,
  Edit,
  FileSpreadsheet,
  FileText,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  LogOut,
  Download,
  Building2
} from 'lucide-react';
import { useGatePass } from '../../context/GatePassContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { GatePass, GatePassStatus, GatePassType } from '../../types';
import { exportToCSV, exportGatePassesToPDF, exportGatePassToA5PDF } from '../../utils/exportUtils';
import dayjs from 'dayjs';

export const GatePassRegister: React.FC = () => {
  const { gatePasses, updateStatus, setSelectedPrintPass, setActiveView } = useGatePass();
  const { hasPermission } = useAuth();
  const { t, isUrdu } = useLanguage();

  // Filters State
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Filter Logic
  const filteredPasses = gatePasses.filter((pass) => {
    if (typeFilter !== 'ALL' && pass.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && pass.status !== statusFilter) return false;
    if (dateFrom && pass.date < dateFrom) return false;
    if (dateTo && pass.date > dateTo) return false;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchNo = pass.gatePassNo.toLowerCase().includes(q);
      const matchVeh = pass.vehicleNumber.toLowerCase().includes(q);
      const matchDriver = pass.driverName.toLowerCase().includes(q);
      const matchParty = pass.partyName.toLowerCase().includes(q);
      const matchTransporter = pass.transporterName?.toLowerCase().includes(q);
      const matchRef = pass.referenceNumber?.toLowerCase().includes(q);
      const matchPhone = pass.driverPhone?.includes(q);
      const matchProd = pass.items.some((i) => i.productName.toLowerCase().includes(q));

      if (!matchNo && !matchVeh && !matchDriver && !matchParty && !matchTransporter && !matchRef && !matchPhone && !matchProd) {
        return false;
      }
    }
    return true;
  });

  const handleExportCSV = () => {
    const dataRows = filteredPasses.map((p) => ({
      'Gate Pass No': p.gatePassNo,
      Type: p.type,
      Date: p.date,
      Time: p.time,
      'Vehicle No': p.vehicleNumber,
      Driver: p.driverName,
      'Driver Mobile': p.driverPhone,
      'Driver CNIC': p.driverCnic || '',
      'Party Name': p.partyName,
      'Transport Company': p.transporterName || '',
      'Ref Number': p.referenceNumber,
      Status: p.status,
      'Total Bags': p.totalBags,
      'Net Weight (kg)': p.weighment?.netWeightKg || p.totalItemWeightKg,
      '1st Weight (kg)': p.weighment?.firstWeightKg || '',
      '2nd Weight (kg)': p.weighment?.secondWeightKg || '',
      'Created By': p.createdByUsername,
    }));
    exportToCSV('gate_pass_register', dataRows);
  };

  const handleExportPDF = () => {
    exportGatePassesToPDF(filteredPasses, 'Gate_Pass_Register');
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto font-sans select-none">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>{t('navRegister')}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isUrdu ? `کل ${gatePasses.length} پاسوں میں سے ${filteredPasses.length} دکھائے جا رہے ہیں` : `Showing ${filteredPasses.length} of ${gatePasses.length} gate pass records`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasPermission('CREATE_GATE_PASS') && (
            <>
              <button
                onClick={() => setActiveView('new_igp')}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>+ {t('createIGPBtn')}</span>
              </button>
              <button
                onClick={() => setActiveView('new_ogp')}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>+ {t('createOGPBtn')}</span>
              </button>
            </>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel / CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t('downloadPdf')} (A5)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 text-xs">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none"
          />
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-slate-900 dark:text-slate-100 font-bold"
          >
            <option value="ALL">{isUrdu ? 'تمام قسمیں (IGP & OGP)' : 'All Types (IGP & OGP)'}</option>
            <option value="IGP">In Gate Pass (IGP)</option>
            <option value="OGP">Out Gate Pass (OGP)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-slate-900 dark:text-slate-100 font-bold"
          >
            <option value="ALL">{isUrdu ? 'تمام حالتیں' : 'All Statuses'}</option>
            <option value="Vehicle Entered">{t('vehicleEntered')}</option>
            <option value="Vehicle Exited">{t('vehicleExited')}</option>
            <option value="Pending">{t('pending')}</option>
            <option value="Completed">{t('completed')}</option>
            <option value="Cancelled">{t('cancelled')}</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-slate-900 dark:text-slate-100 font-mono"
          />
        </div>

        {/* Date To */}
        <div>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-slate-900 dark:text-slate-100 font-mono"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Pass No</th>
                <th className="p-3">Type</th>
                <th className="p-3">Date / Time</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Driver</th>
                <th className="p-3">Party Name</th>
                <th className="p-3">Transport Co.</th>
                <th className="p-3">Bags</th>
                <th className="p-3">Net Wt</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
              {filteredPasses.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500 text-xs font-bold">
                    {t('noRecords')}
                  </td>
                </tr>
              ) : (
                filteredPasses.map((pass) => (
                  <tr key={pass.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-mono font-black text-slate-900 dark:text-slate-100">{pass.gatePassNo}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md font-black text-[10px] ${
                        pass.type === 'IGP' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {pass.type}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {pass.date} <span className="text-[10px]">{pass.time.substring(0, 5)}</span>
                    </td>
                    <td className="p-3 font-mono font-black text-blue-600 dark:text-blue-400">{pass.vehicleNumber}</td>
                    <td className="p-3 font-bold">
                      <div>{pass.driverName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{pass.driverPhone}</div>
                    </td>
                    <td className="p-3 max-w-[140px] truncate">{pass.partyName}</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold max-w-[140px] truncate">
                      {pass.transporterName || '—'}
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">{pass.totalBags}</td>
                    <td className="p-3 font-mono font-bold">
                      {pass.weighment?.netWeightKg ? `${pass.weighment.netWeightKg.toLocaleString()} kg` : '____'}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pass.status === 'Completed' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                        pass.status === 'Vehicle Entered' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                        pass.status === 'Cancelled' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {pass.status}
                      </span>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Print A5 */}
                        <button
                          onClick={() => setSelectedPrintPass(pass)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                          title="A5 Print Preview"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-400" />
                          <span>A5</span>
                        </button>

                        {/* Export A5 PDF */}
                        <button
                          onClick={() => exportGatePassToA5PDF(pass)}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                          title="Export A5 PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>

                        {/* Exit Mark */}
                        {pass.status === 'Vehicle Entered' && (
                          <button
                            onClick={() => updateStatus(pass.id, 'Vehicle Exited')}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
                            title="Mark Exit"
                          >
                            Exit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
