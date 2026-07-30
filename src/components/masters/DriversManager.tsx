/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Drivers Master Component
 */

import React, { useState } from 'react';
import { Users, Plus, Edit, Search } from 'lucide-react';
import { dbRepository } from '../../db/storage';
import { useAuth } from '../../context/AuthContext';
import { Driver } from '../../types';

export const DriversManager: React.FC = () => {
  const { currentUser, hasPermission } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>(() => dbRepository.getDrivers());
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Partial<Driver> | null>(null);

  const refreshList = () => setDrivers(dbRepository.getDrivers());

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.cnic.includes(search) ||
      d.phone.includes(search)
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editingDriver?.name) return;
    dbRepository.saveDriver(editingDriver, currentUser);
    setIsModalOpen(false);
    setEditingDriver(null);
    refreshList();
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>Drivers Master Directory</span>
          </h2>
          <p className="text-xs text-slate-500">Logistics Drivers CNIC & License Directory ({drivers.length})</p>
        </div>

        {hasPermission('MANAGE_MASTERS') && (
          <button
            onClick={() => {
              setEditingDriver({
                name: '',
                fatherName: '',
                cnic: '',
                phone: '',
                status: 'Active'
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Driver</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Driver Name, CNIC, Phone..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3">Driver Name</th>
              <th className="p-3">Father Name</th>
              <th className="p-3">CNIC Number</th>
              <th className="p-3">Mobile Phone</th>
              <th className="p-3">License Number</th>
              <th className="p-3">Assigned Vehicle</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((drv) => (
              <tr key={drv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{drv.name}</td>
                <td className="p-3">{drv.fatherName || '-'}</td>
                <td className="p-3 font-mono">{drv.cnic}</td>
                <td className="p-3 font-mono">{drv.phone}</td>
                <td className="p-3 font-mono">{drv.licenseNumber || 'N/A'}</td>
                <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{drv.assignedVehicleNumber || 'Unassigned'}</td>
                <td className="p-3 text-right">
                  {hasPermission('MANAGE_MASTERS') && (
                    <button
                      onClick={() => {
                        setEditingDriver(drv);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-slate-600 hover:text-emerald-600 rounded"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && editingDriver && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4 text-xs text-slate-100 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-2">
              {editingDriver.id ? 'Edit Driver Record' : 'Add New Driver'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Driver Full Name *</label>
                <input
                  type="text"
                  value={editingDriver.name || ''}
                  onChange={(e) => setEditingDriver({ ...editingDriver, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CNIC Number</label>
                  <input
                    type="text"
                    value={editingDriver.cnic || ''}
                    onChange={(e) => setEditingDriver({ ...editingDriver, cnic: e.target.value })}
                    placeholder="34101-1234567-1"
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    value={editingDriver.phone || ''}
                    onChange={(e) => setEditingDriver({ ...editingDriver, phone: e.target.value })}
                    placeholder="0300-1234567"
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                >
                  Save Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
