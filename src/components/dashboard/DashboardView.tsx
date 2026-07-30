/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Dashboard View (Kid-Simple UI, Big Action Buttons, Full Urdu Translation Support)
 */

import React from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  Weight,
  Plus,
  FileText,
  Printer,
  ChevronRight,
  AlertTriangle,
  LogOut,
  TrendingUp,
  Download,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useGatePass } from '../../context/GatePassContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { exportGatePassToA5PDF } from '../../utils/exportUtils';
import dayjs from 'dayjs';

export const DashboardView: React.FC = () => {
  const { gatePasses, getKPIs, setActiveView, updateStatus, setSelectedPrintPass } = useGatePass();
  const { currentUser } = useAuth();
  const { t, isUrdu } = useLanguage();

  const kpis = getKPIs();
  const vehiclesInsideList = gatePasses.filter((gp) => gp.status === 'Vehicle Entered');
  const recentPasses = gatePasses.slice(0, 6);

  const chartDailyData = [
    { name: 'Mon', IGP: 12, OGP: 8 },
    { name: 'Tue', IGP: 15, OGP: 11 },
    { name: 'Wed', IGP: 18, OGP: 14 },
    { name: 'Thu', IGP: 14, OGP: 10 },
    { name: 'Fri', IGP: 22, OGP: 16 },
    { name: 'Sat', IGP: 19, OGP: 15 },
    { name: 'Today', IGP: kpis.todaysIGPCount, OGP: kpis.todaysOGPCount },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans select-none">
      {/* KID-SIMPLE GIANT QUICK ACTION BUTTONS */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 rounded-2xl shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-black tracking-wide flex items-center gap-2">
              <span>{t('welcomeUser')}, {currentUser?.fullName}!</span>
            </h2>
            <p className="text-xs text-emerald-400 font-semibold mt-1">
              {isUrdu ? 'سلیم دال فیکٹری - گیٹ پاس اور ٹرک انٹری ڈیش بورڈ' : 'Saleem Daal Factory • Gate Operations Control'}
            </p>
          </div>
          <div className="text-right text-xs text-slate-300 font-mono bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
            {dayjs().format('DD-MMM-YYYY dddd')}
          </div>
        </div>

        {/* 3 GIANT KID-FRIENDLY ACTION BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Button 1: New IGP (Green) */}
          <button
            onClick={() => setActiveView('new_igp')}
            className="group flex items-center gap-4 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-2xl shadow-lg border-2 border-emerald-400/40 transition-all transform hover:-translate-y-1 active:scale-95 text-left"
          >
            <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
              <ArrowDownRight className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-lg font-black leading-tight">
                {t('createIGPBtn')}
              </div>
              <div className="text-xs text-emerald-100 font-medium mt-0.5">
                {isUrdu ? 'فیکٹری میں انے والی گاڑی کی پرچی' : 'Inbound Truck Entry Slip'}
              </div>
            </div>
          </button>

          {/* Button 2: New OGP (Amber) */}
          <button
            onClick={() => setActiveView('new_ogp')}
            className="group flex items-center gap-4 bg-amber-600 hover:bg-amber-500 text-white p-4 rounded-2xl shadow-lg border-2 border-amber-400/40 transition-all transform hover:-translate-y-1 active:scale-95 text-left"
          >
            <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-lg font-black leading-tight">
                {t('createOGPBtn')}
              </div>
              <div className="text-xs text-amber-100 font-medium mt-0.5">
                {isUrdu ? 'فیکٹری سے جانے والی گاڑی کی پرچی' : 'Outbound Goods Exit Slip'}
              </div>
            </div>
          </button>

          {/* Button 3: Gate Pass Register (Blue) */}
          <button
            onClick={() => setActiveView('register')}
            className="group flex items-center gap-4 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl shadow-lg border-2 border-blue-400/40 transition-all transform hover:-translate-y-1 active:scale-95 text-left"
          >
            <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-lg font-black leading-tight">
                {t('viewRegisterBtn')}
              </div>
              <div className="text-xs text-blue-100 font-medium mt-0.5">
                {isUrdu ? 'تمام پاس، تلاش اور پرنٹنگ' : 'All Passes, Search & Printing'}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* KPI STAT CARDS WITH EASY COLORS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trucks Inside */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-blue-500/30 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('trucksInside')}</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
              {kpis.vehiclesInsideCount}
            </div>
          </div>
        </div>

        {/* Today's IGP */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-emerald-500/30 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('todaysInbound')}</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {kpis.todaysIGPCount}
            </div>
          </div>
        </div>

        {/* Today's OGP */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-amber-500/30 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('todaysOutbound')}</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {kpis.todaysOGPCount}
            </div>
          </div>
        </div>

        {/* Total Bags Today */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-purple-500/30 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('totalBagsHandled')}</div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
              {kpis.todaysTotalBags.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* TRUCKS INSIDE FACTORY - QUICK EXIT & PRINT */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              {isUrdu ? 'فیکٹری کے اندر موجود گاڑیاں' : 'Vehicles Currently Inside Factory'} ({vehiclesInsideList.length})
            </h3>
          </div>
          <button
            onClick={() => setActiveView('register')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>{isUrdu ? 'تمام دیکھیں' : 'View All'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {vehiclesInsideList.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm italic font-semibold">
            {isUrdu ? 'اس وقت فیکٹری کے اندر کوئی گاڑی نہیں ہے۔' : 'No vehicles currently flagged inside the factory.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {vehiclesInsideList.map((pass) => (
              <div
                key={pass.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border-2 border-blue-200 dark:border-blue-900 flex flex-col justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-black text-sm bg-blue-600 text-white px-2 py-0.5 rounded-md">
                      {pass.vehicleNumber}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{pass.gatePassNo}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{pass.driverName}</div>
                  <div className="text-[11px] text-slate-500 truncate">{pass.partyName}</div>
                  <div className="text-[11px] font-mono text-slate-600 mt-1">
                    {pass.totalBags} Bags • Net: {pass.weighment?.netWeightKg || pass.totalItemWeightKg} kg
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedPrintPass(pass)}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>A5 پرنٹ</span>
                  </button>

                  <button
                    onClick={() => updateStatus(pass.id, 'Vehicle Exited')}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'روانہ کریں' : 'Exit Truck'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENT GATE PASSES TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>{isUrdu ? 'حالیہ گیٹ پاس ہسٹری' : 'Recent Gate Passes Activity'}</span>
          </h3>
          <button
            onClick={() => setActiveView('register')}
            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
          >
            <span>{isUrdu ? 'رجسٹر دیکھیں' : 'Full Register'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[10px]">
              <tr>
                <th className="p-2.5">Pass No</th>
                <th className="p-2.5">Type</th>
                <th className="p-2.5">Vehicle</th>
                <th className="p-2.5">Driver</th>
                <th className="p-2.5">Party</th>
                <th className="p-2.5">Transporter</th>
                <th className="p-2.5">Bags</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
              {recentPasses.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">{p.gatePassNo}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] ${p.type === 'IGP' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
                      {p.type}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono font-black">{p.vehicleNumber}</td>
                  <td className="p-2.5">{p.driverName}</td>
                  <td className="p-2.5">{p.partyName}</td>
                  <td className="p-2.5 text-slate-500">{p.transporterName || '—'}</td>
                  <td className="p-2.5 font-mono font-bold">{p.totalBags}</td>
                  <td className="p-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedPrintPass(p)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-[10px] font-bold flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3 text-emerald-400" />
                        <span>A5</span>
                      </button>
                      <button
                        onClick={() => exportGatePassToA5PDF(p)}
                        className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md text-[10px] font-bold flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
