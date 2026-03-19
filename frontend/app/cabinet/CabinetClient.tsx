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
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-24 h-24 rounded-3xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mb-6">
        <Pill className="w-10 h-10 text-[#3a3a3a]" />
      </div>
      <h2
        className="text-2xl font-medium text-[#f0f0f0] mb-2"
        style={{ fontFamily: "Fraunces, serif" }}
      >
        Your cabinet is empty
      </h2>
      <p className="text-[#888888] max-w-xs mb-8 leading-relaxed">
        Scan a medicine and tap &ldquo;Save to Cabinet&rdquo; to keep a quick reference here.
      </p>
      <Link
        href="/scan"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7c6af7] text-white font-medium hover:bg-[#6b5de6] transition-all group"
      >
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

  useEffect(() => {
    setMedicines(getCabinet());
    setMounted(true);
  }, []);

  const handleDelete = (id: string) => {
    deleteFromCabinet(id);
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  if (!mounted) return null;

  if (medicines.length === 0) return <EmptyState />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#888888]">
        {medicines.length} {medicines.length === 1 ? "medicine" : "medicines"} saved
      </p>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {medicines.map((med) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden hover-glow"
            >
              {/* Card header */}
              <div className="px-6 py-4 flex items-start justify-between gap-4">
                <button
                  onClick={() => toggleExpand(med.id)}
                  className="flex-1 text-left min-w-0"
                >
                  <h3
                    className="text-lg font-semibold text-[#f0f0f0] truncate"
                    style={{ fontFamily: "Fraunces, serif" }}
                  >
                    {med.medicine_name}
                  </h3>
                  <p className="text-sm text-[#888888] mt-0.5 line-clamp-1">
                    {med.short_description}
                  </p>
                  <p className="text-xs text-[#555] mt-1">{timeAgo(med.saved_at)}</p>
                </button>

                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555] hover:text-[#f87171] hover:bg-[#f87171]/10 transition-all"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleExpand(med.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555] hover:text-[#f0f0f0] hover:bg-[#2a2a2a] transition-all"
                    aria-label={expanded === med.id ? "Collapse" : "Expand"}
                  >
                    {expanded === med.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded result */}
              <AnimatePresence>
                {expanded === med.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-[#2a2a2a]"
                  >
                    <div className="p-4">
                      <ResultCard result={med.result} />
                    </div>
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
