"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserData, UserRole } from "@/types";

const USER_SESSION_KEY = "efa_user_data";
const LOGIN_URL = "http://192.168.20.18:3000";

export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Función para parsear los datos del usuario desde URL params
  const parseUserFromURL = (searchParams: URLSearchParams): UserData | null => {
    try {
      const userDataParam = searchParams.get("userData");
      if (userDataParam) {
        const decoded = decodeURIComponent(userDataParam);
        const data = JSON.parse(decoded);
        // data: {access_token, role, token_type}
        // Decodificar JWT payload
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

  // Función para guardar datos en sessionStorage
  const saveUserToSession = (userData: UserData) => {
    try {
      sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving user data to sessionStorage:", error);
    }
  };

  // Función para obtener datos de sessionStorage
  const getUserFromSession = (): UserData | null => {
    try {
      const stored = sessionStorage.getItem(USER_SESSION_KEY);
      if (stored) {
        const userData = JSON.parse(stored);
        // Validar que los datos tienen la estructura correcta
        if (userData.id && userData.name && userData.role !== undefined) {
          return userData;
        }
      }
    } catch (error) {
      console.error("Error reading user data from sessionStorage:", error);
    }
    return null;
  };

  // Función para limpiar la autenticación
  const logout = () => {
    try {
      sessionStorage.removeItem(USER_SESSION_KEY);
      setUser(null);
      // Redirigir al login externo después del logout
      window.location.href = LOGIN_URL;
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Inicializar autenticación desde URL o sessionStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Primero, verificar si hay parámetros en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const userFromURL = parseUserFromURL(urlParams);

        if (userFromURL) {
          // Si hay datos válidos en la URL, usar esos y guardarlos
          setUser(userFromURL);
          saveUserToSession(userFromURL);

          // Opcional: limpiar la URL después de procesar los parámetros
          // window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          // Si no hay datos en URL, intentar cargar desde sessionStorage
          const userFromSession = getUserFromSession();

          if (userFromSession) {
            setUser(userFromSession);
          } else {
            // Si no hay datos de autenticación, redirigir al login externo
            setUser(null);
            setIsLoading(false);
            window.location.href = LOGIN_URL;
            return;
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
        // En caso de error, redirigir al login externo
        window.location.href = LOGIN_URL;
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
