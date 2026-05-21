"use client";

import { useState } from "react";

interface ReviewSectionProps {
  value?: string;
  onChange: (review: string) => void;
}

export function ReviewSection({ value, onChange }: ReviewSectionProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Ambiance, plats mémorables, service, ce que tu referais ou pas…"
        rows={5}
        className={`w-full px-4 py-3 rounded-xl border bg-white text-stone-800 
          placeholder-stone-300 resize-none transition-all
          focus:outline-none focus:ring-2 focus:ring-stone-300
          ${isFocused ? "border-stone-300" : "border-stone-200"}`}
      />
      <p className="mt-1.5 text-xs text-stone-300 text-right">
        {(value ?? "").length} caractères
      </p>
    </div>
  );
}
