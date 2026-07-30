/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Comprehensive Reports Module
 */

import React, { useState } from 'react';
import { BarChart3, FileSpreadsheet, FileText, Calendar, Filter, Printer } from 'lucide-react';
import { useGatePass } from '../../context/GatePassContext';
import { exportToCSV, exportGatePassesToPDF } from '../../utils/exportUtils';
import dayjs from 'dayjs';

export const ReportsView: React.FC = () => {
  const { gatePasses } = useGatePass();
  const [reportType, setReportType] = useState<string>('DAILY_REGISTER');
  const [dateFrom, setDateFrom] = useState<string>(dayjs().subtract(7, 'day').format('YYYY-MM-DD'));
  const [dateTo, setDateTo] = useState<string>(dayjs().format('YYYY-MM-DD'));

  const filteredPasses = gatePasses.filter(
    (gp) => (!dateFrom || gp.date >= dateFrom) && (!dateTo || gp.date <= dateTo)
  );

  const handleExportCSV = () => {
    const rows = filteredPasses.map((p) => ({
      'Gate Pass No': p.gatePassNo,
      Type: p.type,
      Date: p.date,
      Time: p.time,
      'Vehicle No': p.vehicleNumber,
      Driver: p.driverName,
      Party: p.partyName,
      'Reference No': p.referenceNumber,
      Bags: p.totalBags,
      'Net Weight (kg)': p.weighment?.netWeightKg || p.totalItemWeightKg,
      Status: p.status
    }));
    exportToCSV(`report_${reportType.toLowerCase()}`, rows);
  };

  const handleExportPDF = () => {
    exportGatePassesToPDF(filteredPasses, `Factory Gate Pass Report (${reportType})`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>Factory Reports & Analytics Center</span>
          </h2>
          <p className="text-xs text-slate-500">Filter and export operational gate pass records</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg text-xs border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg text-xs border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-rose-600" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Options Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-medium"
          >
            <option value="DAILY_REGISTER">Daily Gate Pass Register</option>
            <option value="VEHICLE_HISTORY">Vehicle Turnaround & Delay History</option>
            <option value="PARTY_SUMMARY">Party Wise Tonnage Ledger Summary</option>
            <option value="ITEM_MOVEMENT">Pulse Item Movement Report</option>
            <option value="WEIGHBRIDGE_LOG">Weighbridge Weight Log</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">From Date</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">To Date</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono"
          />
        </div>
      </div>

      {/* Report Table Display */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-xs flex justify-between">
          <span>{reportType.replace(/_/g, ' ')} ({filteredPasses.length} records)</span>
          <span>Period: {dateFrom || 'Start'} to {dateTo || 'End'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Gate Pass No</th>
                <th className="p-3">Type</th>
                <th className="p-3">Date</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Party Name</th>
                <th className="p-3">Total Bags</th>
                <th className="p-3">Gross Wt (kg)</th>
                <th className="p-3">Tare Wt (kg)</th>
                <th className="p-3">Net Wt (kg)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPasses.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold">{p.gatePassNo}</td>
                  <td className="p-3 font-bold">{p.type}</td>
                  <td className="p-3 font-mono">{p.date}</td>
                  <td className="p-3 font-mono font-bold text-blue-600">{p.vehicleNumber}</td>
                  <td className="p-3">{p.partyName}</td>
                  <td className="p-3 font-semibold">{p.totalBags}</td>
                  <td className="p-3 font-mono">{p.weighment?.firstWeightKg || 0}</td>
                  <td className="p-3 font-mono">{p.weighment?.secondWeightKg || 0}</td>
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {(p.weighment?.netWeightKg || p.totalItemWeightKg || 0).toLocaleString()} kg
                  </td>
                  <td className="p-3 font-semibold">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
