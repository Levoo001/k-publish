"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
      if (!u && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
    });
    return unsub;
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-7 h-7 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Login page renders without the admin shell
  if (pathname === "/admin/login") return <>{children}</>;

  // Not authenticated — render nothing (redirect is in flight)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <p className="font-playfair text-primary text-base font-semibold tracking-wide">
          Kavan Admin
        </p>
        <button
          onClick={() => signOut(auth).then(() => router.replace("/admin/login"))}
          className="text-xs font-poppins text-slate-400 hover:text-red-500 transition-colors"
        >
          Sign out
        </button>
      </header>
      {children}
    </div>
  );
}
