"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateRestaurantInput, CuisineType, CUISINE_TYPES, RestaurantStatus } from "@/lib/types";
import { useRestaurants } from "@/hooks/useRestaurants";

const PRICE_OPTIONS = [
  { value: "€", sub: "Pas cher" },
  { value: "€€", sub: "Modéré" },
  { value: "€€€", sub: "Cher" },
  { value: "€€€€", sub: "Premium" },
];

export function RestaurantForm() {
  const router = useRouter();
  const { add } = useRestaurants();

  const [form, setForm] = useState<CreateRestaurantInput>({
    name: "",
    address: "",
    cuisine: "Française",
    status: "to-visit",
    photos: [],
    review: "",
  });

  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [noRating, setNoRating] = useState(false);
  const [price, setPrice] = useState<string>("");
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  async function searchAddress(query: string) {
    if (query.length < 3) { setAddressSuggestions([]); return; }
    setIsSearching(true);
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&language=fr&types=poi,address&limit=5`
      );
      const data = await res.json();
      setAddressSuggestions(data.features ?? []);
    } catch { setAddressSuggestions([]); }
    finally { setIsSearching(false); }
  }

  function selectAddress(feature: any) {
    const [lng, lat] = feature.center;
    setForm({ ...form, address: feature.place_name, coordinates: { lat, lng } });
    setAddressSuggestions([]);
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPhotos((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.address.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const created = add({
      ...form,
      rating: noRating ? undefined : rating || undefined,
      photos,
      status: noRating || rating === 0 ? "to-visit" : "visited",
    });
    router.push(`/restaurant/${created.id}`);
  }

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Header fixe */}
      <div className="sticky top-0 z-10 bg-stone-50/90 backdrop-blur-md px-5 pt-5 pb-4 border-b border-stone-200/60">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-500 text-sm hover:bg-stone-50 transition-colors"
          >
            ✕
          </button>
          <h1 className="font-display text-base font-semibold text-stone-800">Nouveau restaurant</h1>
          <button
            onClick={handleSubmit}
            disabled={!form.name || !form.address || isSubmitting}
            className="px-4 py-2 rounded-full bg-stone-900 text-white text-sm font-medium shadow-sm
              disabled:opacity-30 hover:bg-stone-700 transition-colors"
          >
            {isSubmitting ? "…" : "Ajouter"}
          </button>
        </div>
      </div>

      <div className="px-5 py-6 space-y-3 pb-32">

        {/* Bloc nom + adresse */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-stone-100">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">Restaurant</p>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nom du restaurant"
              className="w-full text-lg font-display font-semibold text-stone-800 placeholder-stone-300 bg-transparent outline-none"
            />
          </div>
          <div className="px-4 py-3 relative">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">Adresse</p>
            <div className="flex items-center gap-2">
              <span className="text-stone-300 text-sm">📍</span>
              <input
                type="text"
                value={form.address}
                onChange={(e) => {
                  setForm({ ...form, address: e.target.value, coordinates: undefined });
                  searchAddress(e.target.value);
                }}
                placeholder="Rechercher une adresse…"
                className="flex-1 text-sm text-stone-600 placeholder-stone-300 bg-transparent outline-none"
              />
              {isSearching && <span className="text-xs text-stone-300 animate-pulse">…</span>}
              {form.coordinates && <span className="text-xs text-green-500 font-medium">✓</span>}
            </div>

            {addressSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 bg-white border border-stone-200 rounded-2xl shadow-xl mt-1 mx-0 overflow-hidden">
                {addressSuggestions.map((feature) => (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => selectAddress(feature)}
                    className="w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-0"
                  >
                    <p className="text-sm font-medium text-stone-700 truncate">{feature.text}</p>
                    <p className="text-xs text-stone-400 truncate mt-0.5">{feature.place_name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cuisine */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-4 py-4">
          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Type de cuisine</p>
          <div className="flex flex-wrap gap-2">
            {CUISINE_TYPES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm({ ...form, cuisine: c })}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all
                  ${form.cuisine === c
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-4 py-5">
          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-4">Note</p>
          <div className="flex items-center justify-center gap-4 mb-4">
            {Array.from({ length: 5 }).map((_, i) => {
              const star = i + 1;
              const filled = hoveredRating ? star <= hoveredRating : star <= rating;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setRating(star); setNoRating(false); }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-4xl transition-all hover:scale-110 active:scale-95"
                >
                  <span className={`transition-colors ${filled && !noRating ? "text-amber-400" : "text-stone-200"}`}>★</span>
                </button>
              );
            })}
          </div>
          <p className="text-center text-sm text-stone-400">
            {noRating ? "Sans note" : rating > 0 ? `${rating} étoile${rating > 1 ? "s" : ""}` : "Appuie pour noter"}
          </p>
        </div>

        {/* Sans note */}
        <button
          type="button"
          onClick={() => { setNoRating(!noRating); setRating(0); }}
          className={`w-full bg-white rounded-2xl border shadow-sm px-4 py-4 flex items-center gap-4 transition-all
            ${noRating ? "border-stone-400" : "border-stone-100"}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors
            ${noRating ? "bg-stone-900 text-white" : "bg-stone-100"}`}>
            🔖
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-stone-800">Mémoriser sans noter</p>
            <p className="text-xs text-stone-400 mt-0.5">Je veux juste garder ce spot</p>
          </div>
          <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
            ${noRating ? "border-stone-900 bg-stone-900" : "border-stone-300"}`}>
            {noRating && <span className="text-white text-xs">✓</span>}
          </div>
        </button>

        {/* Photos */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest px-4 pt-4 mb-3">Photos</p>
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-1 px-4 mb-3">
              {photos.map((p, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full text-xs flex items-center justify-center"
                  >✕</button>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 border-t border-stone-100 divide-x divide-stone-100">
            <label className="flex flex-col items-center gap-2 py-5 cursor-pointer hover:bg-stone-50 transition-colors">
              <div className="w-11 h-11 rounded-full bg-stone-100 flex items-center justify-center text-xl">🖼</div>
              <p className="text-sm font-medium text-stone-600">Galerie</p>
              <p className="text-xs text-stone-300">{photos.length}/20</p>
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
            </label>
            <label className="flex flex-col items-center gap-2 py-5 cursor-pointer hover:bg-stone-50 transition-colors">
              <div className="w-11 h-11 rounded-full bg-stone-100 flex items-center justify-center text-xl">📷</div>
              <p className="text-sm font-medium text-stone-600">Caméra</p>
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Prix */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-4 py-4">
          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Prix moyen</p>
          <div className="grid grid-cols-4 gap-2">
            {PRICE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPrice(price === opt.value ? "" : opt.value)}
                className={`flex flex-col items-center py-3 rounded-xl border transition-all
                  ${price === opt.value
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 text-stone-500 hover:border-stone-300 bg-white"
                  }`}
              >
                <span className="text-sm font-semibold">{opt.value}</span>
                <span className="text-[10px] mt-0.5 opacity-60">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Avis */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-4 py-4">
          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Ton avis</p>
          <textarea
            value={form.review}
            onChange={(e) => setForm({ ...form, review: e.target.value })}
            placeholder="Qu'est-ce qui t'a plu ? Qu'est-ce qui le rend spécial ?"
            rows={4}
            maxLength={1000}
            className="w-full text-sm text-stone-700 placeholder-stone-300 bg-transparent outline-none resize-none leading-relaxed"
          />
          <p className="text-xs text-stone-300 text-right">{(form.review ?? "").length}/1000</p>
        </div>

      </div>
    </div>
  );
}
