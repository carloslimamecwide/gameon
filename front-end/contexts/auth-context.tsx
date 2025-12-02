import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  saveAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading stored auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAuth = async (user: User, accessToken: string, refreshToken: string) => {
    try {
      await AsyncStorage.setItem("access_token", accessToken);
      await AsyncStorage.setItem("refresh_token", refreshToken);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error("Error saving auth:", error);
      throw error;
    }
  };

  const clearAuth = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
      setUser(null);
    } catch (error) {
      console.error("Error clearing auth:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    setUser,
    setIsLoading,
    saveAuth,
    clearAuth,
    loadStoredAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
