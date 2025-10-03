"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoDotFill } from "react-icons/go";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@heroui/tooltip";
import { useNetwork } from "@/contexts/NetworkContext";

const SubNav = () => {
  const { t } = useTranslation();
  const { redirectURL } = useNetwork();
  const pathname = usePathname();  // Agrega esto para obtener el path actual

  const DESAC_CLASS = "opacity-50 cursor-not-allowed";

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
    <div className="w-full bg-background2 flex flex-row justify-center shadow-[5px_5px_5px_5px_rgba(0,0,0,0.20)]">
      <ul className="flex flex-row items-center gap-6">
        {opcionesBotones.map(({ id, path, text, styleClass }) => {
          const isActive = Array.isArray(path)
            ? path.includes(pathname)
            : pathname === path;

          const isDisabled = styleClass === "desac";

          return (
            <li
              key={id}
              className={`relative py-3 transition-colors ${
                isActive ? "font-semibold" : "font-normal"
              } ${isDisabled ? DESAC_CLASS : styleClass}`}
            >
              {isDisabled ? (
                <Tooltip
                  className="bg-background3"
                  content={t("min.proximamente")}
                  placement="bottom"
                  radius="sm"
                >
                  <div className="flex items-center gap-2">
                    <GoDotFill className="text-gray-500" />
                    <p>{text}</p>
                  </div>
                </Tooltip>
              ) : (
                <Link
                  className="flex items-center gap-2 hover:text-texto2"
                  href={`${redirectURL}${Array.isArray(path) ? path[0] : path}`}
                >
                  {isActive ? (
                    <GoDotFill className="text-green-500" />
                  ) : (
                    <GoDotFill className="text-gray-500" />
                  )}
                  <p>{text}</p>
                </Link>
              )}
              {isActive && !isDisabled && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SubNav;
