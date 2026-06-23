import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');
      if (token && savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsAuthenticated(true);
        try {
          const fresh = await authService.getCurrentUser();
          setUser(fresh);
          localStorage.setItem('user', JSON.stringify(fresh));
        } catch {
          if (!localStorage.getItem('access_token')) {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const updateUser = useCallback((updated) => {
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  }, []);

  // Role helpers
  const isSuperAdmin = user?.role === 'superadmin';
  const isOwner = user?.role === 'owner';
  const isAdmin = user?.role === 'admin';
  const isOwnerOrAdmin = isOwner || isAdmin;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      updateUser,
      isSuperAdmin,
      isOwner,
      isAdmin,
      isOwnerOrAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
