"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/"); return; }
      setUser(session.user);
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(data);
      setIsLoading(false);
    });
  }, []);

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
    <div className="min-h-screen px-4 sm:px-10 py-8" style={{ backgroundColor: "#f5f0eb" }}>
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#C4A882" }}>Mon compte</p>
          <h1 className="font-display text-2xl sm:text-4xl font-bold" style={{ color: "#1a1a1a" }}>PROFIL</h1>
        </div>

        {/* Avatar + infos */}
        <div className="rounded-2xl p-6 mb-4 flex items-center gap-5"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e8e0d5" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{ backgroundColor: "#C4A882", color: "#1a1a1a" }}>
            {user?.email?.[0].toUpperCase()}
          </div>
          <div>
            <p className="font-display text-xl font-semibold" style={{ color: "#1a1a1a" }}>
              {profile?.full_name || user?.email?.split("@")[0]}
            </p>
            <p className="text-sm" style={{ color: "#8a8075" }}>{user?.email}</p>
          </div>
        </div>

        {/* Infos profil */}
        <div className="rounded-2xl p-6 mb-4"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e8e0d5" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#C4A882" }}>
            Informations
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs" style={{ color: "#8a8075" }}>Prénom</p>
              <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>
                {profile?.full_name || "Non renseigné"}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: "#8a8075" }}>Bio</p>
              <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>
                {profile?.bio || "Non renseignée"}
              </p>
            </div>
          </div>
        </div>

        {/* Bouton déconnexion */}
        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl text-sm font-semibold transition-all mt-4"
          style={{ backgroundColor: "#ffffff", color: "#c0392b", border: "1px solid #ffd5d5" }}
        >
          Se déconnecter
        </button>

      </div>
    </div>
  );
}
