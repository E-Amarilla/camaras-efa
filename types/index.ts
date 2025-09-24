import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface UserData {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  isAdmin: boolean;
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
