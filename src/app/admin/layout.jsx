"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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

  const navLinks = [
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/subscribers", label: "Subscribers" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Brand */}
          <p className="font-playfair text-primary text-base tracking-widest font-light flex-shrink-0">
            KAVAN
          </p>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-poppins transition-colors ${
                    active
                      ? "bg-primary/8 text-primary font-semibold"
                      : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sign out */}
          <button
            onClick={() => signOut(auth).then(() => router.replace("/admin/login"))}
            className="flex items-center gap-1.5 text-xs font-poppins text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>

        </div>
      </header>
      {children}
    </div>
  );
}
