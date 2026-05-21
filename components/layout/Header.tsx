"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <span className="text-2xl">🍽</span>
          <span className="font-display text-xl font-semibold text-stone-800 group-hover:text-stone-600 transition-colors">
            Carnet de Restos
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {!isHome && (
            <Link
              href="/"
              className="text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors"
            >
              ← Tous les restos
            </Link>
          )}
          <Link
            href="/restaurant/new"
            className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-stone-700 transition-colors duration-150 shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Ajouter un resto
          </Link>
        </nav>
      </div>
    </header>
  );
}