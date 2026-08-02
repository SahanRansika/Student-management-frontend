'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  role: string;
  fullName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface LoginResponse {
  token: string;
  email: string;
  role: string;
  fullName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userStr && token) {
      try {
        const userData = JSON.parse(userStr) as User;
        setUser(userData);
        console.log('User restored from localStorage:', userData);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt:', email);
      
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      console.log('Login response:', response);
      
      const { token, email: userEmail, role, fullName } = response;
      
      if (!token || !userEmail) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('token', token);
      const userData: User = { 
        id: '', 
        email: userEmail, 
        role: role || 'ADMIN', 
        fullName: fullName || '' 
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      console.log('Login successful:', userData);
      toast.success('Welcome back! 🎉');
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed';
      if (error.response?.status === 403) {
        errorMessage = 'Access denied. Please check your credentials.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
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