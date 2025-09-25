"use client";

import { useNetwork } from "@/contexts/NetworkContext";
import { useState } from "react";

export const ConfigGenerator = () => {
  const { clientIP, targetAddress } = useNetwork();
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const generateConfig = async () => {
    if (!clientIP || !targetAddress) {
      setMessage("Error: No se puede detectar la configuración de red");
      return;
    }

    setIsGenerating(true);
    setMessage("");

    try {
      const response = await fetch("/api/generate-mediamtx-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessIP: clientIP,
          targetAddress: targetAddress,
        }),
      });

      if (response.ok) {
        setMessage(`Configuración generada exitosamente para red ${clientIP}`);
      } else {
        setMessage("Error al generar la configuración");
      }
    } catch (error) {
      setMessage("Error de conexión al generar la configuración");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Configuración MediaMTX</h3>
      <p className="text-sm text-gray-600 mb-2">
        IP detectada: {clientIP || "No detectada"}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        Red objetivo: {targetAddress || "No detectada"}
      </p>

      <button
        onClick={generateConfig}
        disabled={isGenerating || !clientIP}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isGenerating ? "Generando..." : "Regenerar Configuración"}
      </button>

      {message && (
        <p
          className={`mt-2 text-sm ${
            message.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};
