"use client";

import { Navbar as HeroUINavbar } from "@heroui/navbar";
import { useTranslation } from "react-i18next";
import { VscBell } from "react-icons/vsc";
import { GoGear } from "react-icons/go";
import { IoChevronBackSharp } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { ThemeSwitch } from "@/components/theme-switch";
import DropdownBanderas from "@/components/footer&header/dropdownBanderas";
import { useAuth } from "@/hooks/useAuth";
import { useNetwork } from "@/contexts/NetworkContext";
import { UserRole } from "@/types";

interface OpcionIcono {
  id: number;
  url?: string;
  icon: React.ReactNode;
}

interface OpcionMenu {
  id: number;
  url?: string;
  text: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { redirectURL, camarasURL } = useNetwork();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const opcionesIconos: OpcionIcono[] = [
    {
      id: 1,
      icon: (
        <Link
          className="group relative flex items-center justify-center w-[25px] h-[25px] ease-in-out"
          href={`${redirectURL}/`}
        >
          <div className="absolute inset-0 rounded-lg bg-gray-400/0 group-hover:bg-gray-400/20 ease-in-out group-hover:scale-150 pointer-events-none" />
          <IoChevronBackSharp className="w-[25px] h-[25px] header transition-transform ease-in-out group-hover:scale-110" />
        </Link>
      ),
    },
    ...(user && user.role === UserRole.ADMIN
      ? [
          {
            id: 2,
            url: "/alertas",
            icon: (
              <Link
                className="group relative flex items-center justify-center w-[25px] h-[25px] ease-in-out"
                href={`${redirectURL}/alertas`}
              >
                <div className="absolute inset-0 rounded-lg bg-gray-400/0 group-hover:bg-gray-400/20 ease-in-out group-hover:scale-150 pointer-events-none" />

                <VscBell className="w-[25px] h-[25px] header transition-transform ease-in-out group-hover:scale-110" />
              </Link>
            ),
          },
          {
            id: 3,
            icon: (
              <Link
                className="group relative flex items-center justify-center w-[25px] h-[25px] ease-in-out"
                href={`${redirectURL}/configuraciones`}
              >
                <div className="absolute inset-0 rounded-lg bg-gray-400/0 group-hover:bg-gray-400/20 ease-in-out group-hover:scale-150 pointer-events-none" />

                <GoGear className="w-[25px] h-[25px] header transition-transform ease-in-out group-hover:scale-110" />
              </Link>
            ),
          },
        ]
      : []),
    { id: 4, icon: <DropdownBanderas /> },
    { id: 5, icon: <ThemeSwitch /> },
  ];

  const opcionesMenu: OpcionMenu[] = [
    { id: 1, url: `${redirectURL}/`, text: t("min.home") },
    {
      id: 2,
      text: t("min.camaras"),
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        // No hacer nada, ya estamos en la aplicación de cámaras
      },
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <HeroUINavbar
      className="bg-headerbg text-textoheader"
      maxWidth="full"
      position="sticky"
    >
      <div className="flex flex-row h-[100%] w-[30%] justify-start gap-[30px] items-center">
        {opcionesIconos.map(({ id, icon }) => (
          <div
            key={id}
            className="flex items-center justify-center cursor-pointer"
          >
            {icon}
          </div>
        ))}
      </div>

      <p className="flex w-[40%] justify-center header font-bold">
        {t("min.titulo")}
      </p>

      <div className="flex flex-row w-[30%] justify-end">
        <ul className="flex flex-row w-full h-[100%] gap-[30px] justify-end">
          {opcionesMenu.map(({ id, url, text, onClick }) => (
            <li key={id} className="h-[100%]">
              {onClick ? (
                <button
                  className="header bg-transparent border-none p-0 m-0 cursor-pointer"
                  type="button"
                  onClick={onClick}
                >
                  {text}
                </button>
              ) : (
                url && (
                  <Link href={url}>
                    <span className="header">{text}</span>
                  </Link>
                )
              )}
            </li>
          ))}
          <Link
            href="https://creminox.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              alt="Creminox"
              className="h-[100%] w-[105px]"
              height={100}
              src="/creminox.png"
              width={500}
            />
          </Link>
        </ul>
      </div>
    </HeroUINavbar>
  );
};
