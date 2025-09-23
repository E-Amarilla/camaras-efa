"use client";

import { Navbar } from "@/components/footer&header/navbar";
import SubNavBar from "@/components/footer&header/navbar2";
import Footer from "@/components/footer&header/footer";
import { usePathname } from "next/navigation";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const currentPath = usePathname();

  return (
    <div className="flex flex-col flex-grow min-h-screen">
      <div className="sticky top-0 left-0 w-full z-[999]">
        <Navbar currentPath={currentPath} />
        <SubNavBar />
      </div>
      <main className="flex-grow p-5">{children}</main>
      <Footer />
    </div>
  );
};
