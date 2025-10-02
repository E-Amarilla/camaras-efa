"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface NetworkContextType {
  clientIP: string | null;
  targetAddress: string | null;
  baseURL: string | null;
  loginURL: string | null;
  redirectURL: string | null;
  camarasURL: string | null;
  mediaMTXBaseURL: string | null;
  isLoading: boolean;
}

interface NetworkProviderProps {
  children: ReactNode;
}

const NetworkContext = createContext<NetworkContextType>({
  clientIP: null,
  targetAddress: null,
  baseURL: null,
  loginURL: null,
  redirectURL: null,
  camarasURL: null,
  mediaMTXBaseURL: null,
  isLoading: true,
});

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const [clientIP, setClientIP] = useState<string | null>(null);
  const [targetAddress, setTargetAddress] = useState<string | null>(null);
  const [baseURL, setBaseURL] = useState<string | null>(null);
  const [loginURL, setLoginURL] = useState<string | null>(null);
  const [redirectURL, setRedirectURL] = useState<string | null>(null);
  const [camarasURL, setCamarasURL] = useState<string | null>(null);
  const [mediaMTXBaseURL, setMediaMTXBaseURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const determineNetworkConfig = () => {
      if (typeof window !== "undefined") {
        // Obtener la URL desde la cual el usuario accede a la página
        const currentURL = window.location.href;
        const url = new URL(currentURL);
        const hostname = url.hostname;

        let base = null;
        let login = null;
        let redirect = null;
        let camaras = null;
        let mediaMTX = null;

        if (hostname.startsWith("192.168.")) {
          // Extraer el segmento de red
          const parts = hostname.split(".");

          if (parts.length === 4) {
            const segmento = parts[2];

            // Si es segmento 10 (VLAN), usar 192.168.10.1
            // Si es segmento 20 o cualquier otro, usar 192.168.20.41
            const frontIP =
              segmento === "10" ? "192.168.10.1" : "192.168.20.41";

            base = `http://${frontIP}:3000`;
            login = `http://${frontIP}:3000`;
            redirect = `http://${frontIP}:3000`;
            camaras = `http://${hostname}:3001`;
            mediaMTX = `http://${hostname}:8888`;
            setClientIP(hostname);
            setTargetAddress(frontIP);
          }
        } else {
          // Para desarrollo local (localhost) o otras situaciones
          base = "http://localhost";
          login = "http://localhost:3000";
          redirect = "http://localhost:3000";
          camaras = "http://localhost:3001";
          mediaMTX = "http://localhost:8888";
          setClientIP(hostname);
          setTargetAddress("localhost");
        }

        setBaseURL(base);
        setLoginURL(login);
        setRedirectURL(redirect);
        setCamarasURL(camaras);
        setMediaMTXBaseURL(mediaMTX);

        // Debug: mostrar las URLs configuradas
        console.log("=== Network Configuration ===");
        console.log("Hostname:", hostname);
        console.log("BaseURL:", base);
        console.log("LoginURL:", login);
        console.log("RedirectURL:", redirect);
        console.log("CamarasURL:", camaras);
        console.log("MediaMTXBaseURL:", mediaMTX);
        console.log("============================");

        // Guardar en sessionStorage para uso posterior (se borra al cerrar ventana)
        if (base && login && redirect && camaras && mediaMTX) {
          sessionStorage.setItem("baseURL", base);
          sessionStorage.setItem("loginURL", login);
          sessionStorage.setItem("redirectURL", redirect);
          sessionStorage.setItem("camarasURL", camaras);
          sessionStorage.setItem("mediaMTXBaseURL", mediaMTX);
          sessionStorage.setItem("clientIP", hostname);
          sessionStorage.setItem("targetAddress", targetAddress || "");
        }

        setIsLoading(false);
      }
    };

    // Primero intentar cargar desde sessionStorage
    if (typeof window !== "undefined") {
      const storedBase = sessionStorage.getItem("baseURL");
      const storedLogin = sessionStorage.getItem("loginURL");
      const storedRedirect = sessionStorage.getItem("redirectURL");
      const storedCamaras = sessionStorage.getItem("camarasURL");
      const storedMediaMTX = sessionStorage.getItem("mediaMTXBaseURL");
      const storedClientIP = sessionStorage.getItem("clientIP");
      const storedTargetAddress = sessionStorage.getItem("targetAddress");

      if (
        storedBase &&
        storedLogin &&
        storedRedirect &&
        storedCamaras &&
        storedMediaMTX
      ) {
        setBaseURL(storedBase);
        setLoginURL(storedLogin);
        setRedirectURL(storedRedirect);
        setCamarasURL(storedCamaras);
        setMediaMTXBaseURL(storedMediaMTX);
        setClientIP(storedClientIP);
        setTargetAddress(storedTargetAddress);
        setIsLoading(false);
      } else {
        determineNetworkConfig();
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const contextValue: NetworkContextType = {
    clientIP,
    targetAddress,
    baseURL,
    loginURL,
    redirectURL,
    camarasURL,
    mediaMTXBaseURL,
    isLoading,
  };

  return (
    <NetworkContext.Provider value={contextValue}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkContext;
