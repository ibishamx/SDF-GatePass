/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Gate Pass Global State Context
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { GatePass, GatePassStatus, GatePassType, DashboardKPIs } from '../types';
import { dbRepository } from '../db/storage';
import { useAuth } from './AuthContext';

interface GatePassContextType {
  gatePasses: GatePass[];
  refreshData: () => void;
  getGatePassById: (id: string) => GatePass | undefined;
  createGatePass: (data: Omit<GatePass, 'id' | 'gatePassNo' | 'createdAt' | 'updatedAt'>) => GatePass;
  updateGatePass: (id: string, updates: Partial<GatePass>, reason?: string) => GatePass;
  updateStatus: (id: string, status: GatePassStatus) => GatePass;
  isVehicleInside: (vehicleNumber: string, excludePassId?: string) => boolean;
  getKPIs: () => DashboardKPIs;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  selectedPrintPass: GatePass | null;
  setSelectedPrintPass: (pass: GatePass | null) => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

const GatePassContext = createContext<GatePassContextType | undefined>(undefined);

export const GatePassProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [gatePasses, setGatePasses] = useState<GatePass[]>(() => dbRepository.getGatePasses());
  const [searchQuery, setSearchQuery] = useState('');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [selectedPrintPass, setSelectedPrintPass] = useState<GatePass | null>(null);
  const [activeView, setActiveView] = useState('dashboard');

  const refreshData = useCallback(() => {
    setGatePasses(dbRepository.getGatePasses());
  }, []);

  const getGatePassById = (id: string) => {
    return dbRepository.getGatePassById(id);
  };

  const createGatePass = (data: Omit<GatePass, 'id' | 'gatePassNo' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) throw new Error('User not authenticated');
    const created = dbRepository.createGatePass(data, currentUser);
    refreshData();
    return created;
  };

  const updateGatePass = (id: string, updates: Partial<GatePass>, reason?: string) => {
    if (!currentUser) throw new Error('User not authenticated');
    const updated = dbRepository.updateGatePass(id, updates, currentUser, reason);
    refreshData();
    return updated;
  };

  const updateStatus = (id: string, status: GatePassStatus) => {
    if (!currentUser) throw new Error('User not authenticated');
    const updated = dbRepository.updateGatePassStatus(id, status, currentUser);
    refreshData();
    return updated;
  };

  const isVehicleInside = (vehicleNumber: string, excludePassId?: string) => {
    return dbRepository.isVehicleInsideFactory(vehicleNumber, excludePassId);
  };

  const getKPIs = () => {
    return dbRepository.getDashboardKPIs();
  };

  return (
    <GatePassContext.Provider
      value={{
        gatePasses,
        refreshData,
        getGatePassById,
        createGatePass,
        updateGatePass,
        updateStatus,
        isVehicleInside,
        getKPIs,
        searchQuery,
        setSearchQuery,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        selectedPrintPass,
        setSelectedPrintPass,
        activeView,
        setActiveView
      }}
    >
      {children}
    </GatePassContext.Provider>
  );
};

export const useGatePass = () => {
  const ctx = useContext(GatePassContext);
  if (!ctx) throw new Error('useGatePass must be used within GatePassProvider');
  return ctx;
};
