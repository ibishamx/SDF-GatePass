/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Users & Roles Permissions Management Component
 */

import React, { useState } from 'react';
import { Shield, Plus, Edit, UserCheck, ShieldCheck } from 'lucide-react';
import { dbRepository } from '../../db/storage';
import { useAuth } from '../../context/AuthContext';
import { User, UserRole } from '../../types';

export const UsersManager: React.FC = () => {
  const { currentUser, hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>(() => dbRepository.getUsers());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  const refreshList = () => setUsers(dbRepository.getUsers());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editingUser?.username) return;
    dbRepository.saveUser(editingUser, currentUser);
    setIsModalOpen(false);
    setEditingUser(null);
    refreshList();
  };

  const roleDescriptions: Record<UserRole, string> = {
    Administrator: 'Full system control, weight override, settings & user management.',
    'Gate Operator': 'Create & edit IGP/OGP, manage vehicles and drivers.',
    Security: 'Update gate entrance and exit timestamps.',
    Manager: 'Approve passes, view reports and operational audit logs.',
    'Read Only': 'View-only access to register & print passes.'
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Users & Role-Based Access Control (RBAC)</span>
          </h2>
          <p className="text-xs text-slate-500">Manage operator credentials and permission levels ({users.length})</p>
        </div>

        {hasPermission('MANAGE_USERS') && (
          <button
            onClick={() => {
              setEditingUser({
                username: '',
                fullName: '',
                role: 'Gate Operator',
                isActive: true
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create User Account</span>
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3">Username</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Permissions Summary</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">{u.username}</td>
                <td className="p-3 font-medium">{u.fullName}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    u.role === 'Administrator' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                    u.role === 'Gate Operator' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    u.role === 'Manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs truncate">
                  {roleDescriptions[u.role]}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    u.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {u.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {hasPermission('MANAGE_USERS') && (
                    <button
                      onClick={() => {
                        setEditingUser(u);
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

      {/* Edit User Modal */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4 text-xs text-slate-100 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-2">
              {editingUser.id ? 'Edit User Credentials' : 'Create New User Account'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Username *</label>
                <input
                  type="text"
                  value={editingUser.username || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.fullName || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Role</label>
                <select
                  value={editingUser.role || 'Gate Operator'}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-semibold"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Gate Operator">Gate Operator</option>
                  <option value="Security">Security</option>
                  <option value="Manager">Manager</option>
                  <option value="Read Only">Read Only</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="userActive"
                  checked={editingUser.isActive ?? true}
                  onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="userActive" className="text-slate-300 font-semibold cursor-pointer">
                  Account Active / Enabled
                </label>
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
                  Save User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
