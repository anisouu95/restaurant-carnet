"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Email ou mot de passe incorrect.");
      else onClose();
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError("Erreur lors de la création du compte.");
      } else {
        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            full_name: name,
            
          });
        }
        onClose();
      }
    }
    setIsLoading(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 relative"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e8e0d5",
          boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4" aria-label="Fermer">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#8a8075" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6 text-center">
          <span className="font-display text-2xl font-bold" style={{ color: "#1a1a1a" }}>DISHLIST</span>
          <p className="text-sm mt-1" style={{ color: "#8a8075" }}>
            {mode === "login" ? "Content de te revoir 👋" : "Rejoins l'aventure 🍽"}
          </p>
        </div>

        <div className="flex rounded-xl p-1 mb-6" style={{ backgroundColor: "#f5f0eb" }}>
          <button
            onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: mode === "login" ? "#1a1a1a" : "transparent",
              color: mode === "login" ? "#ffffff" : "#8a8075",
            }}
          >
            Connexion
          </button>
          <button
            onClick={() => { setMode("register"); setError(null); setSuccess(null); }}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: mode === "register" ? "#1a1a1a" : "transparent",
              color: mode === "register" ? "#ffffff" : "#8a8075",
            }}
          >
            Créer un compte
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "#fff0f0", color: "#c0392b", border: "1px solid #ffd5d5" }}>
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {mode === "register" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8a8075" }}>Prénom</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ton prénom"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: "#f5f0eb", border: "1px solid #e8e0d5", color: "#1a1a1a" }}
                />
              </div>

            </>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8a8075" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="toi@email.com"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: "#f5f0eb", border: "1px solid #e8e0d5", color: "#1a1a1a" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8a8075" }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: "#f5f0eb", border: "1px solid #e8e0d5", color: "#1a1a1a" }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !email || !password}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all mt-2"
            style={{
              backgroundColor: !email || !password ? "#e8e0d5" : "#1a1a1a",
              color: !email || !password ? "#8a8075" : "#ffffff",
              cursor: !email || !password ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Chargement…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>

          {mode === "login" && (
            <div className="text-center">
              <a href="#" className="text-xs" style={{ color: "#C4A882" }}>Mot de passe oublié ?</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
