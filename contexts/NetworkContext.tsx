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

        if (hostname === "192.168.10.1") {
          // Usuario ingresó desde VLAN
          base = "http://192.168.10.1";
          login = "http://192.168.10.1:3000";
          redirect = "http://192.168.10.1:3000";
          camaras = "http://192.168.10.1:3001";
          mediaMTX = "http://192.168.10.1:8888";
          setClientIP("192.168.10.1");
          setTargetAddress("192.168.10.1");
        } else if (hostname === "192.168.20.41") {
          // Usuario ingresó desde LOCAL
          base = "http://192.168.20.41";
          login = "http://192.168.20.41:3000";
          redirect = "http://192.168.20.41:3000";
          camaras = "http://192.168.20.41:3001";
          mediaMTX = "http://192.168.20.41:8888";
          setClientIP("192.168.20.41");
          setTargetAddress("192.168.20.41");
        } else if (hostname.startsWith("192.168.")) {
          // Caso genérico para otras IPs de la red 192.168.x.x
          const parts = hostname.split(".");

          if (parts.length === 4) {
            const segmento = parts[2];
            const baseIP = `192.168.${segmento}.1`;

            base = `http://${baseIP}`;
            login = `http://${baseIP}:3000`;
            redirect = `http://${baseIP}:3000`;
            camaras = `http://${baseIP}:3001`;
            mediaMTX = `http://${baseIP}:8888`;
            setClientIP(hostname);
            setTargetAddress(baseIP);
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

        // Guardar en localStorage para uso posterior
        if (base && login && redirect && camaras && mediaMTX) {
          localStorage.setItem("baseURL", base);
          localStorage.setItem("loginURL", login);
          localStorage.setItem("redirectURL", redirect);
          localStorage.setItem("camarasURL", camaras);
          localStorage.setItem("mediaMTXBaseURL", mediaMTX);
          localStorage.setItem("clientIP", hostname);
          localStorage.setItem("targetAddress", targetAddress || "");
        }

        setIsLoading(false);
      }
    };

    // Primero intentar cargar desde localStorage
    if (typeof window !== "undefined") {
      const storedBase = localStorage.getItem("baseURL");
      const storedLogin = localStorage.getItem("loginURL");
      const storedRedirect = localStorage.getItem("redirectURL");
      const storedCamaras = localStorage.getItem("camarasURL");
      const storedMediaMTX = localStorage.getItem("mediaMTXBaseURL");
      const storedClientIP = localStorage.getItem("clientIP");
      const storedTargetAddress = localStorage.getItem("targetAddress");

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
