import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { authAPI } from "../_config/api";

// Types
export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Storage keys
const TOKEN_KEY = "@belajarindo_token";
const USER_KEY = "@belajarindo_user";

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth data on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verify token is still valid
        const result = await authAPI.getMe(storedToken);
        if (result.ok && result.data?.user) {
          setUser(result.data.user);
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(result.data.user));
        } else {
          // Token invalid, clear auth
          await clearAuth();
        }
      }
    } catch (error) {
      console.error("Failed to load auth:", error);
      await clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuth = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await authAPI.login(email, password);
      
      if (result.ok && result.data) {
        const { user: userData, token: authToken } = result.data;
        
        setUser(userData);
        setToken(authToken);
        
        await AsyncStorage.setItem(TOKEN_KEY, authToken);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
        
        return { success: true };
      }
      
      return { success: false, error: result.error || "Login failed" };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Login failed" 
      };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const result = await authAPI.register(name, email, password);
      
      if (result.ok) {
        return { success: true };
      }
      
      return { success: false, error: result.error || "Registration failed" };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Registration failed" 
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout(token);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await clearAuth();
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    
    try {
      const result = await authAPI.getMe(token);
      if (result.ok && result.data?.user) {
        setUser(result.data.user);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(result.data.user));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
