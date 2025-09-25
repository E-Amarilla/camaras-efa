"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserData, UserRole } from "@/types";
import { useNetwork } from "@/contexts/NetworkContext";

const USER_SESSION_KEY = "efa_user_data";

export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { loginURL } = useNetwork();

  const parseUserFromURL = (searchParams: URLSearchParams): UserData | null => {
    try {
      const userDataParam = searchParams.get("userData");
      if (userDataParam) {
        const decoded = decodeURIComponent(userDataParam);
        const data = JSON.parse(decoded);
        const payload = JSON.parse(atob(data.access_token.split(".")[1]));
        const id = payload.id.toString();
        const name = payload.sub;
        const role = data.role === "ADMIN" ? UserRole.ADMIN : UserRole.USER;
        const isAdmin = role === UserRole.ADMIN;
        return { id, name, role, isAdmin };
      }
      return null;
    } catch (error) {
      console.error("Error parsing user data from URL:", error);
      return null;
    }
  };

  const saveUserToSession = (userData: UserData) => {
    try {
      sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving user data to sessionStorage:", error);
    }
  };

  const getUserFromSession = (): UserData | null => {
    try {
      const stored = sessionStorage.getItem(USER_SESSION_KEY);
      if (stored) {
        const userData = JSON.parse(stored);
        if (userData.id && userData.name && userData.role !== undefined) {
          return userData;
        }
      }
    } catch (error) {
      console.error("Error reading user data from sessionStorage:", error);
    }
    return null;
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(USER_SESSION_KEY);
      setUser(null);
      if (loginURL) {
        window.location.href = loginURL;
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const userFromURL = parseUserFromURL(urlParams);

        if (userFromURL) {
          setUser(userFromURL);
          saveUserToSession(userFromURL);
        } else {
          const userFromSession = getUserFromSession();

          if (userFromSession) {
            setUser(userFromSession);
          } else {
            setUser(null);
            setIsLoading(false);
            if (loginURL) {
              window.location.href = loginURL;
            }
            return;
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
        if (loginURL) {
          window.location.href = loginURL;
        }
        return;
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [router, pathname]);

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    isLoading,
    logout,
  };
};
