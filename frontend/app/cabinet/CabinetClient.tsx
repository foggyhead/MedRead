"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ChevronDown, ChevronUp, Pill, ArrowRight } from "lucide-react";
import { getCabinet, deleteFromCabinet, SavedMedicine } from "@/lib/api";
import ResultCard from "@/components/ResultCard";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function EmptyState() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: "#0c2620", border: "1px solid #163d32" }}>
        <Pill className="w-10 h-10" style={{ color: "#163d32" }} />
      </div>
      <h2 className="text-2xl font-medium mb-2" style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
        Your cabinet is empty
      </h2>
      <p className="max-w-xs mb-8 leading-relaxed text-sm" style={{ color: "#6b9e8f" }}>
        Scan a medicine and tap &ldquo;Save to Cabinet&rdquo; to keep a quick reference here.
      </p>
      <Link href="/scan"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-[#030d0a] transition-all group"
        style={{ background: "linear-gradient(135deg, #34d399, #22d3ee)", boxShadow: "0 0 28px rgba(52,211,153,0.2)" }}>
        Scan your first medicine
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}

export default function CabinetClient() {
  const [medicines, setMedicines] = useState<SavedMedicine[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMedicines(getCabinet()); setMounted(true); }, []);

  const handleDelete = (id: string) => {
    deleteFromCabinet(id); setMedicines((prev) => prev.filter((m) => m.id !== id));
    if (expanded === id) setExpanded(null);
  };

  if (!mounted) return null;
  if (medicines.length === 0) return <EmptyState />;

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: "#6b9e8f" }}>
        {medicines.length} {medicines.length === 1 ? "medicine" : "medicines"} saved
      </p>
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {medicines.map((med) => (
            <motion.div key={med.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }} className="rounded-2xl overflow-hidden hover-glow"
              style={{ background: "#0c2620", border: "1px solid #163d32" }}>
              <div className="px-6 py-4 flex items-start justify-between gap-4">
                <button onClick={() => setExpanded(expanded === med.id ? null : med.id)}
                  className="flex-1 text-left min-w-0">
                  <h3 className="text-lg font-semibold truncate"
                    style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                    {med.medicine_name}
                  </h3>
                  <p className="text-sm mt-0.5 line-clamp-1" style={{ color: "#6b9e8f" }}>{med.short_description}</p>
                  <p className="text-xs mt-1" style={{ color: "#2a5a48" }}>{timeAgo(med.saved_at)}</p>
                </button>
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  <button onClick={() => handleDelete(med.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ color: "#2a5a48" }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setExpanded(expanded === med.id ? null : med.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ color: "#6b9e8f" }}>
                    {expanded === med.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {expanded === med.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} style={{ borderTop: "1px solid #163d32" }}>
                    <div className="p-4"><ResultCard result={med.result} /></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
