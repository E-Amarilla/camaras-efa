"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HlsPlayer from "@/components/HlsPlayer";
import { FiMapPin } from "react-icons/fi";
import { CiMail } from "react-icons/ci";
import { IoChevronBackSharp } from "react-icons/io5";
import { VscBell } from "react-icons/vsc";
import { GoGear, GoDotFill } from "react-icons/go";
import { Navbar as HeroUINavbar } from "@heroui/navbar";

import DropdownBanderas from "@/components/dropdownBanderas";
import { useTranslation } from "react-i18next";

import { ThemeSwitch } from "@/components/theme-switch";

// BASE original
const BASE = process.env.NEXT_PUBLIC_MEDIAMTX_BASE ?? "http://localhost:8888";

interface OpcionMenu {
  id: number;
  url: string;
  text: string;
}

interface OpcionIcono {
  id: number;
  icon: React.ReactNode;
}

export default function Page() {
  const { t } = useTranslation();

  const cams = ["cam1", "cam2", "cam3", "cam4"].map((id) => ({
    id,
    url: `${BASE}/${id}/index.m3u8`,
  }));

  const opcionesMenu: OpcionMenu[] = [
    { id: 1, url: "http://192.168.10.114:3000/completo", text: t("min.home") }
  ];
  // Obtenemos el path actual para determinar la navegación activa
  const pathname = usePathname();

  // Opciones de navegación para el SubNav
  const opcionesBotones = [
    {
      id: 1,
      path: "http://192.168.10.114:3000/completo",
      text: t("mayus.completo"),
    },
    {
      id: 2,
      path: "http://192.168.10.114:3000/desmoldeo",
      text: t("mayus.desmoldeo"),
    },
    {
      id: 3,
      path: "http://192.168.10.114:3000/encajonado",
      text: t("mayus.encajonado"),
      disabled: true,
    },
    {
      id: 4,
      path: "http://192.168.10.114:3000/paletizado",
      text: t("mayus.paletizado"),
      disabled: true,
    },
  ];

  const opcionesIconos: OpcionIcono[] = [
    {
      id: 1,
      icon: (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.history.back();
          }}
          aria-label="Volver"
          className="group relative flex items-center justify-center w-[25px] h-[25px] ease-in-out"
        >
          <div className="absolute inset-0 rounded-lg bg-gray-400/0 group-hover:bg-gray-400/20 ease-in-out group-hover:scale-150 pointer-events-none" />
          <IoChevronBackSharp className="w-[25px] h-[25px] header transition-transform ease-in-out group-hover:scale-110" />
        </a>
      ),
    },
    {
      id: 2,
      icon: (
        <a
          href="http://192.168.10.114:3000/configuracion"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Configuración"
          className="group relative flex items-center justify-center w-[25px] h-[25px] ease-in-out"
        >
          <div className="absolute inset-0 rounded-lg bg-gray-400/0 group-hover:bg-gray-400/20 ease-in-out group-hover:scale-150 pointer-events-none" />
          <GoGear className="w-[25px] h-[25px] header transition-transform ease-in-out group-hover:scale-110" />
        </a>
      ),
    },
    { id: 3, icon: <DropdownBanderas /> },
    { id: 4, icon: <ThemeSwitch /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col scrollbar-none">
      {/* Añade esto para ocultar la scrollbar en Chrome, Safari y otros navegadores webkit */}
      <style jsx global>{`
        body::-webkit-scrollbar {
          display: none;
        }
        html {
          scrollbar-width: none;
        }
      `}</style>

      <header className="sticky top-0 z-40 flex flex-col w-full text-textoheader font-sans">
        <HeroUINavbar className="!bg-headerbg text-textoheader h-[4rem]" maxWidth="full" position="sticky">
          <div className="flex flex-row h-full w-[30%] justify-start gap-[30px] items-center">
            {opcionesIconos
              .map(({ id, icon }) => (
                <div key={id} className="flex items-center justify-center">
                  {icon}
                </div>
              ))}
          </div>

          <p className="flex w-[40%] justify-center header">EFA - Creminox</p>

          <div className="flex flex-row w-[30%] justify-end">
            <ul className="flex flex-row w-full h-[100%] gap-[30px] justify-end">
              {opcionesMenu.map(({ id, url, text }) => (
                <li key={id} className="h-[100%]">
                  <Link
                    className={pathname === url ? "activeLink" : ""}
                    href={url}
                  >
                    <span className="header">{text}</span>
                  </Link>
                </li>
              ))}
              <Link
                href="https://creminox.com"
                rel="noopener noreferrer"
                target="_blank"
              >
              <Image
                src="/creminox.png"
                alt="Creminox"
                width={1000}
                height={1000}
                className="h-[100%] w-[105px]"
              />
              </Link>
            </ul>
          </div>
        </HeroUINavbar>

        {/* Sub Nav (copiando estilos de navbar2.tsx, sin cambiar lógica) */}
        <div className="w-full bg-background2 shadow-sm flex flex-row justify-center">
          <ul className="flex flex-row items-center gap-6">
            {opcionesBotones.map(({ id, path: p, text, disabled }) => {
              const styleClass = disabled ? "desac" : "";
              const isExternal = typeof p === "string" && (/^(https?:)?\/\//.test(p) || /^\d/.test(p));
              return (
                <li key={id} className={`relative py-3 transition-colors font-normal ${styleClass}`}>
                  {isExternal ? (
                    <a
                      href={p.startsWith("http") ? p : `http://${p}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <GoDotFill className="text-gray-500" />
                      <span className="header">{text}</span>
                    </a>
                  ) : (
                    <Link href={Array.isArray(p) ? p[0] : p} className="flex items-center gap-2">
                      <GoDotFill className="text-gray-500" />
                      <span className="header">{text}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="place-content-around flex-1 w-full max-w-[1920px] mx-auto pt-[22px] pr-[30px] pb-[32px] pl-[30px] flex flex-col gap-[20px]">
        <div className="grid gap-[25px] grid-cols-[repeat(auto-fill,minmax(430px,1fr))] auto-rows-[minmax(280px,44vh)]">
          {cams.map((c) => (
            <div
              key={c.id}
              className="relative rounded-[18px] overflow-hidden bg-background3 border border-background4 shadow-xl min-h-[280px] flex flex-col"
            >
              <div className="w-full h-full">
                <HlsPlayer src={c.url} />
              </div>
              <div className="absolute top-[10px] left-[14px] p-[4px_14px_4px_12px] bg-texto2-to-r from-[rgba(17,17,17,.85)] to-[rgba(17,17,17,.45)] backdrop-blur-sm rounded-[14px] text-[11px] tracking-[.18em] font-semibold uppercase border border-[rgba(255,255,255,.08)] text-textoheader">
                {c.id}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="flex flex-col align-middle bg-headerbg font-sans">
        <div className="flex flex-row w-full max-w-[1920px] h-[10rem] justify-between align-middle p-[40px]">
          {/* Izquierda */}
          <ul className="flex flex-col justify-center align-middle h-full w-[30%]">
            <li className="flex flex-row items-center justify-start h-1/2 py-[1vh] gap-[10px]">
              <a
                className="flex flex-row items-center h-full gap-[10px]"
                href="https://www.google.com/maps/place/Beron+de+Astrada+2745,+CABA,+Argentina"
                rel="noopener noreferrer"
                target="_blank"
              >
                <FiMapPin className="w-auto h-full" />
                <p className="items-center font-sans">Beron de Astrada 2745, CABA, Argentina</p>
              </a>
            </li>
          </ul>

          {/* Centro (logo) */}
          <div className="flex justify-center align-middle h-full w-[40%]">
            <a
              className="flex w-auto h-full p-0 justify-center items-center"
              href="https://creminox.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                alt="Creminox logo"
                className="h-1/2 w-auto"
                height={2000}
                src="/creminox-logo.png"
                width={2000}
              />
            </a>
          </div>

          {/* Derecha */}
          <ul className="flex flex-col justify-center align-middle h-full w-[30%]">
            <li className="flex flex-row items-center justify-end h-1/2 py-[1vh] gap-[10px]">
              <a
                className="flex flex-row items-center h-full gap-[15px]"
                href="mailto:soporte@creminox.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                <p className="items-center font-sans">soporte@creminox.com</p>
                <CiMail className="w-auto h-full" />
              </a>
            </li>
          </ul>
        </div>

        <hr className="border-[#6668]" />

        <p className="flex text-xs font-light text-[#666] py-[5px] w-full justify-center align-middle font-sans">
          {t("min.derechos")}
        </p>
      </footer>
    </div>
  );
}