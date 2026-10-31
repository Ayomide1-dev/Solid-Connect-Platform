import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, UserRole, School } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  currentUser: User | null;
  currentSchool: School | null;
  isLoading: boolean;
  login: (email?: string, role?: UserRole, targetUserId?: string) => Promise<void>;
  register: (name: string, email: string, role: UserRole, phone?: string, inviteCode?: string) => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  refreshSchool: () => Promise<void>;
  resetDemoData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth and school
  useEffect(() => {
    async function init() {
      try {
        const schoolData = await api.getSchool();
        setCurrentSchool(schoolData);

        // Check if there was a saved role or user in localStorage
        const savedRole = (localStorage.getItem('sch_active_role') as UserRole) || 'admin';
        const loginRes = await api.login({ role: savedRole });
        if (loginRes.user) {
          setCurrentUser(loginRes.user);
        }
      } catch (err) {
        console.error('Failed to initialize session:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const login = async (email?: string, role?: UserRole, targetUserId?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, role, targetUserId });
      if (res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('sch_active_role', res.user.role);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, role: UserRole, phone?: string, inviteCode?: string) => {
    setIsLoading(true);
    try {
      const res = await api.register({ name, email, role, phone, inviteCode });
      if (res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('sch_active_role', res.user.role);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const res = await api.login({ role });
      if (res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('sch_active_role', res.user.role);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sch_active_role');
  };

  const refreshSchool = async () => {
    try {
      const schoolData = await api.getSchool();
      setCurrentSchool(schoolData);
    } catch (err) {
      console.error('Failed to refresh school:', err);
    }
  };

  const resetDemoData = async () => {
    setIsLoading(true);
    try {
      await api.resetDemoData();
      await refreshSchool();
      const res = await api.login({ role: currentUser?.role || 'admin' });
      if (res.user) setCurrentUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentSchool,
        isLoading,
        login,
        register,
        switchRole,
        logout,
        refreshSchool,
        resetDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
