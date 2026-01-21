import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const ADMIN_USERNAME = 'Hope.org';
const ADMIN_PASSWORD = 'Hope.org@2025';
const AUTH_STORAGE_KEY = 'ngo-calendar-auth';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already authenticated
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored === 'true';
    }
    return false;
  });

  useEffect(() => {
    // Save auth state to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(AUTH_STORAGE_KEY, isAuthenticated.toString());
    }
  }, [isAuthenticated]);

  const login = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
