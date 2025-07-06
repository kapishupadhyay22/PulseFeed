import { useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import { api } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    
    if (token) {
      api.setToken(token);
      // Fetch user data from the server
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await api.getAuthenticatedUser();
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      logout(); // Clear invalid token
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const response = await api.login(credentials);
    
    // Fetch complete user data after successful login
    const userData = await api.getAuthenticatedUser();
    setUser(userData);
  };

  const register = async (userData: RegisterData) => {
    await api.register(userData);
  };

  const logout = () => {
    setUser(null);
    api.clearToken();
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
};