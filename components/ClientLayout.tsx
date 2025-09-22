"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return <ProtectedRoute>{children}</ProtectedRoute>;
};
