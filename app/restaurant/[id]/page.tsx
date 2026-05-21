"use client";

import { useParams, useRouter } from "next/navigation";
import { useRestaurants } from "@/hooks/useRestaurants";
import { StatusBadge } from "@/components/restaurant/StatusBadge";
import { StarRating } from "@/components/restaurant/StarRating";
import { ReviewSection } from "@/components/restaurant/ReviewSection";
import { useState, useEffect } from "react";
import { Restaurant } from "@/lib/types";

export default function RestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { restaurants, update, remove } = useRestaurants();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const found = restaurants.find((r) => r.id === id);
    if (found) setRestaurant(found);
  }, [restaurants, id]);

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-stone-400 animate-pulse">Chargement…</p>
      </div>
    );
  }

  function handleSave() {
    if (!restaurant) return;
    setIsSaving(true);
    update(restaurant.id, {
      rating: restaurant.rating,
      review: restaurant.review,
      status: restaurant.status,
    });
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 400);
  }

  function handleDelete() {
    if (!confirm("Supprimer ce restaurant ?")) return;
    if (!restaurant) return;
    remove(restaurant.id);
    router.push("/");
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setRestaurant((prev) =>
          prev ? { ...prev, photos: [...prev.photos, base64] } : prev
        );
        update(restaurant.id, {
          photos: [...restaurant.photos, base64],
        });
      };
      reader.readAsDataURL(file);
    });
  }

  function handleRemovePhoto(index: number) {
    const newPhotos = restaurant.photos.filter((_, i) => i !== index);
    setRestaurant({ ...restaurant, photos: newPhotos });
    update(restaurant.id, { photos: newPhotos });
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="font-display text-4xl font-semibold text-stone-800 leading-tight">
            {restaurant.name}
          </h1>
          <StatusBadge status={restaurant.status} />
        </div>
        <p className="text-stone-400 text-sm mb-4">
          📍 {restaurant.address}
        </p>
        <span className="inline-block bg-stone-100 text-stone-500 text-xs font-medium px-3 py-1 rounded-full">
          {restaurant.cuisine}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 mb-5">
        <h2 className="font-display text-lg font-semibold text-stone-700 mb-4">Statut</h2>
        <div className="flex gap-3">
          {(["to-visit", "visited"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setRestaurant({ ...restaurant, status: s })}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all
                ${restaurant.status === s
                  ? s === "visited"
                    ? "bg-green-50 border-green-300 text-green-700"
                    : "bg-red-50 border-red-300 text-red-700"
                  : "bg-white border-stone-200 text-stone-400 hover:border-stone-300"
                }`}
            >
              {s === "visited" ? "✅ Déjà visité" : "🔴 À visiter"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 mb-5">
        <h2 className="font-display text-lg font-semibold text-stone-700 mb-4">Ma note</h2>
        <StarRating
          value={restaurant.rating}
          onChange={(r) => setRestaurant({ ...restaurant, rating: r })}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 mb-5">
        <h2 className="font-display text-lg font-semibold text-stone-700 mb-4">Mon avis</h2>
        <ReviewSection
          value={restaurant.review}
          onChange={(r) => setRestaurant({ ...restaurant, review: r })}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 mb-5">
        <h2 className="font-display text-lg font-semibold text-stone-700 mb-4">Photos</h2>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {restaurant.photos.map((photo, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-stone-100">
              <img src={photo} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => handleRemovePhoto(i)}
                className="absolute top-1.5 right-1.5 bg-black/50 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
          <label className="aspect-square rounded-xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center cursor-pointer hover:border-stone-400 hover:bg-stone-50 transition-all">
            <span className="text-2xl mb-1">📷</span>
            <span className="text-xs text-stone-400">Ajouter</span>
            <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 bg-stone-900 text-white py-3.5 rounded-xl font-medium hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {saved ? "✓ Sauvegardé !" : isSaving ? "Sauvegarde…" : "Sauvegarder"}
        </button>
        <button
          onClick={handleDelete}
          className="px-5 py-3.5 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-300 transition-colors font-medium"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
