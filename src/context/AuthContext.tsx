/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Authentication & Role-Based Access Control (RBAC) Context
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { dbRepository } from '../db/storage';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, role?: UserRole) => boolean;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  hasPermission: (permission: ActionPermission) => boolean;
}

export type ActionPermission =
  | 'CREATE_GATE_PASS'
  | 'EDIT_GATE_PASS'
  | 'CANCEL_GATE_PASS'
  | 'APPROVE_GATE_PASS'
  | 'OVERRIDE_WEIGHT'
  | 'MANAGE_MASTERS'
  | 'MANAGE_USERS'
  | 'VIEW_REPORTS'
  | 'MANAGE_SETTINGS'
  | 'PERFORM_BACKUP';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const users = dbRepository.getUsers();
    // Default logged in as Gate Operator or Admin
    return users.find((u) => u.username === 'operator') || users[0] || null;
  });

  const login = (username: string, roleOverride?: UserRole): boolean => {
    const users = dbRepository.getUsers();
    const found = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (found && found.isActive) {
      const loggedUser = roleOverride ? { ...found, role: roleOverride } : found;
      setCurrentUser(loggedUser);
      dbRepository.addAuditLog(loggedUser, 'LOGIN', 'USER', loggedUser.id, `User ${loggedUser.username} logged in.`);
      return true;
    }
    // Quick fallback demo login
    if (username) {
      const demoUser: User = {
        id: `usr_${Date.now()}`,
        username,
        fullName: `${username.toUpperCase()} (Staff)`,
        role: roleOverride || 'Gate Operator',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(demoUser);
      dbRepository.addAuditLog(demoUser, 'LOGIN', 'USER', demoUser.id, `User ${demoUser.username} logged in.`);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      dbRepository.addAuditLog(currentUser, 'LOGOUT', 'USER', currentUser.id, `User ${currentUser.username} logged out.`);
    }
    setCurrentUser(null);
  };

  const switchUserRole = (newRole: UserRole) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role: newRole };
    setCurrentUser(updated);
  };

  const hasPermission = (permission: ActionPermission): boolean => {
    if (!currentUser) return false;

    const role = currentUser.role;

    if (role === 'Administrator') return true; // Full access

    switch (permission) {
      case 'CREATE_GATE_PASS':
      case 'EDIT_GATE_PASS':
        return role === 'Gate Operator' || role === 'Manager';

      case 'APPROVE_GATE_PASS':
      case 'CANCEL_GATE_PASS':
        return role === 'Manager';

      case 'OVERRIDE_WEIGHT':
        return role === 'Administrator'; // Strictly Admin only as required by specs

      case 'MANAGE_MASTERS':
        return role === 'Gate Operator' || role === 'Manager';

      case 'MANAGE_USERS':
      case 'MANAGE_SETTINGS':
      case 'PERFORM_BACKUP':
        return role === 'Administrator';

      case 'VIEW_REPORTS':
        return role === 'Manager' || role === 'Read Only' || role === 'Gate Operator';

      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, switchUserRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
