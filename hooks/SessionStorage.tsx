"use client";

import { useState, useEffect } from "react";

export default function useUrlParams() {
  const [userData, setUserData] = useState(null);
  const [isParamsLoaded, setIsParamsLoaded] = useState(false);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return;

    // Función para extraer parámetros de la URL
    const extractParams = () => {
      const urlParams = new URLSearchParams(window.location.search);

      // Procesar userData
      const userDataParam = urlParams.get("userData");
      if (userDataParam) {
        try {
          const parsedData = JSON.parse(decodeURIComponent(userDataParam));
          sessionStorage.setItem(
            "external_user_data",
            JSON.stringify(parsedData),
          );
          setUserData(parsedData);
        } catch (error) {
          console.error("Error parsing user data from URL:", error);
        }
      } else {
        // Recuperar de sessionStorage si existe
        const storedUserData = sessionStorage.getItem("external_user_data");
        if (storedUserData) {
          try {
            setUserData(JSON.parse(storedUserData));
          } catch (e) {
            console.error("Error parsing stored user data:", e);
          }
        }
      }
    };

    // Función para limpiar datos al salir
    const clearData = () => {
      sessionStorage.removeItem("external_user_data");
    };

    // Extraer parámetros
    extractParams();
    setIsParamsLoaded(true);

    // Limpiar URL si hay parámetros
    const hasParams = window.location.search.includes("userData=");

    if (window.history.replaceState && hasParams) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Añadir evento para limpiar datos al salir
    window.addEventListener("beforeunload", clearData);

    return () => {
      window.removeEventListener("beforeunload", clearData);
    };
  }, []);

  // Función para limpiar datos manualmente
  const clearUserData = () => {
    sessionStorage.removeItem("external_user_data");
    setUserData(null);
  };

  return { userData, isParamsLoaded, clearUserData };
}
