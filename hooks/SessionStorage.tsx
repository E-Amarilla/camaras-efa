"use client";

import { useState, useEffect } from "react";

export default function useUrlParams() {
  const [userData, setUserData] = useState(null);
  const [isParamsLoaded, setIsParamsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const extractParams = () => {
      const urlParams = new URLSearchParams(window.location.search);

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

    const clearData = () => {
      sessionStorage.removeItem("external_user_data");
    };

    extractParams();
    setIsParamsLoaded(true);

    const hasParams = window.location.search.includes("userData=");

    if (window.history.replaceState && hasParams) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    window.addEventListener("beforeunload", clearData);

    return () => {
      window.removeEventListener("beforeunload", clearData);
    };
  }, []);

  const clearUserData = () => {
    sessionStorage.removeItem("external_user_data");
    setUserData(null);
  };

  return { userData, isParamsLoaded, clearUserData };
}
