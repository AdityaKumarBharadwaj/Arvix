import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('arvix_user');
    const token = localStorage.getItem('arvix_token');

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse cached user', err);
        localStorage.removeItem('arvix_user');
        localStorage.removeItem('arvix_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.user) {
      localStorage.setItem('arvix_token', res.user.token);
      localStorage.setItem('arvix_user', JSON.stringify(res.user));
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('arvix_token');
    localStorage.removeItem('arvix_user');
    setUser(null);
  };

  const isRepresentative = user && (user.role === 'representative' || user.role === 'admin');

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isRepresentative }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
