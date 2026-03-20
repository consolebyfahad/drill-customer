import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const USER_ID_KEY = "user_id";
const PENDING_BOOKING_KEY = "pending_booking";

export type PendingBooking = {
  entry: "serviceType" | "booking";
  id: string;
  name: string;
  image: string;
};

type AuthContextType = {
  userId: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  setUser: (userId: string | null) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setPendingBooking: (payload: PendingBooking | null) => Promise<void>;
  getPendingBooking: () => Promise<PendingBooking | null>;
  clearPendingBooking: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const id = await AsyncStorage.getItem(USER_ID_KEY);
      setUserId(id);
    } catch {
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const setUser = useCallback(async (id: string | null) => {
    if (id) {
      await AsyncStorage.setItem(USER_ID_KEY, id);
      setUserId(id);
    } else {
      await AsyncStorage.removeItem(USER_ID_KEY);
      setUserId(null);
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.clear();
    setUserId(null);
  }, []);

  const setPendingBooking = useCallback(async (payload: PendingBooking | null) => {
    if (payload) {
      await AsyncStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(payload));
    } else {
      await AsyncStorage.removeItem(PENDING_BOOKING_KEY);
    }
  }, []);

  const getPendingBooking = useCallback(async (): Promise<PendingBooking | null> => {
    try {
      const raw = await AsyncStorage.getItem(PENDING_BOOKING_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as PendingBooking;
    } catch {
      return null;
    }
  }, []);

  const clearPendingBooking = useCallback(async () => {
    await AsyncStorage.removeItem(PENDING_BOOKING_KEY);
  }, []);

  const value: AuthContextType = {
    userId,
    isLoading,
    isLoggedIn: !!userId,
    setUser,
    logout,
    refreshUser,
    setPendingBooking,
    getPendingBooking,
    clearPendingBooking,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
