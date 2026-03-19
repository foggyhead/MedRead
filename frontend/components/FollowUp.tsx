"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { MedicineResult, askFollowUp } from "@/lib/api";

interface FollowUpProps { result: MedicineResult; }
interface QA { question: string; answer: string; }

export default function FollowUp({ result }: FollowUpProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QA[]>([]);
  const [error, setError] = useState<string | null>(null);

  const medicineContext = `Medicine: ${result.medicine_name} (${result.generic_name}).
What it is: ${result.what_is_this}.
Used for: ${result.used_for.join(", ")}.
How to take: ${result.how_to_take}.
Side effects: ${result.side_effects.join(", ")}.
Who should be careful: ${result.who_should_be_careful.join(", ")}.
Alcohol: ${result.alcohol_safe ? "Safe" : "Not safe"} — ${result.alcohol_reason}.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;
    const q = question.trim(); setQuestion(""); setLoading(true); setError(null);
    try {
      const answer = await askFollowUp(medicineContext, q);
      setHistory((h) => [...h, { question: q, answer }]);
    } catch { setError("Couldn't get an answer. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#6b9e8f" }}>
        <MessageCircle className="w-4 h-4" />Ask a follow-up question
      </div>

      <AnimatePresence>
        {history.map((qa, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex justify-end">
              <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]"
                style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
                <p className="text-sm" style={{ color: "#ecfdf5" }}>{qa.question}</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]"
                style={{ background: "#071a14", border: "1px solid #163d32" }}>
                <p className="text-sm leading-relaxed" style={{ color: "#ecfdf5" }}>{qa.answer}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {error && (
        <p className="text-sm px-4 py-2.5 rounded-xl"
          style={{ color: "#f87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Can I take this with food?"
          className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
          style={{ background: "#071a14", border: "1px solid #163d32", color: "#ecfdf5" }}
          disabled={loading} />
        <button type="submit" disabled={!question.trim() || loading}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all"
          style={{ background: "linear-gradient(135deg, #34d399, #22d3ee)" }}>
          {loading ? <Loader2 className="w-4 h-4 text-[#030d0a] animate-spin" /> : <Send className="w-4 h-4 text-[#030d0a]" />}
        </button>
      </form>
    </div>
  );
}
