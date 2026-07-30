/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Products Master Management Component
 */

import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2, Search, CheckCircle2 } from 'lucide-react';
import { dbRepository } from '../../db/storage';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';

export const ProductsManager: React.FC = () => {
  const { currentUser, hasPermission } = useAuth();
  const [products, setProducts] = useState<Product[]>(() => dbRepository.getProducts());
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const refreshList = () => setProducts(dbRepository.getProducts());

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editingProduct?.name) return;
    dbRepository.saveProduct(editingProduct, currentUser);
    setIsModalOpen(false);
    setEditingProduct(null);
    refreshList();
  };

  const handleDelete = (id: string) => {
    if (!currentUser) return;
    if (confirm('Are you sure you want to delete this product?')) {
      dbRepository.deleteProduct(id, currentUser);
      refreshList();
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>Products Master Catalog</span>
          </h2>
          <p className="text-xs text-slate-500">Milled Daal, Raw Pulses, Grains & By-Products ({products.length})</p>
        </div>

        {hasPermission('MANAGE_MASTERS') && (
          <button
            onClick={() => {
              setEditingProduct({
                name: '',
                category: 'Finished Daal',
                bagSizeKg: 50,
                packingType: 'PP Bag',
                defaultWeightKg: 50,
                status: 'Active'
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Product</span>
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
            placeholder="Search Products by Name or Category..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3">Product Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Bag Size (kg)</th>
              <th className="p-3">Packing Type</th>
              <th className="p-3">Default Wt (kg)</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((prod) => (
              <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{prod.name}</td>
                <td className="p-3 font-medium text-emerald-600 dark:text-emerald-400">{prod.category}</td>
                <td className="p-3 font-mono">{prod.bagSizeKg} kg</td>
                <td className="p-3">{prod.packingType}</td>
                <td className="p-3 font-mono">{prod.defaultWeightKg} kg</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    prod.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {prod.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-1">
                  {hasPermission('MANAGE_MASTERS') && (
                    <>
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-600 hover:text-emerald-600 rounded"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
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
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4 text-xs text-slate-100 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-2">
              {editingProduct.id ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={editingProduct.category || 'Finished Daal'}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                >
                  <option value="Finished Daal">Finished Daal</option>
                  <option value="Raw Pulses">Raw Pulses</option>
                  <option value="Grains">Grains</option>
                  <option value="By-Products">By-Products / Choker</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bag Size (kg)</label>
                  <input
                    type="number"
                    value={editingProduct.bagSizeKg || 50}
                    onChange={(e) => setEditingProduct({ ...editingProduct, bagSizeKg: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 font-mono text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Packing Type</label>
                  <input
                    type="text"
                    value={editingProduct.packingType || 'PP Bag'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, packingType: e.target.value })}
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
