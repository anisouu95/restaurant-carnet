"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [bioFlash, setBioFlash] = useState("");
  const [cuisineInput, setCuisineInput] = useState("");
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
      setAvatarUrl(data?.avatar_url || null);
      setIsLoading(false);
    });
  }, []);

  function addCuisine() {
    const val = cuisineInput.trim();
    if (val && !topCuisines.includes(val) && topCuisines.length < 3) {
      setTopCuisines([...topCuisines, val]);
    }
    setCuisineInput("");
  }

  function removeCuisine(c: string) {
    setTopCuisines(topCuisines.filter((x) => x !== c));
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

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const newUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      await supabase.from("profiles").update({ avatar_url: newUrl }).eq("id", user.id);
      setAvatarUrl(newUrl);
    }
    setIsUploading(false);
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

        <div className="rounded-2xl p-6 mb-4 flex items-center gap-5"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e8e0d5" }}>
          <label className="relative w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 overflow-hidden cursor-pointer"
            style={{ backgroundColor: "#C4A882", color: "#1a1a1a" }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (profile?.full_name || user?.email)?.[0].toUpperCase()
            )}
            <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              {isUploading ? "…" : "Modifier"}
            </div>
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={isUploading} />
          </label>
          <div>
            <p className="font-display text-xl font-semibold" style={{ color: "#1a1a1a" }}>
              {profile?.full_name || user?.email?.split("@")[0]}
            </p>
            <p className="text-sm" style={{ color: "#8a8075" }}>{user?.email}</p>
          </div>
        </div>

        <div className="rounded-2xl p-6 mb-4" style={{ backgroundColor: "#ffffff", border: "1px solid #e8e0d5" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#C4A882" }}>
            Carte de visite gourmande
          </p>

          <div className="mb-5">
            <p className="text-xs font-medium mb-2" style={{ color: "#8a8075" }}>Bio</p>
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

          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium" style={{ color: "#8a8075" }}>Top 3 des cuisines</p>
              {isEditing && (
                <p className="text-xs" style={{ color: "#C4A882" }}>{topCuisines.length}/3</p>
              )}
            </div>
            {isEditing && topCuisines.length < 3 && (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={cuisineInput}
                  onChange={(e) => setCuisineInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCuisine(); } }}
                  placeholder="Ex : Péruvienne"
                  className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: "#f5f0eb", border: "1px solid #e8e0d5", color: "#1a1a1a" }}
                />
                <button
                  type="button"
                  onClick={addCuisine}
                  className="px-4 rounded-xl text-sm font-bold"
                  style={{ backgroundColor: "#1a1a1a", color: "#f5f0eb" }}
                >
                  +
                </button>
              </div>
            )}
            {topCuisines.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {topCuisines.map((c, i) => (
                  <span
                    key={c}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5"
                    style={{ backgroundColor: "#1a1a1a", color: "#f5f0eb" }}
                  >
                    <span style={{ color: "#C4A882" }}>#{i + 1}</span>
                    {c}
                    {isEditing && (
                      <button onClick={() => removeCuisine(c)} className="text-xs ml-1">✕</button>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#8a8075" }}>Aucune cuisine sélectionnée</p>
            )}
          </div>

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

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <p className="text-xs font-medium" style={{ color: "#8a8075" }}>Le test ultime 🍮</p>
            </div>
            {isEditing && (
              <p className="text-xs mb-2 leading-relaxed" style={{ color: "#a89c8c" }}>
                Le plat témoin que tu commandes toujours pour juger un restaurant — celui qui te permet de savoir s'il vaut le coup en une bouchée.
              </p>
            )}
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
