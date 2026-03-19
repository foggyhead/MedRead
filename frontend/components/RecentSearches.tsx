"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Stethoscope, Clock } from "lucide-react";
import { getRecentSearches, clearRecentSearches, RecentSearch } from "@/lib/api";

export default function RecentSearches() {
  const [searches, setSearches] = useState<RecentSearch[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSearches(getRecentSearches());
    setMounted(true);
  }, []);

  if (!mounted || searches.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
      <div className="rounded-2xl px-5 py-4" style={{ background: "#071a14", border: "1px solid #163d32" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" style={{ color: "#6b9e8f" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b9e8f" }}>
              Recently Searched
            </span>
          </div>
          <button
            onClick={() => { clearRecentSearches(); setSearches([]); }}
            className="text-xs transition-colors"
            style={{ color: "#2a5a48" }}
          >
            Clear
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {searches.map((s) => (
            <Link
              key={s.id}
              href={`/scan?mode=${s.type}&q=${encodeURIComponent(s.query)}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all hover:opacity-80"
              style={{ background: "#0c2620", border: "1px solid #163d32", color: "#ecfdf5" }}
            >
              {s.type === "symptoms"
                ? <Stethoscope className="w-3 h-3 flex-shrink-0" style={{ color: "#22d3ee" }} />
                : <Search className="w-3 h-3 flex-shrink-0" style={{ color: "#34d399" }} />}
              <span className="truncate max-w-[160px]">{s.query}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
