/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Desktop Sidebar Navigation with Language Context Support
 */

import React from 'react';
import {
  LayoutDashboard,
  ArrowDownRight,
  ArrowUpRight,
  FileText,
  Truck,
  Users,
  Building2,
  Package,
  BarChart3,
  Printer,
  Shield,
  Settings,
  Database,
  History
} from 'lucide-react';
import { useGatePass } from '../../context/GatePassContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  category?: string;
  shortcut?: string;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, gatePasses } = useGatePass();
  const { hasPermission } = useAuth();
  const { t, isUrdu } = useLanguage();

  const vehiclesInside = gatePasses.filter((gp) => gp.status === 'Vehicle Entered').length;
  const pendingCount = gatePasses.filter((gp) => gp.status === 'Pending' || gp.status === 'Approved').length;

  const mainActions: NavigationItem[] = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'new_igp', label: t('navNewIGP'), icon: ArrowDownRight, badgeColor: 'bg-emerald-600 text-white', shortcut: 'Ctrl+N' },
    { id: 'new_ogp', label: t('navNewOGP'), icon: ArrowUpRight, badgeColor: 'bg-amber-600 text-white' },
    { id: 'register', label: t('navRegister'), icon: FileText, badge: gatePasses.length, badgeColor: 'bg-slate-700 text-slate-200' },
  ];

  const masterModules: NavigationItem[] = [
    { id: 'vehicles', label: t('navVehicles'), icon: Truck, badge: vehiclesInside > 0 ? `${vehiclesInside} Inside` : undefined, badgeColor: 'bg-blue-600 text-white animate-pulse' },
    { id: 'drivers', label: t('navDrivers'), icon: Users },
    { id: 'parties', label: t('navParties'), icon: Building2 },
    { id: 'products', label: t('navProducts'), icon: Package },
  ];

  const toolsAndReports: NavigationItem[] = [
    { id: 'reports', label: isUrdu ? 'رپورٹس اور کھاتہ' : 'Reports & Ledger', icon: BarChart3 },
    { id: 'print_center', label: isUrdu ? 'پرنٹ سینٹر' : 'Print Center', icon: Printer },
    { id: 'audit_logs', label: isUrdu ? 'سسٹم ہسٹری' : 'Audit Logs', icon: History },
  ];

  const systemAdmin: NavigationItem[] = [
    { id: 'users', label: t('navUsers'), icon: Shield },
    { id: 'settings', label: t('navSettings'), icon: Settings },
    { id: 'backup', label: isUrdu ? 'بیک اپ اور ڈیٹا' : 'Backup & Data', icon: Database },
  ];

  const renderNavGroup = (title: string, items: NavigationItem[]) => (
    <div className="mb-4">
      <div className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md font-extrabold scale-[1.02]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-500 dark:text-emerald-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.shortcut && (
                  <span className="text-[9px] px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                    {item.shortcut}
                  </span>
                )}
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.badgeColor || 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-60 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between select-none shrink-0 p-3 h-full overflow-y-auto">
      <div>
        {renderNavGroup(isUrdu ? 'بنیادی گیٹ پاس کام' : 'Core Gate Pass Tasks', mainActions)}
        {renderNavGroup(isUrdu ? 'ماسٹر ڈیٹا رجسٹر' : 'Master Data Registers', masterModules)}
        {renderNavGroup(isUrdu ? 'رپورٹس اور پرنٹنگ' : 'Analytics & Printing', toolsAndReports)}
        {hasPermission('MANAGE_SETTINGS') && renderNavGroup(isUrdu ? 'سسٹم ایڈمن' : 'System Admin', systemAdmin)}
      </div>

      {/* Footer Info Box */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1 bg-slate-200/50 dark:bg-slate-950/40 p-2.5 rounded-xl">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold">{t('trucksInside')}:</span>
          <span className="font-black text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-full">{vehiclesInside}</span>
        </div>
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="font-semibold">{isUrdu ? 'زیر التوا پاس' : 'Pending Passes'}:</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">{pendingCount}</span>
        </div>
        <div className="pt-2 text-[9px] text-slate-500 dark:text-slate-400 text-center font-mono font-bold">
          {t('factoryName')} ERP
        </div>
      </div>
    </aside>
  );
};
