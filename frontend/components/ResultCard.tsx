"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  Users,
  Wine,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { MedicineResult, saveToCabinet } from "@/lib/api";
import FollowUp from "./FollowUp";
import ShareButton from "./ShareButton";

interface ResultCardProps {
  result: MedicineResult;
}

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function ConfidenceBanner({ confidence }: { confidence: string }) {
  if (confidence === "low") {
    return (
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#f87171]/10 border border-[#f87171]/25 text-[#f87171]">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p className="text-sm leading-relaxed">
          We couldn&apos;t read this label clearly. The information below may be
          incomplete. Please consult a pharmacist.
        </p>
      </div>
    );
  }
  return null;
}

function Section({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={item} className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#555]">
        {icon}
        {label}
      </div>
      {children}
    </motion.div>
  );
}

export default function ResultCard({ result }: ResultCardProps) {
  const [saved, setSaved] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const handleSave = () => {
    saveToCabinet(result);
    setSaved(true);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden"
    >
      {/* Header */}
      <motion.div
        variants={item}
        className="px-6 py-5 border-b border-[#2a2a2a] bg-gradient-to-r from-[#7c6af7]/10 to-transparent"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              className="text-2xl sm:text-3xl font-semibold text-[#f0f0f0] leading-tight"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              {result.medicine_name}
            </h2>
            {result.generic_name && (
              <p
                className="text-sm text-[#888888] mt-1"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {result.generic_name}
              </p>
            )}
          </div>
          <span
            className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg ${
              result.confidence === "high"
                ? "bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/25"
                : result.confidence === "medium"
                  ? "bg-[#7c6af7]/15 text-[#7c6af7] border border-[#7c6af7]/25"
                  : "bg-[#f87171]/15 text-[#f87171] border border-[#f87171]/25"
            }`}
          >
            {result.confidence} confidence
          </span>
        </div>
      </motion.div>

      {/* Body */}
      <div className="px-6 py-5 space-y-6">
        <ConfidenceBanner confidence={result.confidence} />

        {/* What is this */}
        <Section
          icon={<Zap className="w-3.5 h-3.5" />}
          label="What is this?"
        >
          <p className="text-[#f0f0f0] leading-relaxed">{result.what_is_this}</p>
        </Section>

        {/* Used for */}
        <Section
          icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          label="Used for"
        >
          <ul className="space-y-1.5">
            {result.used_for.map((use, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[#f0f0f0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22d3a5] flex-shrink-0 mt-2" />
                <span className="leading-relaxed">{use}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* How to take */}
        <Section icon={<Clock className="w-3.5 h-3.5" />} label="How to take">
          <div className="bg-[#111111] rounded-xl p-4 border border-[#2a2a2a]">
            <p className="text-[#f0f0f0] leading-relaxed">{result.how_to_take}</p>
          </div>
        </Section>

        {/* Side effects */}
        <Section
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          label="Common side effects"
        >
          <div className="flex flex-wrap gap-2">
            {result.side_effects.map((effect, i) => (
              <span
                key={i}
                className="text-sm px-3 py-1 rounded-lg bg-[#f87171]/10 border border-[#f87171]/20 text-[#f0f0f0]"
              >
                {effect}
              </span>
            ))}
          </div>
        </Section>

        {/* Who should be careful */}
        {result.who_should_be_careful.length > 0 && (
          <Section
            icon={<Users className="w-3.5 h-3.5" />}
            label="Who should be careful"
          >
            <ul className="space-y-1.5">
              {result.who_should_be_careful.map((who, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[#f0f0f0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f87171] flex-shrink-0 mt-2" />
                  <span className="leading-relaxed">{who}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Alcohol */}
        <Section
          icon={<Wine className="w-3.5 h-3.5" />}
          label="Safe with alcohol?"
        >
          <div
            className={`flex items-start gap-3 p-3.5 rounded-xl border ${
              result.alcohol_safe
                ? "bg-[#4ade80]/8 border-[#4ade80]/20"
                : "bg-[#f87171]/8 border-[#f87171]/20"
            }`}
          >
            <span
              className={`text-lg ${result.alcohol_safe ? "text-[#4ade80]" : "text-[#f87171]"}`}
            >
              {result.alcohol_safe ? "✓" : "✗"}
            </span>
            <div>
              <p
                className={`font-medium text-sm ${result.alcohol_safe ? "text-[#4ade80]" : "text-[#f87171]"}`}
              >
                {result.alcohol_safe ? "Generally safe" : "Avoid alcohol"}
              </p>
              <p className="text-sm text-[#888888] mt-0.5">
                {result.alcohol_reason}
              </p>
            </div>
          </div>
        </Section>
      </div>

      {/* Actions */}
      <motion.div
        variants={item}
        className="px-6 py-4 border-t border-[#2a2a2a] flex flex-wrap items-center gap-2"
      >
        <ShareButton result={result} className="flex-1 sm:flex-none" />

        <button
          onClick={handleSave}
          disabled={saved}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all flex-1 sm:flex-none ${
            saved
              ? "border-[#4ade80]/30 bg-[#4ade80]/10 text-[#4ade80]"
              : "border-[#2a2a2a] text-[#888888] hover:text-[#f0f0f0] hover:border-[#7c6af7]/40 hover:bg-[#7c6af7]/5"
          }`}
        >
          {saved ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
          {saved ? "Saved" : "Save to Cabinet"}
        </button>

        <button
          onClick={() => setShowFollowUp(!showFollowUp)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#2a2a2a] text-[#888888] hover:text-[#f0f0f0] hover:border-[#7c6af7]/40 text-sm font-medium transition-all flex-1 sm:flex-none justify-center"
        >
          Ask follow-up
          {showFollowUp ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </motion.div>

      {/* Follow-up */}
      {showFollowUp && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-6 pb-6 border-t border-[#2a2a2a] pt-5"
        >
          <FollowUp result={result} />
        </motion.div>
      )}
    </motion.div>
  );
}
