import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMapPin } from "react-icons/fi";
import { CiMail } from "react-icons/ci";

interface FooterOption {
  id: number;
  icono: React.ReactElement;
  link: string;
  texto: string;
}

const Footer: React.FC = () => {
  const opcionesIzq: FooterOption[] = [
    {
      id: 1,
      icono: <FiMapPin className="w-auto h-[100%]" />,
      link: "https://www.google.com/maps/place/Beron+de+Astrada+2745,+CABA,+Argentina",
      texto: "Beron de Astrada 2745, CABA, Argentina",
    },
  ];

  const opcionesDer: FooterOption[] = [
    {
      id: 2,
      icono: <CiMail className="w-auto h-[100%]" />,
      link: "mailto:soporte@creminox.com",
      texto: "soporte@creminox.com",
    },
  ];

  return (
    <footer className="flex flex-col align-middle bg-headerbg text-white">
      <div className="flex flex-row w-[100%] max-w-1920 h-[10rem] justify-between align-middle p-[40px]">
        <ul className="flex flex-col justify-center align-middle h-[100%] w-[30%]">
          {opcionesIzq.map(({ id, icono, link, texto }) => (
            <li
              key={id}
              className="flex flex-row items-center justify-start h-1/2 py-[1vh] gap-[10px]"
            >
              <Link
                className="flex flex-row items-center h-[100%] gap-[10px]"
                href={link}
                rel="noopener noreferrer"
                target="_blank"
              >
                {icono}
                <p className="items-center text-white">{texto}</p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex justify-center align-middle h-[100%] w-[40%]">
          <Link
            className="flex w-auto h-[100%] p-0 justify-center items-center"
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
          </Link>
        </div>

        <ul className="flex flex-col justify-center align-middle h-full w-[30%]">
          {opcionesDer.map(({ id, icono, link, texto }) => (
            <li
              key={id}
              className="flex flex-row items-center justify-end h-1/2 py-[1vh] gap-[10px]"
            >
              <Link
                className="flex flex-row items-center h-full gap-[15px]"
                href={link}
                rel="noopener noreferrer"
                target="_blank"
              >
                <p className="items-center text-white">{texto}</p>
                {icono}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-[#6668]" />

      <p className="flex text-xs font-light text-texto2 py-[5px] w-[100%] justify-center align-middle">
        ©2025 All Rights Reserved Cremona Inoxidable EFA - v2.0.0
      </p>
    </footer>
  );
};

export default Footer;
