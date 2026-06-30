"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin/orders");
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential" || err.code === "auth/wrong-password"
          ? "Incorrect email or password."
          : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-playfair text-3xl text-primary font-light tracking-widest mb-1">
            KAVAN
          </p>
          <p className="text-xs text-slate-400 font-poppins uppercase tracking-widest">
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-slate-400 font-poppins mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kavanthebrand.com"
              className="w-full text-base md:text-sm font-poppins border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary/60 placeholder:text-xs placeholder:text-slate-300 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-slate-400 font-poppins mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-base md:text-sm font-poppins border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary/60 placeholder:text-xs placeholder:text-slate-300 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 font-poppins text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl text-sm font-semibold font-poppins hover:bg-primary/90 disabled:opacity-50 transition-colors mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
