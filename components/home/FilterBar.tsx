"use client";

import { FilterState, CuisineType, CUISINE_TYPES } from "@/lib/types";

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  counts: { all: number; visited: number; toVisit: number };
}

export function FilterBar({ filters, onChange, counts }: FilterBarProps) {
  const statusOptions: { value: FilterState["status"]; label: string; count: number }[] = [
    { value: "all", label: "Tous", count: counts.all },
    { value: "visited", label: "Déjà visité", count: counts.visited },
    { value: "to-visit", label: "À visiter", count: counts.toVisit },
  ];

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-stone-200 shadow-sm">
        {statusOptions.map(({ value, label, count }) => (
          <button
            key={value}
            onClick={() => onChange({ ...filters, status: value })}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
              ${
                filters.status === value
                  ? "bg-stone-900 text-white shadow-sm"
                  : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
              }
            `}
          >
            {label}
            <span className="ml-1.5 text-xs font-normal text-stone-300">
              {count}
            </span>
          </button>
        ))}
      </div>

      <select
        value={filters.cuisine}
        onChange={(e) =>
          onChange({ ...filters, cuisine: e.target.value as CuisineType | "all" })
        }
        className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-600 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-300 hover:border-stone-300 transition-colors cursor-pointer"
      >
        <option value="all">Toutes les cuisines</option>
        {CUISINE_TYPES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        value={filters.minRating}
        onChange={(e) =>
          onChange({ ...filters, minRating: Number(e.target.value) })
        }
        className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-600 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-300 hover:border-stone-300 transition-colors cursor-pointer"
      >
        <option value={0}>Toutes les notes</option>
        <option value={3}>★★★ et plus</option>
        <option value={4}>★★★★ et plus</option>
        <option value={5}>★★★★★ uniquement</option>
      </select>

      {(filters.status !== "all" || filters.cuisine !== "all" || filters.minRating > 0) && (
        <button
          onClick={() => onChange({ status: "all", cuisine: "all", minRating: 0 })}
          className="text-sm text-stone-400 hover:text-stone-700 underline underline-offset-2 transition-colors"
        >
          Réinitialiser
        </button>
      )}
    </div>
  );
}