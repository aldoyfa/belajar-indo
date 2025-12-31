/**
 * useAuth Hook
 * Custom hook untuk mengelola authentication state dan operations
 */

import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../../types';
import { authService } from '../../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ ok: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook untuk menggunakan auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};

/**
 * Hook untuk auth operations
 * Bisa digunakan standalone atau dengan context
 */
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize - check if user sudah login
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);
      const isAuth = await authService.isAuthenticated();
      setIsAuthenticated(isAuth);

      if (isAuth) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setLoading(true);
        const result = await authService.login(credentials);

        if (result.ok && result.data?.user) {
          setUser(result.data.user);
          setIsAuthenticated(true);
          return { ok: true };
        } else {
          return { ok: false, error: result.error };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        return { ok: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        setLoading(true);
        const result = await authService.register(credentials);

        if (result.ok && result.data?.user) {
          setUser(result.data.user);
          setIsAuthenticated(true);
          return { ok: true };
        } else {
          return { ok: false, error: result.error };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
        return { ok: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.refreshUserData();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };
};

export default useAuth;
