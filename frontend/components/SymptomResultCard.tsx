"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, ShoppingCart, CheckCircle2, Zap, Users, ExternalLink } from "lucide-react";
import { SymptomResult, SymptomMedicine } from "@/lib/api";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

function DoctorWarning({ note }: { note: string | null }) {
  return (
    <motion.div variants={item}
      className="flex items-start gap-3 px-4 py-4 rounded-xl text-sm leading-relaxed"
      style={{ background: "rgba(248,113,113,0.1)", border: "2px solid rgba(248,113,113,0.4)", color: "#f87171" }}>
      <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold mb-1">See a doctor for these symptoms</p>
        <p style={{ color: "#fca5a5" }}>
          {note || "Your symptoms may need professional medical attention. Please consult a doctor before taking any medicine."}
        </p>
      </div>
    </motion.div>
  );
}

function MedicineCard({ med, rank }: { med: SymptomMedicine; rank: number }) {
  return (
    <motion.div variants={item}
      className="rounded-2xl overflow-hidden"
      style={{ background: "#0c2620", border: "1px solid #163d32" }}>

      {/* Header */}
      <div className="px-5 py-4"
        style={{ borderBottom: "1px solid #163d32", background: "linear-gradient(135deg, rgba(52,211,153,0.06) 0%, transparent 60%)" }}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md"
                style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>
                #{rank}
              </span>
              {rank === 1 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md"
                  style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>
                  Best Match
                </span>
              )}
            </div>
            <h3 className="text-xl font-semibold" style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
              {med.medicine_name}
            </h3>
            {med.generic_name && (
              <p className="text-xs mt-0.5" style={{ fontFamily: "JetBrains Mono, monospace", color: "#6b9e8f" }}>
                {med.generic_name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* What is this */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: "#2a5a48" }}>
            <Zap className="w-3 h-3" /> What is this?
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#ecfdf5" }}>{med.what_is_this}</p>
        </div>

        {/* Used for */}
        {med.used_for.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: "#2a5a48" }}>
              <CheckCircle2 className="w-3 h-3" /> Why it helps
            </div>
            <ul className="space-y-1">
              {med.used_for.map((u, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: "#34d399" }} />
                  <span style={{ color: "#ecfdf5" }}>{u}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Side effects */}
        {med.side_effects.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: "#2a5a48" }}>
              <AlertTriangle className="w-3 h-3" /> Side effects
            </div>
            <div className="flex flex-wrap gap-1.5">
              {med.side_effects.map((s, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg"
                  style={{ background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.18)", color: "#fca5a5" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Who should be careful */}
        {med.who_should_be_careful.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: "#2a5a48" }}>
              <Users className="w-3 h-3" /> Who should be careful
            </div>
            <ul className="space-y-1">
              {med.who_should_be_careful.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: "#f87171" }} />
                  <span style={{ color: "#ecfdf5" }}>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Purchase links */}
        {med.purchase_links && med.purchase_links.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "#2a5a48" }}>
              <ShoppingCart className="w-3 h-3" /> Buy online
            </div>
            <div className="flex flex-wrap gap-2">
              {med.purchase_links.map((link) => (
                <a
                  key={link.store}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                  style={{
                    background: "rgba(52,211,153,0.08)",
                    border: "1px solid rgba(52,211,153,0.2)",
                    color: "#34d399",
                  }}
                >
                  {link.store}
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: "#2a5a48" }}>
              Links open search results on pharmacy websites.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface SymptomResultCardProps {
  result: SymptomResult;
  symptoms: string;
}

export default function SymptomResultCard({ result, symptoms }: SymptomResultCardProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {/* Header */}
      <motion.div variants={item} className="px-4 py-3 rounded-xl text-sm"
        style={{ background: "#071a14", border: "1px solid #163d32" }}>
        <p style={{ color: "#6b9e8f" }}>
          Showing recommendations for:{" "}
          <span style={{ color: "#ecfdf5", fontStyle: "italic" }}>&ldquo;{symptoms}&rdquo;</span>
        </p>
      </motion.div>

      {/* Doctor warning if needed */}
      {result.needs_doctor && <DoctorWarning note={result.doctor_note} />}

      {/* Medicine cards */}
      {result.medicines.map((med, i) => (
        <MedicineCard key={i} med={med} rank={i + 1} />
      ))}

      {/* Disclaimer */}
      <motion.div variants={item} className="px-4 py-3 rounded-xl text-xs leading-relaxed"
        style={{ background: "rgba(107,158,143,0.06)", border: "1px solid rgba(107,158,143,0.15)", color: "#6b9e8f" }}>
        <strong style={{ color: "#ecfdf5" }}>Disclaimer:</strong> These are general OTC suggestions only.
        Always read the medicine label, follow dosage instructions, and consult a doctor or pharmacist before use —
        especially if you have existing conditions or are taking other medicines.
      </motion.div>
    </motion.div>
  );
}
