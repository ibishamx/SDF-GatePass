/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Parties Master (Suppliers, Customers, Transporters, Brokers)
 */

import React, { useState } from 'react';
import { Building2, Plus, Edit, Trash2, Search } from 'lucide-react';
import { dbRepository } from '../../db/storage';
import { useAuth } from '../../context/AuthContext';
import { Party, PartyType } from '../../types';

export const PartiesManager: React.FC = () => {
  const { currentUser, hasPermission } = useAuth();
  const [parties, setParties] = useState<Party[]>(() => dbRepository.getParties());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParty, setEditingParty] = useState<Partial<Party> | null>(null);

  const refreshList = () => setParties(dbRepository.getParties());

  const filtered = parties.filter((p) => {
    if (typeFilter !== 'ALL' && p.partyType !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.companyName.toLowerCase().includes(q) ||
        p.contactPerson.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.phone.includes(q)
      );
    }
    return true;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editingParty?.companyName) return;
    dbRepository.saveParty(editingParty, currentUser);
    setIsModalOpen(false);
    setEditingParty(null);
    refreshList();
  };

  const handleDelete = (id: string) => {
    if (!currentUser) return;
    if (confirm('Delete party record?')) {
      dbRepository.deleteParty(id, currentUser);
      refreshList();
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span>Parties Directory</span>
          </h2>
          <p className="text-xs text-slate-500">Suppliers, Customers, Transporters & Brokers ({parties.length})</p>
        </div>

        {hasPermission('MANAGE_MASTERS') && (
          <button
            onClick={() => {
              setEditingParty({
                companyName: '',
                partyType: 'Supplier',
                contactPerson: '',
                phone: '',
                address: '',
                city: 'Gujranwala',
                status: 'Active'
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Party</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Company, Contact, City, Phone..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold"
        >
          <option value="ALL">All Party Types</option>
          <option value="Supplier">Suppliers</option>
          <option value="Customer">Customers</option>
          <option value="Transport Company">Transporters</option>
          <option value="Broker">Brokers</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3">Company Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Contact Person</th>
              <th className="p-3">Phone</th>
              <th className="p-3">City / Address</th>
              <th className="p-3">NTN Number</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((party) => (
              <tr key={party.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{party.companyName}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    party.partyType === 'Supplier' ? 'bg-emerald-100 text-emerald-800' :
                    party.partyType === 'Customer' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {party.partyType}
                  </span>
                </td>
                <td className="p-3">{party.contactPerson}</td>
                <td className="p-3 font-mono">{party.phone}</td>
                <td className="p-3">{party.city} ({party.address})</td>
                <td className="p-3 font-mono">{party.ntn || 'N/A'}</td>
                <td className="p-3 text-right space-x-1">
                  {hasPermission('MANAGE_MASTERS') && (
                    <>
                      <button
                        onClick={() => {
                          setEditingParty(party);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-600 hover:text-emerald-600 rounded"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(party.id)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingParty && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4 text-xs text-slate-100 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-2">
              {editingParty.id ? 'Edit Party Record' : 'Add New Party'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Name *</label>
                <input
                  type="text"
                  value={editingParty.companyName || ''}
                  onChange={(e) => setEditingParty({ ...editingParty, companyName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Party Type</label>
                  <select
                    value={editingParty.partyType || 'Supplier'}
                    onChange={(e) => setEditingParty({ ...editingParty, partyType: e.target.value as PartyType })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="Supplier">Supplier</option>
                    <option value="Customer">Customer</option>
                    <option value="Transport Company">Transport Company</option>
                    <option value="Broker">Broker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={editingParty.contactPerson || ''}
                    onChange={(e) => setEditingParty({ ...editingParty, contactPerson: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone / Mobile</label>
                  <input
                    type="text"
                    value={editingParty.phone || ''}
                    onChange={(e) => setEditingParty({ ...editingParty, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={editingParty.city || 'Gujranwala'}
                    onChange={(e) => setEditingParty({ ...editingParty, city: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
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
                  Save Party
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
