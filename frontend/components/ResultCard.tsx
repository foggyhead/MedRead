"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Clock, Zap, Users, Wine, ChevronDown, ChevronUp, Bookmark, BookmarkCheck } from "lucide-react";
import { MedicineResult, saveToCabinet } from "@/lib/api";
import FollowUp from "./FollowUp";
import ShareButton from "./ShareButton";

interface ResultCardProps { result: MedicineResult; }

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

function ConfidenceBanner({ confidence }: { confidence: string }) {
  if (confidence !== "low") return null;
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm leading-relaxed"
      style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      We couldn&apos;t read this label clearly. Information below may be incomplete. Please consult a pharmacist.
    </div>
  );
}

function Section({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <motion.div variants={item} className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#2a5a48" }}>
        {icon}{label}
      </div>
      {children}
    </motion.div>
  );
}

export default function ResultCard({ result }: ResultCardProps) {
  const [saved, setSaved] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const confidenceColor = result.confidence === "high" ? "#34d399" : result.confidence === "medium" ? "#22d3ee" : "#f87171";
  const confidenceBg = result.confidence === "high" ? "rgba(52,211,153,0.1)" : result.confidence === "medium" ? "rgba(34,211,238,0.1)" : "rgba(248,113,113,0.1)";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="rounded-2xl overflow-hidden"
      style={{ background: "#0c2620", border: "1px solid #163d32" }}>

      <motion.div variants={item} className="px-6 py-5"
        style={{ borderBottom: "1px solid #163d32", background: "linear-gradient(135deg, rgba(52,211,153,0.07) 0%, transparent 60%)" }}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl sm:text-3xl font-semibold leading-tight"
              style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
              {result.medicine_name}
            </h2>
            {result.generic_name && (
              <p className="text-sm mt-1" style={{ fontFamily: "JetBrains Mono, monospace", color: "#6b9e8f" }}>
                {result.generic_name}
              </p>
            )}
          </div>
          <span className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg"
            style={{ background: confidenceBg, color: confidenceColor, border: `1px solid ${confidenceColor}33` }}>
            {result.confidence} confidence
          </span>
        </div>
      </motion.div>

      <div className="px-6 py-5 space-y-6">
        <ConfidenceBanner confidence={result.confidence} />

        <Section icon={<Zap className="w-3.5 h-3.5" />} label="What is this?">
          <p className="leading-relaxed" style={{ color: "#ecfdf5" }}>{result.what_is_this}</p>
        </Section>

        <Section icon={<CheckCircle2 className="w-3.5 h-3.5" />} label="Used for">
          <ul className="space-y-1.5">
            {result.used_for.map((use, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: "#34d399" }} />
                <span className="leading-relaxed" style={{ color: "#ecfdf5" }}>{use}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={<Clock className="w-3.5 h-3.5" />} label="How to take">
          <div className="p-4 rounded-xl" style={{ background: "#071a14", border: "1px solid #163d32" }}>
            <p className="leading-relaxed" style={{ color: "#ecfdf5" }}>{result.how_to_take}</p>
          </div>
        </Section>

        <Section icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Common side effects">
          <div className="flex flex-wrap gap-2">
            {result.side_effects.map((effect, i) => (
              <span key={i} className="text-sm px-3 py-1 rounded-lg"
                style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#ecfdf5" }}>
                {effect}
              </span>
            ))}
          </div>
        </Section>

        {result.who_should_be_careful.length > 0 && (
          <Section icon={<Users className="w-3.5 h-3.5" />} label="Who should be careful">
            <ul className="space-y-1.5">
              {result.who_should_be_careful.map((who, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: "#f87171" }} />
                  <span className="leading-relaxed" style={{ color: "#ecfdf5" }}>{who}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section icon={<Wine className="w-3.5 h-3.5" />} label="Safe with alcohol?">
          <div className="flex items-start gap-3 p-3.5 rounded-xl"
            style={{
              background: result.alcohol_safe ? "rgba(52,211,153,0.06)" : "rgba(248,113,113,0.06)",
              border: `1px solid ${result.alcohol_safe ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`,
            }}>
            <span className="text-lg" style={{ color: result.alcohol_safe ? "#34d399" : "#f87171" }}>
              {result.alcohol_safe ? "✓" : "✗"}
            </span>
            <div>
              <p className="font-medium text-sm" style={{ color: result.alcohol_safe ? "#34d399" : "#f87171" }}>
                {result.alcohol_safe ? "Generally safe" : "Avoid alcohol"}
              </p>
              <p className="text-sm mt-0.5" style={{ color: "#6b9e8f" }}>{result.alcohol_reason}</p>
            </div>
          </div>
        </Section>
      </div>

      <motion.div variants={item} className="px-6 py-4 flex flex-wrap items-center gap-2"
        style={{ borderTop: "1px solid #163d32" }}>
        <ShareButton result={result} className="flex-1 sm:flex-none" />
        <button onClick={() => { saveToCabinet(result); setSaved(true); }} disabled={saved}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 sm:flex-none"
          style={saved
            ? { border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)", color: "#34d399" }
            : { border: "1px solid #163d32", color: "#6b9e8f" }}>
          {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          {saved ? "Saved" : "Save to Cabinet"}
        </button>
        <button onClick={() => setShowFollowUp(!showFollowUp)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 sm:flex-none justify-center"
          style={{ border: "1px solid #163d32", color: "#6b9e8f" }}>
          Ask follow-up
          {showFollowUp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </motion.div>

      {showFollowUp && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="px-6 pb-6 pt-5" style={{ borderTop: "1px solid #163d32" }}>
          <FollowUp result={result} />
        </motion.div>
      )}
    </motion.div>
  );
}
