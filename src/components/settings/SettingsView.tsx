/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Settings & Database Backup/Restore View
 */

import React, { useState } from 'react';
import { Settings, Database, Printer, Save, Download, Upload, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { dbRepository } from '../../db/storage';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { currentUser } = useAuth();

  const [companyProfile, setCompanyProfile] = useState(settings.companyProfile);
  const [marginTopMm, setMarginTopMm] = useState(settings.marginTopMm);
  const [marginBottomMm, setMarginBottomMm] = useState(settings.marginBottomMm);
  const [marginLeftMm, setMarginLeftMm] = useState(settings.marginLeftMm);
  const [marginRightMm, setMarginRightMm] = useState(settings.marginRightMm);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      companyProfile,
      marginTopMm,
      marginBottomMm,
      marginLeftMm,
      marginRightMm
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDownloadBackup = () => {
    const json = dbRepository.exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `saleem_daal_factory_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = dbRepository.importBackupJSON(content, currentUser);
        if (ok) {
          alert('Database restored successfully! Reloading...');
          window.location.reload();
        } else {
          alert('Failed to restore backup. Invalid JSON file.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (!currentUser) return;
    if (confirm('RESET DATABASE? This will reset all records back to the initial seed benchmark state.')) {
      dbRepository.resetToSeedData(currentUser);
      alert('Database reset to seed data! Reloading...');
      window.location.reload();
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto text-xs">
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <span>Factory Configuration & Backup Center</span>
          </h2>
          <p className="text-xs text-slate-500">Configure letterhead profile, print margins & local database backup</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-200 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System Settings updated and saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Company Profile Settings */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
            Saleem Daal Factory Profile Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Company Name</label>
              <input
                type="text"
                value={companyProfile.name}
                onChange={(e) => setCompanyProfile({ ...companyProfile, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-bold text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tagline / Subtitle</label>
              <input
                type="text"
                value={companyProfile.tagline}
                onChange={(e) => setCompanyProfile({ ...companyProfile, tagline: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Address</label>
              <input
                type="text"
                value={companyProfile.address}
                onChange={(e) => setCompanyProfile({ ...companyProfile, address: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">City / Location</label>
              <input
                type="text"
                value={companyProfile.city}
                onChange={(e) => setCompanyProfile({ ...companyProfile, city: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={companyProfile.phone}
                onChange={(e) => setCompanyProfile({ ...companyProfile, phone: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Mobile Contact</label>
              <input
                type="text"
                value={companyProfile.mobile}
                onChange={(e) => setCompanyProfile({ ...companyProfile, mobile: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">NTN Number</label>
              <input
                type="text"
                value={companyProfile.ntnNumber}
                onChange={(e) => setCompanyProfile({ ...companyProfile, ntnNumber: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">STRN Number</label>
              <input
                type="text"
                value={companyProfile.strnNumber}
                onChange={(e) => setCompanyProfile({ ...companyProfile, strnNumber: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Print Margins Settings */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>A5 Print Margin Settings (mm)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Top Margin (mm)</label>
              <input
                type="number"
                value={marginTopMm}
                onChange={(e) => setMarginTopMm(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Bottom Margin (mm)</label>
              <input
                type="number"
                value={marginBottomMm}
                onChange={(e) => setMarginBottomMm(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Left Margin (mm)</label>
              <input
                type="number"
                value={marginLeftMm}
                onChange={(e) => setMarginLeftMm(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Right Margin (mm)</label>
              <input
                type="number"
                value={marginRightMm}
                onChange={(e) => setMarginRightMm(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Database Backup & Restore Operations */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600" />
          <span>Local SQLite Database Backup & Recovery</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handleDownloadBackup}
            className="p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all"
          >
            <Download className="w-6 h-6 text-emerald-600" />
            <span className="font-bold text-slate-900 dark:text-slate-100">Export Backup JSON</span>
            <span className="text-[10px] text-slate-500">Download full local database snapshot</span>
          </button>

          <label className="p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer">
            <Upload className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-slate-900 dark:text-slate-100">Restore Backup File</span>
            <span className="text-[10px] text-slate-500">Upload JSON backup file to overwrite</span>
            <input type="file" accept=".json" onChange={handleRestoreBackup} className="hidden" />
          </label>

          <button
            onClick={handleResetData}
            className="p-4 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-300 dark:border-rose-800 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all"
          >
            <RefreshCw className="w-6 h-6 text-rose-600" />
            <span className="font-bold text-rose-700 dark:text-rose-300">Reset to Seed Benchmark</span>
            <span className="text-[10px] text-rose-500">Reset system back to factory defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
