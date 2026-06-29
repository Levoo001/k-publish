"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

const PAGE_SIZE = 10;

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => { fetchSubscribers(); }, []);
  useEffect(() => { setPage(1); }, [search]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  const goToPage = (n) => setPage(n);

  const fetchSubscribers = async () => {
    setError(null);
    setLoading(true);
    try {
      const q = query(collection(db, "newsletterSubscribers"), orderBy("subscribedAt", "desc"));
      const snap = await getDocs(q);
      setSubscribers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      setError(
        err.code === "permission-denied"
          ? "Permission denied — check your Firestore security rules."
          : `Failed to load: ${err.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const fmtDate = (ts) =>
    (ts?.toDate?.() ?? (ts ? new Date(ts) : null))?.toLocaleDateString("en-NG", {
      day: "numeric", month: "short", year: "numeric",
    }) ?? "—";

  const copyEmail = (sub) => {
    navigator.clipboard.writeText(sub.email).then(() => {
      setCopiedId(sub.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filtered = subscribers.filter(
    (s) =>
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 font-poppins text-sm">Loading subscribers…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Page header */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-poppins mb-1">Newsletter</p>
              <h1 className="text-2xl font-playfair text-slate-900 leading-tight">Subscribers</h1>
            </div>
            <div className="text-right">
              <p className="text-3xl font-playfair text-primary leading-none">{subscribers.length}</p>
              <p className="text-[11px] text-slate-400 font-poppins mt-0.5">total</p>
            </div>
          </div>

          {/* Full-width search */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full pl-11 pr-4 py-3 text-sm placeholder:text-sm font-poppins border border-slate-200 rounded-xl outline-none focus:border-primary/50 placeholder:text-slate-300 transition-colors bg-slate-50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {search && (
            <p className="text-xs text-slate-400 font-poppins mt-2">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="font-poppins font-medium text-red-800 text-sm">{error}</p>
            <button onClick={fetchSubscribers} className="mt-1.5 text-xs font-poppins text-red-600 underline">
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!error && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
            <p className="text-slate-300 text-4xl mb-3">✉</p>
            <p className="font-poppins text-slate-500 text-sm font-medium">
              {search ? "No subscribers match your search." : "No subscribers yet."}
            </p>
            {search && (
              <button onClick={() => setSearch("")} className="mt-2 text-xs text-primary font-poppins underline">
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Desktop table */}
        {paginated.length > 0 && (
          <>
            <div className="hidden md:block bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-400 font-poppins uppercase tracking-widest">Name</th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-400 font-poppins uppercase tracking-widest">Email</th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-400 font-poppins uppercase tracking-widest">Birthday</th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-400 font-poppins uppercase tracking-widest">Joined</th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginated.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-5 py-4 text-sm font-poppins text-slate-800 font-medium">
                        {sub.name || <span className="text-slate-300 font-normal">—</span>}
                      </td>
                      <td className="px-5 py-4 text-sm font-poppins text-slate-600">
                        {sub.email}
                      </td>
                      <td className="px-5 py-4 text-sm font-poppins text-slate-500">
                        {sub.birthday || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-5 py-4 text-xs font-poppins text-slate-400">
                        {fmtDate(sub.subscribedAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                          <a
                            href={`mailto:${sub.email}`}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors"
                            title="Send email"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </a>
                          <button
                            onClick={() => copyEmail(sub)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors"
                            title="Copy email"
                          >
                            {copiedId === sub.id ? (
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-2">
              {paginated.map((sub) => (
                <div key={sub.id} className="bg-white rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      {sub.name && (
                        <p className="text-sm font-semibold text-slate-800 font-poppins truncate mb-0.5">
                          {sub.name}
                        </p>
                      )}
                      <p className="text-sm text-slate-600 font-poppins truncate">{sub.email}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                      <a
                        href={`mailto:${sub.email}`}
                        className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-primary transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>
                      <button
                        onClick={() => copyEmail(sub)}
                        className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-primary transition-colors"
                      >
                        {copiedId === sub.id ? (
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-slate-50">
                    {sub.birthday && (
                      <span className="text-xs text-slate-400 font-poppins">🎂 {sub.birthday}</span>
                    )}
                    <span className="text-xs text-slate-300 font-poppins ml-auto">{fmtDate(sub.subscribedAt)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 pb-4 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-poppins text-slate-500 hover:border-primary/40 hover:text-primary disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Prev
                  </button>

                  <div className="flex items-center gap-1 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                      .reduce((acc, n, i, arr) => {
                        if (i > 0 && n - arr[i - 1] > 1) acc.push("…");
                        acc.push(n);
                        return acc;
                      }, [])
                      .map((item, i) =>
                        item === "…" ? (
                          <span key={`ellipsis-${i}`} className="w-8 text-center text-sm text-slate-300 font-poppins select-none">
                            ···
                          </span>
                        ) : (
                          <button
                            key={item}
                            onClick={() => goToPage(item)}
                            className={`w-9 h-9 rounded-xl text-sm font-poppins transition-colors ${
                              page === item
                                ? "bg-primary text-white shadow-sm"
                                : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            }`}
                          >
                            {item}
                          </button>
                        )
                      )}
                  </div>

                  <button
                    onClick={() => goToPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-poppins text-slate-500 hover:border-primary/40 hover:text-primary disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <p className="text-xs font-poppins text-slate-300">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} subscribers
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
