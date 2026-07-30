/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Audit Trail & Security Logs Viewer Component
 */

import React, { useState } from 'react';
import { History, ShieldAlert, Search, Filter } from 'lucide-react';
import { dbRepository } from '../../db/storage';
import { AuditLog } from '../../types';
import dayjs from 'dayjs';

export const AuditLogView: React.FC = () => {
  const [logs] = useState<AuditLog[]>(() => dbRepository.getAuditLogs());
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const filtered = logs.filter((log) => {
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        log.username.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <span>System Audit & Security Logs</span>
          </h2>
          <p className="text-xs text-slate-500">Immutable trail of operator actions & weight adjustments ({logs.length})</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold"
        >
          <option value="ALL">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="WEIGHT_OVERRIDE">WEIGHT OVERRIDE</option>
          <option value="APPROVE">APPROVE</option>
          <option value="CANCEL">CANCEL</option>
          <option value="LOGIN">LOGIN</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Operator</th>
              <th className="p-3">Role</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target Module</th>
              <th className="p-3">Audit Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3 text-slate-500">{dayjs(log.timestamp).format('YYYY-MM-DD HH:mm:ss')}</td>
                <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{log.username}</td>
                <td className="p-3">{log.userRole}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.action === 'WEIGHT_OVERRIDE' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                    log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-800' :
                    log.action === 'APPROVE' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-3">{log.entityType}</td>
                <td className="p-3 font-sans text-slate-800 dark:text-slate-200 max-w-md">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
