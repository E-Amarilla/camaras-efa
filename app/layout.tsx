import "./globals.css";
import { fontSans, fontMono } from "@/app/fonts";
import { Metadata, Viewport } from "next";
import { Navbar } from "@/components/footer&header/navbar";
import SubNavBar from "@/components/footer&header/navbar2";
import Footer from "@/components/footer&header/footer";

import { Providers } from "./providers";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  title: "EFA - CREMINOX",
  description: "Sistema de visualización de cámaras EFA - Creminox",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-texto font-sans antialiased ">
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="flex flex-col flex-grow min-h-screen">
            <div className="sticky top-0 left-0 w-full z-[999]">
              <Navbar />
              <SubNavBar />
            </div>
            <main className="flex-grow flex">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
