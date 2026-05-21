"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[999] flex justify-center px-6">
      <nav className="bg-stone-900/95 backdrop-blur-md rounded-full shadow-2xl px-6 py-3 flex items-center gap-8">
        <Link
          href="/carte"
          className={`flex flex-col items-center gap-1 transition-colors
            ${pathname === "/carte" ? "text-white" : "text-stone-400 hover:text-stone-200"}`}
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="text-xs font-medium">Carte</span>
        </Link>

        <Link
          href="/restaurant/new"
          className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-stone-100 transition-colors"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="black" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </Link>

        <Link
          href="/feed"
          className={`flex flex-col items-center gap-1 transition-colors
            ${pathname === "/feed" ? "text-white" : "text-stone-400 hover:text-stone-200"}`}
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <span className="text-xs font-medium">Feed</span>
        </Link>
      </nav>
    </div>
  );
}
