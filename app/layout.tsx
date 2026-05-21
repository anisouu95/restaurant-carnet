import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
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
      <body className="bg-stone-50 text-stone-900 antialiased">
        <main className="min-h-screen pb-20">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
