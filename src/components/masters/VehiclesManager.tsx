/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Vehicles Master Management Component
 */

import React, { useState } from 'react';
import { Truck, Plus, Edit, Search } from 'lucide-react';
import { dbRepository } from '../../db/storage';
import { useAuth } from '../../context/AuthContext';
import { Vehicle } from '../../types';

export const VehiclesManager: React.FC = () => {
  const { currentUser, hasPermission } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => dbRepository.getVehicles());
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVeh, setEditingVeh] = useState<Partial<Vehicle> | null>(null);

  const refreshList = () => setVehicles(dbRepository.getVehicles());

  const filtered = vehicles.filter(
    (v) =>
      v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.vehicleType.toLowerCase().includes(search.toLowerCase()) ||
      (v.transporterName && v.transporterName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editingVeh?.vehicleNumber) return;
    dbRepository.saveVehicle(editingVeh, currentUser);
    setIsModalOpen(false);
    setEditingVeh(null);
    refreshList();
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>Vehicles Fleet Master</span>
          </h2>
          <p className="text-xs text-slate-500">Registered Trucks, Trailers, Mazdas & Trolleys ({vehicles.length})</p>
        </div>

        {hasPermission('MANAGE_MASTERS') && (
          <button
            onClick={() => {
              setEditingVeh({
                vehicleNumber: '',
                vehicleType: 'Bedford Truck',
                capacityTons: 20,
                status: 'Active'
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Vehicle</span>
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
            placeholder="Search Vehicle Number, Type or Transporter..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3">Vehicle Number</th>
              <th className="p-3">Vehicle Type</th>
              <th className="p-3">Capacity (Tons)</th>
              <th className="p-3">Associated Transporter</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((veh) => (
              <tr key={veh.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{veh.vehicleNumber}</td>
                <td className="p-3 font-medium">{veh.vehicleType}</td>
                <td className="p-3 font-mono">{veh.capacityTons} Tons</td>
                <td className="p-3">{veh.transporterName || 'Self / Direct'}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    veh.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {veh.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {hasPermission('MANAGE_MASTERS') && (
                    <button
                      onClick={() => {
                        setEditingVeh(veh);
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
      {isModalOpen && editingVeh && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4 text-xs text-slate-100 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-2">
              {editingVeh.id ? 'Edit Vehicle Details' : 'Add New Vehicle'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vehicle Registration Number *</label>
                <input
                  type="text"
                  value={editingVeh.vehicleNumber || ''}
                  onChange={(e) => setEditingVeh({ ...editingVeh, vehicleNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. TLB-492"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Vehicle Type</label>
                  <select
                    value={editingVeh.vehicleType || 'Bedford Truck'}
                    onChange={(e) => setEditingVeh({ ...editingVeh, vehicleType: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="Bedford Truck">Bedford Truck</option>
                    <option value="Trailer">Trailer</option>
                    <option value="Mazda 6-Wheeler">Mazda 6-Wheeler</option>
                    <option value="Tractor Trolley">Tractor Trolley</option>
                    <option value="Dumper">Dumper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Capacity (Tons)</label>
                  <input
                    type="number"
                    value={editingVeh.capacityTons || 20}
                    onChange={(e) => setEditingVeh({ ...editingVeh, capacityTons: Number(e.target.value) })}
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
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
