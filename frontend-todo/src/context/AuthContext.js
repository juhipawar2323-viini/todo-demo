import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { getToken, setToken, getUser, setUser, clearAuth } from '../utils/tokenStorage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setCurrentUser] = useState(() => getUser());
  const [token, setCurrentToken] = useState(() => getToken());
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and verify authentication session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (response?.data?.user) {
          setCurrentUser(response.data.user);
          setUser(response.data.user);
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        clearAuth();
        setCurrentUser(null);
        setCurrentToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login handler
  const login = useCallback(async (email, password) => {
    const response = await authService.login({ email, password });
    const { user: userData, token: authToken } = response.data;

    setToken(authToken);
    setUser(userData);
    setCurrentToken(authToken);
    setCurrentUser(userData);

    return userData;
  }, []);

  // Register handler
  const register = useCallback(async (name, email, password) => {
    const response = await authService.register({ name, email, password });
    const { user: userData, token: authToken } = response.data;

    setToken(authToken);
    setUser(userData);
    setCurrentToken(authToken);
    setCurrentUser(userData);

    return userData;
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    clearAuth();
    setCurrentToken(null);
    setCurrentUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
