"use client";

import { useRestaurants } from "@/hooks/useRestaurants";
import { Restaurant } from "@/lib/types";
import { StatusBadge } from "@/components/restaurant/StatusBadge";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function CartePage() {
  const { restaurants } = useRestaurants();
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const mapboxgl = require("mapbox-gl");
    require("mapbox-gl/dist/mapbox-gl.css");

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [2.3522, 48.8566],
      zoom: 12,
    });

    mapInstanceRef.current = map;

    map.on("load", () => {
      setIsLoaded(true);

      restaurants
        .filter((r) => r.coordinates)
        .forEach((r) => {
          const el = document.createElement("div");
          el.style.width = "16px";
          el.style.height = "16px";
          el.style.borderRadius = "50%";
          el.style.backgroundColor = r.status === "visited" ? "#22c55e" : "#ef4444";
          el.style.border = "3px solid white";
          el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
          el.style.cursor = "pointer";
          el.style.transition = "transform 0.15s ease";
          el.onmouseenter = () => el.style.transform = "scale(1.3)";
          el.onmouseleave = () => el.style.transform = "scale(1)";

          new mapboxgl.Marker({ element: el })
            .setLngLat([r.coordinates!.lng, r.coordinates!.lat])
            .addTo(map);

          el.addEventListener("click", () => setSelected(r));
        });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [restaurants]);

  return (
    <div className="relative w-full h-screen">
      {/* Carte */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Écran de chargement */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-100 flex flex-col items-center justify-center z-[2000]">
          <div className="text-5xl mb-4 animate-bounce">🗺</div>
          <p className="text-stone-500 font-medium text-sm">Chargement de la carte…</p>
          <div className="mt-4 flex gap-1">
            <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}

      {/* Header flottant */}
      {isLoaded && (
        <div className="absolute top-4 left-4 right-4 z-[1000]">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 border border-stone-100">
            <span className="text-lg">🗺</span>
            <span className="text-stone-500 text-sm font-medium">
              {restaurants.filter(r => r.coordinates).length} restaurants sur la carte
            </span>
          </div>
        </div>
      )}

      {/* Fiche flottante */}
      {selected && (
        <div className="absolute bottom-28 left-4 right-4 z-[1000]">
          <Link href={`/restaurant/${selected.id}`}>
            <div className="bg-white rounded-2xl shadow-xl p-4 flex gap-4 items-center border border-stone-100">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                {selected.photos.length > 0 ? (
                  <img src={selected.photos[0]} alt={selected.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl opacity-30">🍽</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-display font-semibold text-stone-800 truncate">{selected.name}</h3>
                  <StatusBadge status={selected.status} size="sm" />
                </div>
                <p className="text-xs text-stone-400 truncate">📍 {selected.address}</p>
                {selected.rating && (
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < selected.rating! ? "text-amber-400" : "text-stone-200"}`}>★</span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-stone-300 text-lg">›</span>
            </div>
          </Link>
          <button
            onClick={() => setSelected(null)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-stone-900 text-white rounded-full text-xs flex items-center justify-center"
          >✕</button>
        </div>
      )}
    </div>
  );
}
