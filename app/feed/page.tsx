"use client";

import { useRestaurants } from "@/hooks/useRestaurants";
import { StatusBadge } from "@/components/restaurant/StatusBadge";
import Link from "next/link";

function StarDisplay({ rating }: { rating?: number }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-base ${i < rating ? "text-amber-400" : "text-stone-200"}`}>★</span>
      ))}
    </div>
  );
}

export default function FeedPage() {
  const { restaurants, isLoading } = useRestaurants();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-stone-400 animate-pulse">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-1">Mon carnet</p>
        <h1 className="font-display text-4xl font-bold text-stone-900 leading-tight">FEED</h1>
      </div>

      {restaurants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-6xl mb-6">🍽</span>
          <h2 className="font-display text-2xl font-semibold text-stone-700 mb-3">Aucun restaurant</h2>
          <p className="text-stone-400 mb-8">Appuie sur le + pour ajouter ton premier resto.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {restaurants.map((restaurant) => (
            <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
              <article className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-shadow mb-5">
                <div className="relative h-52 bg-gradient-to-br from-stone-100 to-stone-200">
                  {restaurant.photos.length > 0 ? (
                    <img src={restaurant.photos[0]} alt={restaurant.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl opacity-20">🍽</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={restaurant.status} size="sm" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-stone-400 uppercase tracking-widest">{restaurant.cuisine}</span>
                    <span className="text-xs text-stone-300">
                      {new Date(restaurant.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-stone-900 mb-1 leading-tight">{restaurant.name}</h2>
                  <p className="text-sm text-stone-400 mb-4">📍 {restaurant.address}</p>
                  {restaurant.rating && <div className="mb-3"><StarDisplay rating={restaurant.rating} /></div>}
                  {restaurant.review && (
                    <p className="text-sm text-stone-600 leading-relaxed line-clamp-3 border-t border-stone-100 pt-4">
                      {restaurant.review}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
