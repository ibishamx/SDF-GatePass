/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Desktop Header & Title Bar with Urdu / English Language Switcher
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Moon,
  Sun,
  ShieldCheck,
  User as UserIcon,
  HardDrive,
  Clock,
  Printer,
  ChevronDown,
  RefreshCw,
  LogOut,
  Languages,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useGatePass } from '../../context/GatePassContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';
import dayjs from 'dayjs';

export const Header: React.FC = () => {
  const { currentUser, switchUserRole, logout } = useAuth();
  const { settings, isDarkMode, toggleDarkMode } = useSettings();
  const { setIsGlobalSearchOpen, refreshData } = useGatePass();
  const { language, toggleLanguage, t, isUrdu } = useLanguage();

  const [currentTime, setCurrentTime] = useState(dayjs().format('DD-MMM-YYYY HH:mm:ss'));
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format('DD-MMM-YYYY HH:mm:ss'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const roles: UserRole[] = ['Administrator', 'Gate Operator', 'Security', 'Manager', 'Read Only'];

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 select-none flex flex-col sm:flex-row items-center justify-between px-4 py-2 text-xs font-sans shadow-md z-30">
      {/* Top Left: Logo, Title & Offline Status */}
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start mb-2 sm:mb-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-white text-base shadow-md ring-2 ring-emerald-400/30 shrink-0">
            SDF
          </div>
          <div>
            <h1 className="font-extrabold tracking-wide text-sm text-slate-100 leading-tight flex items-center gap-2">
              <span>{t('appTitle')}</span>
              {isUrdu && <span className="text-xs text-emerald-400 font-bold font-sans">(اردو)</span>}
            </h1>
            <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md text-[11px] border border-slate-700/60 text-slate-300">
          <HardDrive className="w-3.5 h-3.5 text-amber-400" />
          <span>LOCAL SYSTEM</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 font-medium">OFFLINE READY</span>
        </div>
      </div>

      {/* Middle: Global Search Bar */}
      <div className="flex-1 max-w-md mx-4 w-full sm:w-auto mb-2 sm:mb-0">
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="w-full bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-left text-slate-300 flex items-center justify-between text-xs transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
            <span className="truncate">{t('searchPlaceholder')}</span>
          </div>
          <kbd className="hidden sm:inline-block bg-slate-900 border border-slate-700 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Language Switcher, Clock, Refresh, Theme & User Role */}
      <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
        {/* Language Switcher Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-md border border-emerald-400/40 transition-all active:scale-95"
          title="Switch App Language / زبان تبدیل کریں"
        >
          <Languages className="w-4 h-4 text-emerald-100" />
          <span>{isUrdu ? 'English' : 'اردو زبان'}</span>
        </button>

        {/* Live System Clock */}
        <div className="hidden md:flex items-center gap-1.5 text-slate-300 bg-slate-800/60 px-2.5 py-1 rounded-md text-[11px] border border-slate-700/40">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono text-slate-200">{currentTime}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => refreshData()}
          title="Refresh System Data (F5)"
          className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors border border-slate-700/60"
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
        </button>

        {/* User Role Quick Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/90 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-[10px] text-white">
              {currentUser?.fullName.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-medium leading-tight text-slate-100">{currentUser?.username}</div>
              <div className="text-[10px] text-emerald-400">{currentUser?.role}</div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 text-slate-200">
              <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/50">
                <p className="font-semibold text-xs text-slate-100">{currentUser?.fullName}</p>
                <p className="text-[10px] text-slate-400">Role: <span className="text-emerald-400 font-semibold">{currentUser?.role}</span></p>
              </div>

              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800/30">
                Quick Role Switcher
              </div>

              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchUserRole(r);
                    setIsUserMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-800 flex items-center justify-between ${
                    currentUser?.role === r ? 'text-emerald-400 font-semibold bg-slate-800/50' : 'text-slate-300'
                  }`}
                >
                  <span>{r}</span>
                  {currentUser?.role === r && <ShieldCheck className="w-3.5 h-3.5" />}
                </button>
              ))}

              <div className="border-t border-slate-800 my-1"></div>

              <button
                onClick={() => {
                  logout();
                  setIsUserMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
