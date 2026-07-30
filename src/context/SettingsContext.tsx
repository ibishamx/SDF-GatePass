/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Factory Settings & Theme Context
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SystemSettings } from '../types';
import { dbRepository } from '../db/storage';
import { useAuth } from './AuthContext';

interface SettingsContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [settings, setSettingsState] = useState<SystemSettings>(() => dbRepository.getSettings());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => settings.theme === 'dark');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    if (!currentUser) return;
    const updated = dbRepository.updateSettings(newSettings, currentUser);
    setSettingsState(updated);
    if (newSettings.theme) {
      setIsDarkMode(newSettings.theme === 'dark');
    }
  };

  const toggleDarkMode = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    updateSettings({ theme: nextTheme });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isDarkMode, toggleDarkMode }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
