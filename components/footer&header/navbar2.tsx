"use client";

import Link from "next/link";
import { GoDotFill } from "react-icons/go";
import { useTranslation } from "react-i18next";
import { useNetwork } from "@/contexts/NetworkContext";

const SubNav = () => {
  const { t } = useTranslation();
  const { redirectURL } = useNetwork();

  const DESAC_CLASS = "opacity-50 cursor-not-allowed pointer-events-none";

  const opcionesBotones = [
    {
      id: 1,
      path: "/",
      text: t("mayus.completo"),
      styleClass: "",
    },
    {
      id: 2,
      path: ["/desmoldeo", "/desmoldeo/equipos"],
      text: t("mayus.desmoldeo"),
      styleClass: "",
    },
    {
      id: 3,
      path: "/encajonado",
      text: t("mayus.encajonado"),
      styleClass: "desac",
    },
    {
      id: 4,
      path: "/paletizado",
      text: t("mayus.paletizado"),
      styleClass: "desac",
    },
  ];

  return (
    <div className="w-full bg-background2 shadow-sm flex flex-row justify-center">
      <ul className="flex flex-row items-center gap-6">
        {opcionesBotones.map(({ id, path, text, styleClass }) => {
          return (
            <li
              key={id}
              className={`relative py-3 transition-colors
              ${styleClass === "desac" ? DESAC_CLASS : styleClass}`}
            >
              <Link
                className="flex items-center gap-2 hover:text-texto2"
                href={`${redirectURL}${Array.isArray(path) ? path[0] : path}`}
              >
                <GoDotFill className="text-gray-500" />
                <span>{text}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SubNav;
