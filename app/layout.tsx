import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Mon Carnet de Restos",
  description: "Mes restaurants à visiter et mes coups de cœur",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable}`}>
      <body style={{ backgroundColor: "#f5f0eb", color: "#1a1a1a" }} className="antialiased">
        <Header />
        <main className="min-h-screen pb-28 sm:pb-0">{children}</main>
        <div className="sm:hidden">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
