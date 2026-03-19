"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { MedicineResult, askFollowUp } from "@/lib/api";

interface FollowUpProps {
  result: MedicineResult;
}

interface QA {
  question: string;
  answer: string;
}

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

    const q = question.trim();
    setQuestion("");
    setLoading(true);
    setError(null);

    try {
      const answer = await askFollowUp(medicineContext, q);
      setHistory((h) => [...h, { question: q, answer }]);
    } catch {
      setError("Couldn't get an answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-[#888888]">
        <MessageCircle className="w-4 h-4" />
        Ask a follow-up question
      </div>

      <AnimatePresence>
        {history.map((qa, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex justify-end">
              <div className="bg-[#7c6af7]/20 border border-[#7c6af7]/30 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
                <p className="text-sm text-[#f0f0f0]">{qa.question}</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
                <p className="text-sm text-[#f0f0f0] leading-relaxed">
                  {qa.answer}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {error && (
        <p className="text-sm text-[#f87171] bg-[#f87171]/10 border border-[#f87171]/20 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Can I take this with food? Can my child take this?"
          className="flex-1 bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#7c6af7]/50 transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!question.trim() || loading}
          className="w-10 h-10 rounded-xl bg-[#7c6af7] flex items-center justify-center disabled:opacity-40 hover:bg-[#6b5de6] transition-colors flex-shrink-0"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-white" />
          )}
        </button>
      </form>
    </div>
  );
}
