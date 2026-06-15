"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Recommandations",
      icon: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      href: "/carte",
      label: "Carte",
      icon: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      href: "/restaurant/new",
      label: "+ Ajouter",
      icon: null,
    },
    {
      href: "/feed",
      label: "Feed",
      icon: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ),
    },
  ];

  return (
    <header style={{ backgroundColor: "#1a1a1a" }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-bold" style={{ color: "#C4A882" }}>
            🍽 Carnet
          </span>
        </Link>

        {/* Nav centrale — cachée sur mobile */}
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            const isAdd = label === "+ Ajouter";
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: isAdd
                    ? "#C4A882"
                    : isActive ? "#C4A882" : "transparent",
                  color: isAdd
                    ? "#1a1a1a"
                    : isActive ? "#1a1a1a" : "#8a8075",
                  fontWeight: isAdd ? 700 : 500,
                }}
              >
                {icon}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Connexion */}
        <button
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{ backgroundColor: "#C4A882", color: "#1a1a1a" }}
        >
          Connexion
        </button>

      </div>

      {/* Sous-nav Feed */}
      {pathname === "/feed" && (
        <div style={{ backgroundColor: "#111111", borderTop: "1px solid #2a2a2a" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-11 flex items-center gap-2">
            <Link
              href="/feed?tab=visited"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ backgroundColor: "#C4A882", color: "#1a1a1a" }}
            >
              ✅ Déjà visité
            </Link>
            <Link
              href="/feed?tab=to-visit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ backgroundColor: "transparent", color: "#8a8075", border: "1px solid #2a2a2a" }}
            >
              🔴 À visiter
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
