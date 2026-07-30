/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Main Application Component & Global Context Wrapper
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { GatePassProvider, useGatePass } from './context/GatePassContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { GatePassForm } from './components/gatepass/GatePassForm';
import { GatePassRegister } from './components/gatepass/GatePassRegister';
import { ProductsManager } from './components/masters/ProductsManager';
import { PartiesManager } from './components/masters/PartiesManager';
import { VehiclesManager } from './components/masters/VehiclesManager';
import { DriversManager } from './components/masters/DriversManager';
import { UsersManager } from './components/masters/UsersManager';
import { ReportsView } from './components/reports/ReportsView';
import { AuditLogView } from './components/audit/AuditLogView';
import { SettingsView } from './components/settings/SettingsView';
import { A5PrintModal } from './components/print/A5PrintModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { useKeyboardShortcuts } from './utils/keyboardShortcuts';

const MainLayout: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedPrintPass,
    setSelectedPrintPass,
    setIsGlobalSearchOpen,
    refreshData
  } = useGatePass();

  // Attach Desktop Hotkeys
  useKeyboardShortcuts({
    onNewPass: () => setActiveView('new_igp'),
    onSearch: () => setIsGlobalSearchOpen(true),
    onRefresh: () => refreshData(),
    onEscape: () => {
      setSelectedPrintPass(null);
      setIsGlobalSearchOpen(false);
    }
  });

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'new_igp':
        return <GatePassForm key="new_igp" initialType="IGP" onClose={() => setActiveView('dashboard')} />;
      case 'new_ogp':
        return <GatePassForm key="new_ogp" initialType="OGP" onClose={() => setActiveView('dashboard')} />;
      case 'register':
      case 'print_center':
        return <GatePassRegister />;
      case 'products':
        return <ProductsManager />;
      case 'parties':
        return <PartiesManager />;
      case 'vehicles':
        return <VehiclesManager />;
      case 'drivers':
        return <DriversManager />;
      case 'users':
        return <UsersManager />;
      case 'reports':
        return <ReportsView />;
      case 'audit_logs':
        return <AuditLogView />;
      case 'settings':
      case 'backup':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased select-none">
      {/* Title Bar & Header */}
      <Header />

      {/* Body Area with Sidebar and Active Screen */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals */}
      <GlobalSearchModal />

      {selectedPrintPass && (
        <A5PrintModal
          gatePass={selectedPrintPass}
          onClose={() => setSelectedPrintPass(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <GatePassProvider>
          <LanguageProvider>
            <MainLayout />
          </LanguageProvider>
        </GatePassProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
