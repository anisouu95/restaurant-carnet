"use client";

import { useState, useEffect } from "react";

interface FoursquarePlace {
  fsq_id: string;
  name: string;
  categories: { name: string }[];
  location: { formatted_address: string };
  rating?: number;
  distance?: number;
  photos?: { prefix: string; suffix: string }[];
}

export default function RecommandationsPage() {
  const [places, setPlaces] = useState<FoursquarePlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchPlaces(pos.coords.latitude, pos.coords.longitude),
      () => fetchPlaces(48.8566, 2.3522)
    );
  }, []);

  async function fetchPlaces(lat: number, lng: number) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/recommandations?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      setPlaces(data.results ?? []);
    } catch {
      setError("Impossible de charger les recommandations.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: "#f5f0eb", minHeight: "100vh" }} className="px-10 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#C4A882" }}>
          Autour de toi
        </p>
        <h1 className="font-display text-4xl font-bold" style={{ color: "#1a1a1a" }}>
          RECOMMANDATIONS
        </h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <p className="animate-pulse text-sm" style={{ color: "#8a8075" }}>Recherche des restos proches…</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-sm" style={{ color: "#8a8075" }}>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {places.map((place) => {
            const photo = place.photos?.[0];
            const photoUrl = photo ? `${photo.prefix}400x300${photo.suffix}` : null;
            const category = place.categories?.[0]?.name ?? "Restaurant";
            const distance = place.distance
              ? place.distance < 1000
                ? `${place.distance}m`
                : `${(place.distance / 1000).toFixed(1)}km`
              : null;

            return (
              <article
                key={place.fsq_id}
                className="rounded-xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                style={{ backgroundColor: "#ffffff", borderColor: "#e8e0d5" }}
              >
                <div className="relative h-44" style={{ backgroundColor: "#f0ebe4" }}>
                  {photoUrl ? (
                    <img src={photoUrl} alt={place.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl opacity-20">🍽</span>
                    </div>
                  )}
                  {distance && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: "#1a1a1a", color: "#f5f0eb" }}>
                      📍 {distance}
                    </div>
                  )}
                  {place.rating && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: "#C4A882", color: "#1a1a1a" }}>
                      ★ {place.rating}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#C4A882" }}>
                    {category}
                  </p>
                  <h2 className="font-display text-lg font-semibold leading-tight mb-1" style={{ color: "#1a1a1a" }}>
                    {place.name}
                  </h2>
                  <p className="text-xs truncate mb-4" style={{ color: "#8a8075" }}>
                    📍 {place.location?.formatted_address}
                  </p>
                  <div className="pt-3" style={{ borderTop: "1px solid #f0ebe4" }}>
                    <button
                      className="w-full py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                      style={{ backgroundColor: "#1a1a1a", color: "#f5f0eb" }}
                    >
                      + Ajouter à mon carnet
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
