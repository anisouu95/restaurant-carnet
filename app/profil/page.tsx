"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CUISINE_TYPES } from "@/lib/types";

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Champs éditables
  const [bioFlash, setBioFlash] = useState("");
  const [topCuisines, setTopCuisines] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ultimateTest, setUltimateTest] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/"); return; }
      setUser(session.user);
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(data);
      setBioFlash(data?.bio_flash || "");
      setTopCuisines(data?.top_cuisines || []);
      setIngredients(data?.signature_ingredients || []);
      setUltimateTest(data?.ultimate_test || "");
      setIsLoading(false);
    });
  }, []);

  function toggleCuisine(c: string) {
    if (topCuisines.includes(c)) {
      setTopCuisines(topCuisines.filter((x) => x !== c));
    } else if (topCuisines.length < 3) {
      setTopCuisines([...topCuisines, c]);
    }
  }

  function addIngredient() {
    const val = ingredientInput.trim();
    if (val && !ingredients.includes(val)) {
      setIngredients([...ingredients, val]);
    }
    setIngredientInput("");
  }

  function removeIngredient(tag: string) {
    setIngredients(ingredients.filter((t) => t !== tag));
  }

  async function handleSave() {
    setIsSaving(true);
    await supabase.from("profiles").update({
      bio_flash: bioFlash,
      top_cuisines: topCuisines,
      signature_ingredients: ingredients,
      ultimate_test: ultimateTest,
    }).eq("id", user.id);

    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(data);
    setIsSaving(false);
    setIsEditing(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f0eb" }}>
        <p className="animate-pulse text-sm" style={{ color: "#8a8075" }}>Chargement…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-10 py-8 pb-16" style={{ backgroundColor: "#f5f0eb" }}>
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#C4A882" }}>Mon compte</p>
            <h1 className="font-display text-2xl sm:text-4xl font-bold" style={{ color: "#1a1a1a" }}>PROFIL</h1>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              style={{ backgroundColor: "#1a1a1a", color: "#f5f0eb" }}
            >
              Éditer
            </button>
          )}
        </div>

        {/* Avatar + nom */}
        <div className="rounded-2xl p-6 mb-4 flex items-center gap-5"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e8e0d5" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{ backgroundColor: "#C4A882", color: "#1a1a1a" }}>
            {(profile?.full_name || user?.email)?.[0].toUpperCase()}
          </div>
          <div>
            <p className="font-display text-xl font-semibold" style={{ color: "#1a1a1a" }}>
              {profile?.full_name || user?.email?.split("@")[0]}
            </p>
            <p className="text-sm" style={{ color: "#8a8075" }}>{user?.email}</p>
          </div>
        </div>

        {/* Carte de visite gourmande */}
        <div className="rounded-2xl p-6 mb-4" style={{ backgroundColor: "#ffffff", border: "1px solid #e8e0d5" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#C4A882" }}>
            Carte de visite gourmande
          </p>

          {/* Bio Flash */}
          <div className="mb-5">
            <p className="text-xs font-medium mb-2" style={{ color: "#8a8075" }}>Bio flash</p>
            {isEditing ? (
              <input
                type="text"
                value={bioFlash}
                onChange={(e) => setBioFlash(e.target.value.slice(0, 80))}
                placeholder="Ex : Toujours en quête du meilleur ramen de Paris"
                maxLength={80}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ backgroundColor: "#f5f0eb", border: "1px solid #e8e0d5", color: "#1a1a1a" }}
              />
            ) : (
              <p className="text-sm font-medium italic" style={{ color: "#1a1a1a" }}>
                {bioFlash || "Aucune bio renseignée"}
              </p>
            )}
          </div>

          {/* Top 3 Cuisines */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium" style={{ color: "#8a8075" }}>Top 3 des cuisines</p>
              {isEditing && (
                <p className="text-xs" style={{ color: "#C4A882" }}>{topCuisines.length}/3</p>
              )}
            </div>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {CUISINE_TYPES.map((c) => {
                  const selected = topCuisines.includes(c);
                  const rank = topCuisines.indexOf(c) + 1;
                  const disabled = !selected && topCuisines.length >= 3;
                  return (
                    <button
                      key={c}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleCuisine(c)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
                      style={{
                        backgroundColor: selected ? "#1a1a1a" : "transparent",
                        color: selected ? "#f5f0eb" : disabled ? "#d4cdc2" : "#8a8075",
                        border: `1px solid ${selected ? "#1a1a1a" : "#e8e0d5"}`,
                        opacity: disabled ? 0.5 : 1,
                      }}
                    >
                      {selected && <span style={{ color: "#C4A882" }}>#{rank}</span>}
                      {c}
                    </button>
                  );
                })}
              </div>
            ) : topCuisines.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {topCuisines.map((c, i) => (
                  <span
                    key={c}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5"
                    style={{ backgroundColor: "#1a1a1a", color: "#f5f0eb" }}
                  >
                    <span style={{ color: "#C4A882" }}>#{i + 1}</span>
                    {c}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#8a8075" }}>Aucune cuisine sélectionnée</p>
            )}
          </div>

          {/* Ingrédients fétiches */}
          <div className="mb-5">
            <p className="text-xs font-medium mb-2" style={{ color: "#8a8075" }}>Ingrédients fétiches</p>
            {isEditing && (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addIngredient(); } }}
                  placeholder="Ex : Truffe"
                  className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: "#f5f0eb", border: "1px solid #e8e0d5", color: "#1a1a1a" }}
                />
                <button
                  type="button"
                  onClick={addIngredient}
                  className="px-4 rounded-xl text-sm font-bold"
                  style={{ backgroundColor: "#1a1a1a", color: "#f5f0eb" }}
                >
                  +
                </button>
              </div>
            )}
            {ingredients.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"
                    style={{ backgroundColor: "#faf6f0", color: "#C4A882", border: "1px solid #C4A882" }}
                  >
                    {tag}
                    {isEditing && (
                      <button onClick={() => removeIngredient(tag)} className="text-xs">✕</button>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#8a8075" }}>Aucun ingrédient renseigné</p>
            )}
          </div>

          {/* Test Ultime */}
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: "#8a8075" }}>Le test ultime 🍮</p>
            {isEditing ? (
              <input
                type="text"
                value={ultimateTest}
                onChange={(e) => setUltimateTest(e.target.value)}
                placeholder="Ex : Le tiramisu"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ backgroundColor: "#f5f0eb", border: "1px solid #e8e0d5", color: "#1a1a1a" }}
              />
            ) : (
              <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                {ultimateTest || "Aucun plat témoin renseigné"}
              </p>
            )}
          </div>
        </div>

        {/* Boutons édition */}
        {isEditing && (
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: "#ffffff", color: "#8a8075", border: "1px solid #e8e0d5" }}
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: "#1a1a1a", color: "#f5f0eb" }}
            >
              {isSaving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        )}

        {/* Déconnexion */}
        {!isEditing && (
          <button
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl text-sm font-semibold transition-all"
            style={{ backgroundColor: "#ffffff", color: "#c0392b", border: "1px solid #ffd5d5" }}
          >
            Se déconnecter
          </button>
        )}

      </div>
    </div>
  );
}
