"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import HlsPlayer from "@/components/HlsPlayer";
import { FiMapPin } from "react-icons/fi";
import { CiMail } from "react-icons/ci";
import React, { useEffect, useRef, useState, useMemo } from "react";

function saveAuthFromUrl() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  let saved = false;
  const access_token = params.get("access_token");
  const role = params.get("role");
  const token_type = params.get("token_type");
  if (access_token && role && token_type) {
    const userData = {
      access_token,
      role,
      token_type,
    };
    sessionStorage.setItem("user_data", JSON.stringify(userData));
    saved = true;
  }

  const userDataParam = params.get("userData");
  if (userDataParam) {
    try {
      const userData = JSON.parse(
        decodeURIComponent(decodeURIComponent(userDataParam))
      );
      sessionStorage.setItem("user_data", JSON.stringify(userData));
      saved = true;
    } catch {}
  }
  if (saved) {
    // Limpiar la URL y recargar para que la validación funcione correctamente
    window.history.replaceState({}, document.title, window.location.pathname);
    window.location.reload();
    return true;
  }
  return false;
}

function getUserDataFromSession() {
  if (typeof window === "undefined") return null;
  const data = sessionStorage.getItem("user_data");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

import { useTranslation } from "react-i18next";

// BASE original
const BASE = process.env.NEXT_PUBLIC_MEDIAMTX_BASE ?? "http://localhost:8888";

export default function Page() {
  useEffect(() => {
    const justSaved = saveAuthFromUrl();
    if (justSaved) return; // Esperar recarga
    const userData = getUserDataFromSession();
    if (!userData || !userData.access_token || !userData.role) {
      window.location.href = "http://192.168.20.18:3001";
    }
  }, []);
  const { t } = useTranslation();

  const cams = useMemo(
    () =>
      ["cam1", "cam2", "cam3", "cam4"].map((id) => ({
        id,
        url: `${BASE}/${id}/index.m3u8`,
      })),
    []
  );

  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>(() =>
    cams.reduce(
      (acc, c) => ((acc[c.id] = true), acc),
      {} as Record<string, boolean>
    )
  );

  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const listeners: Array<() => void> = [];

    cams.forEach((c) => {
      const container = containerRefs.current[c.id];
      if (!container) return;
      const video: HTMLVideoElement | null = container.querySelector("video");
      if (!video) {
        // Si no existe video aún, intentaremos más tarde con MutationObserver
        const obs = new MutationObserver((_, ob) => {
          const v = container.querySelector("video");
          if (v) {
            const onLoaded = () =>
              setLoadingMap((prev) =>
                prev[c.id] === false ? prev : { ...prev, [c.id]: false }
              );
            const onErr = () =>
              setLoadingMap((prev) =>
                prev[c.id] === false ? prev : { ...prev, [c.id]: false }
              );
            v.addEventListener("loadeddata", onLoaded);
            v.addEventListener("error", onErr);
            listeners.push(() => {
              v.removeEventListener("loadeddata", onLoaded);
              v.removeEventListener("error", onErr);
            });
            ob.disconnect();
          }
        });
        obs.observe(container, { childList: true, subtree: true });
        listeners.push(() => obs.disconnect());
        return;
      }

      if (video.readyState >= 3) {
        setLoadingMap((prev) =>
          prev[c.id] === false ? prev : { ...prev, [c.id]: false }
        );
        return;
      }

      const onLoaded = () =>
        setLoadingMap((prev) =>
          prev[c.id] === false ? prev : { ...prev, [c.id]: false }
        );
      const onErr = () =>
        setLoadingMap((prev) =>
          prev[c.id] === false ? prev : { ...prev, [c.id]: false }
        );
      video.addEventListener("loadeddata", onLoaded);
      video.addEventListener("error", onErr);
      listeners.push(() => {
        video.removeEventListener("loadeddata", onLoaded);
        video.removeEventListener("error", onErr);
      });
    });

    return () => listeners.forEach((fn) => fn());
  }, [cams]);

  return (
    <div className="grid gap-6 grid-cols-2 xl:grid-cols-4 auto-rows-fr">
      {cams.map((c) => (
        <div
          key={c.id}
          ref={(el) => {
            containerRefs.current[c.id] = el;
          }}
          className="relative rounded-[18px] overflow-hidden bg-background3 border border-background4 shadow-xl aspect-square flex flex-col"
        >
          <div className="w-full h-full">
            <HlsPlayer src={c.url} />
            {loadingMap[c.id] && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[rgba(0,0,0,0.45)]">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full border-4 border-t-transparent border-white w-12 h-12" />
                  <span className="text-white font-semibold tracking-wider">
                    {t("min.cargando")}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="absolute top-[10px] left-[14px] p-[4px_14px_4px_12px] bg-texto2-to-r from-[rgba(17,17,17,.85)] to-[rgba(17,17,17,.45)] backdrop-blur-sm rounded-[14px] text-[11px] tracking-[.18em] font-semibold uppercase border border-[rgba(255,255,255,.08)] text-textoheader">
            {c.id}
          </div>
        </div>
      ))}
    </div>
  );
}
