"use client";

import { useState } from "react";

interface StarRatingProps {
  value?: number;
  onChange: (rating: number) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1;
        const filled = hovered !== null ? star <= hovered : star <= (value ?? 0);
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            className="text-3xl transition-transform hover:scale-110"
          >
            <span className={filled ? "text-amber-400" : "text-stone-200"}>★</span>
          </button>
        );
      })}
      {value && (
        <span className="ml-2 text-sm text-stone-400 font-medium">
          {value}/5
        </span>
      )}
    </div>
  );
}
