"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/layout/AuthModal";
import { supabase } from "@/lib/supabase";

export function Header() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    {
      href: "/",
      label: "Accueil",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      href: "/carte",
      label: "Carte",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      href: "/restaurant/new",
      label: "+ Ajouter un resto",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      href: "/feed",
      label: "Feed",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <header style={{ backgroundColor: "#1a1a1a" }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-lg font-bold" style={{ color: "#C4A882" }}>
              DISHLIST
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(({ href, label, icon }) => {
              const isActive = pathname === href;
              const isAdd = label === "+ Ajouter un resto";
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: isAdd ? "#C4A882" : isActive ? "#C4A882" : "transparent",
                    color: isAdd ? "#1a1a1a" : isActive ? "#1a1a1a" : "#8a8075",
                    fontWeight: isAdd ? 700 : 500,
                  }}
                >
                  {icon}
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/profil"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{ backgroundColor: "#2a2a2a", color: "#C4A882" }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "#C4A882", color: "#1a1a1a" }}>
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className="hidden sm:block">{user.email?.split("@")[0]}</span>
              </Link>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{ backgroundColor: "#C4A882", color: "#1a1a1a" }}
              >
                Connexion
              </button>
            )}

            <button
              className="sm:hidden flex flex-col justify-center items-center gap-1.5 w-9 h-9"
              onClick={() => setSidebarOpen(true)}
              aria-label="Menu"
            >
              <span className="block w-6 h-0.5 rounded-full" style={{ backgroundColor: "#C4A882" }} />
              <span className="block w-6 h-0.5 rounded-full" style={{ backgroundColor: "#C4A882" }} />
              <span className="block w-6 h-0.5 rounded-full" style={{ backgroundColor: "#C4A882" }} />
            </button>
          </div>

        </div>
      </header>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}

      {sidebarOpen && (
        <>
          <div
            className="fixed z-40 bg-black/50"
            style={{ inset: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
          <div
            className="z-50 flex flex-col sm:hidden sidebar-panel"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #2a2a2a" }}>
              <span className="font-display text-lg font-bold" style={{ color: "#C4A882" }}>DISHLIST</span>
              <button onClick={() => setSidebarOpen(false)} aria-label="Fermer">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#8a8075" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-4 py-6">
              {navItems.map(({ href, label, icon }) => {
                const isActive = pathname === href;
                const isAdd = label === "+ Ajouter un resto";
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      backgroundColor: isAdd ? "#C4A882" : isActive ? "#2a2a2a" : "transparent",
                      color: isAdd ? "#1a1a1a" : isActive ? "#C4A882" : "#8a8075",
                    }}
                  >
                    {icon}
                    {label}
                  </Link>
                );
              })}

              {user ? (
                <Link
                  href="/profil"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all mt-4"
                  style={{ backgroundColor: "#2a2a2a", color: "#C4A882" }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: "#C4A882", color: "#1a1a1a" }}>
                    {user.email?.[0].toUpperCase()}
                  </div>
                  Mon profil
                </Link>
              ) : (
                <button
                  onClick={() => { setAuthOpen(true); setSidebarOpen(false); }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all mt-4"
                  style={{ backgroundColor: "#C4A882", color: "#1a1a1a" }}
                >
                  Se connecter
                </button>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
