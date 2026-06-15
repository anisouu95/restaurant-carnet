"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateRestaurantInput, CuisineType, CUISINE_TYPES } from "@/lib/types";
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
    <div style={{ backgroundColor: "#f5f0eb", minHeight: "100vh" }} className="pb-16">
      <div className="px-10 py-10 w-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#C4A882" }}>
              Mon carnet
            </p>
            <h1 className="font-display text-4xl font-bold" style={{ color: "#1a1a1a" }}>
              NOUVEAU RESTAURANT
            </h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!form.name || !form.address || isSubmitting}
            className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-30"
            style={{ backgroundColor: "#1a1a1a", color: "#f5f0eb" }}
          >
            {isSubmitting ? "…" : "Ajouter"}
          </button>
        </div>

        {/* Grid 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">

          {/* Colonne gauche */}
          <div className="space-y-4">

            {/* Nom + Adresse */}
            <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8e0d5" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#C4A882" }}>
                Informations
              </p>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nom du restaurant"
                className="w-full text-2xl font-display font-bold bg-transparent outline-none mb-4 pb-3"
                style={{ color: "#1a1a1a", borderBottom: "1px solid #e8e0d5" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <span style={{ color: "#C4A882" }}>📍</span>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => {
                      setForm({ ...form, address: e.target.value, coordinates: undefined });
                      searchAddress(e.target.value);
                    }}
                    placeholder="Rechercher une adresse…"
                    className="flex-1 text-sm bg-transparent outline-none"
                    style={{ color: "#8a8075" }}
                  />
                  {isSearching && <span className="text-xs animate-pulse" style={{ color: "#C4A882" }}>…</span>}
                  {form.coordinates && <span className="text-xs font-medium" style={{ color: "#C4A882" }}>✓</span>}
                </div>
                {addressSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-50 rounded-xl shadow-xl mt-2 overflow-hidden"
                    style={{ backgroundColor: "#ffffff", border: "1px solid #e8e0d5" }}>
                    {addressSuggestions.map((feature) => (
                      <button
                        key={feature.id}
                        type="button"
                        onClick={() => selectAddress(feature)}
                        className="w-full text-left px-4 py-3 transition-colors hover:bg-stone-50"
                        style={{ borderBottom: "1px solid #e8e0d5", color: "#1a1a1a" }}
                      >
                        <p className="text-sm font-medium truncate">{feature.text}</p>
                        <p className="text-xs truncate mt-0.5" style={{ color: "#8a8075" }}>{feature.place_name}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Type de cuisine */}
            <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8e0d5" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#C4A882" }}>
                Type de cuisine
              </p>
              <div className="flex flex-wrap gap-2">
                {CUISINE_TYPES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, cuisine: c })}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: form.cuisine === c ? "#1a1a1a" : "transparent",
                      color: form.cuisine === c ? "#f5f0eb" : "#8a8075",
                      border: `1px solid ${form.cuisine === c ? "#1a1a1a" : "#e8e0d5"}`,
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Prix */}
            <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8e0d5" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#C4A882" }}>
                Prix moyen
              </p>
              <div className="grid grid-cols-4 gap-2">
                {PRICE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPrice(price === opt.value ? "" : opt.value)}
                    className="flex flex-col items-center py-3 rounded-xl transition-all"
                    style={{
                      backgroundColor: price === opt.value ? "#1a1a1a" : "transparent",
                      color: price === opt.value ? "#f5f0eb" : "#8a8075",
                      border: `1px solid ${price === opt.value ? "#1a1a1a" : "#e8e0d5"}`,
                    }}
                  >
                    <span className="text-sm font-bold">{opt.value}</span>
                    <span className="text-xs mt-0.5 opacity-70">{opt.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-4">

            {/* Note */}
            <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8e0d5" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#C4A882" }}>
                Note
              </p>
              <div className="flex items-center gap-3 mb-4">
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
                      className="text-4xl transition-all hover:scale-110"
                    >
                      <span style={{ color: filled && !noRating ? "#C4A882" : "#e8e0d5" }}>★</span>
                    </button>
                  );
                })}
                <span className="text-sm ml-2" style={{ color: "#8a8075" }}>
                  {noRating ? "Sans note" : rating > 0 ? `${rating}/5` : "Clique pour noter"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => { setNoRating(!noRating); setRating(0); }}
                className="flex items-center gap-3 w-full p-3 rounded-xl transition-all"
                style={{
                  backgroundColor: noRating ? "#f5f0eb" : "transparent",
                  border: `1px solid ${noRating ? "#C4A882" : "#e8e0d5"}`,
                }}
              >
                <span>🔖</span>
                <div className="text-left">
                  <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>Mémoriser sans noter</p>
                  <p className="text-xs" style={{ color: "#8a8075" }}>Je veux juste garder ce spot</p>
                </div>
              </button>
            </div>

            {/* Avis */}
            <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e8e0d5" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#C4A882" }}>
                Ton avis
              </p>
              <textarea
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
                placeholder="Qu'est-ce qui t'a plu ? Qu'est-ce qui le rend spécial ?"
                rows={5}
                maxLength={1000}
                className="w-full text-sm bg-transparent outline-none resize-none leading-relaxed"
                style={{ color: "#1a1a1a" }}
              />
              <p className="text-xs text-right mt-2" style={{ color: "#c4b8aa" }}>
                {(form.review ?? "").length}/1000
              </p>
            </div>

            {/* Photos */}
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #e8e0d5" }}>
              <div className="p-6 pb-4">
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#C4A882" }}>
                  Photos
                </p>
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {photos.map((p, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                        <img src={p} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center"
                          style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#fff" }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 divide-x" style={{ borderTop: "1px solid #e8e0d5" }}>
                <label className="flex flex-col items-center gap-2 py-5 cursor-pointer hover:bg-stone-50 transition-colors">
                  <span className="text-2xl">🖼</span>
                  <span className="text-sm font-medium" style={{ color: "#8a8075" }}>Galerie</span>
                  <span className="text-xs" style={{ color: "#c4b8aa" }}>{photos.length}/20</span>
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                </label>
                <label className="flex flex-col items-center gap-2 py-5 cursor-pointer hover:bg-stone-50 transition-colors">
                  <span className="text-2xl">📷</span>
                  <span className="text-sm font-medium" style={{ color: "#8a8075" }}>Caméra</span>
                  <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
