"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRestaurants } from "@/hooks/useRestaurants";
import { StatusBadge } from "@/components/restaurant/StatusBadge";
import Link from "next/link";

function StarDisplay({ rating }: { rating?: number }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < rating ? "#C4A882" : "#e0d8ce" }} className="text-sm">★</span>
      ))}
    </div>
  );
}

export default function FeedPage() {
  const { restaurants, isLoading } = useRestaurants();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"visited" | "to-visit">("visited");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "to-visit") setActiveTab("to-visit");
    else setActiveTab("visited");
  }, [searchParams]);

  const visited = restaurants.filter((r) => r.status === "visited");
  const toVisit = restaurants.filter((r) => r.status === "to-visit");
  const displayed = activeTab === "visited" ? visited : toVisit;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="animate-pulse" style={{ color: "#8a8075" }}>Chargement…</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 pb-16">
      {/* Onglets */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab("visited")}
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            backgroundColor: activeTab === "visited" ? "#1a1a1a" : "#ffffff",
            color: activeTab === "visited" ? "#ffffff" : "#8a8075",
            border: `1px solid ${activeTab === "visited" ? "#1a1a1a" : "#e8e0d5"}`,
          }}
        >
          Déjà visité ({visited.length})
        </button>
        <button
          onClick={() => setActiveTab("to-visit")}
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            backgroundColor: activeTab === "to-visit" ? "#1a1a1a" : "#ffffff",
            color: activeTab === "to-visit" ? "#ffffff" : "#8a8075",
            border: `1px solid ${activeTab === "to-visit" ? "#1a1a1a" : "#e8e0d5"}`,
          }}
        >
          À visiter ({toVisit.length})
        </button>
      </div>

      {/* Grille */}
      {displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-6xl mb-6">🍽</span>
          <h2 className="font-display text-2xl font-semibold mb-3" style={{ color: "#1a1a1a" }}>
            {activeTab === "visited" ? "Aucun resto visité" : "Aucun resto à visiter"}
          </h2>
          <p className="mb-8" style={{ color: "#8a8075" }}>
            {activeTab === "visited" ? "Marque un resto comme visité pour le voir ici." : "Ajoute un resto que tu veux essayer."}
          </p>
          <Link
            href="/restaurant/new"
            className="px-6 py-3 rounded-xl font-medium"
            style={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}
          >
            + Ajouter un resto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayed.map((restaurant) => (
            <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
              <article
                className="rounded-xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: "#ffffff", borderColor: "#e8e0d5" }}
              >
                {/* Photo */}
                <div className="relative h-48" style={{ backgroundColor: "#f0ebe4" }}>
                  {restaurant.photos.length > 0 ? (
                    <img src={restaurant.photos[0]} alt={restaurant.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl opacity-20">🍽</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={restaurant.status} size="sm" />
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#C4A882" }}>
                    {restaurant.cuisine}
                  </p>
                  <h2 className="font-display text-lg font-semibold leading-tight mb-1" style={{ color: "#1a1a1a" }}>
                    {restaurant.name}
                  </h2>
                  <p className="text-xs mb-3 truncate" style={{ color: "#8a8075" }}>
                    📍 {restaurant.address}
                  </p>

                  <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #f0ebe4" }}>
                    <StarDisplay rating={restaurant.rating} />
                    {!restaurant.rating && (
                      <span className="text-xs italic" style={{ color: "#c4b8aa" }}>Non noté</span>
                    )}
                    <span className="text-xs" style={{ color: "#c4b8aa" }}>
                      {new Date(restaurant.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "short",
                      })}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
