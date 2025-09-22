"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthState } from "@/types";

// Crear el contexto de autenticación
const AuthContext = createContext<
  (AuthState & { isAdmin: boolean; logout: () => void }) | undefined
>(undefined);

// Props para el AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider componente
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar el contexto de autenticación
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
