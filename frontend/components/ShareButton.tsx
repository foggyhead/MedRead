"use client";

import { Share2 } from "lucide-react";
import { MedicineResult, formatForWhatsApp } from "@/lib/api";

interface ShareButtonProps {
  result: MedicineResult;
  className?: string;
}

export default function ShareButton({ result, className = "" }: ShareButtonProps) {
  const handleShare = () => {
    const text = formatForWhatsApp(result);
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#2a2a2a] text-[#888888] hover:text-[#f0f0f0] hover:border-[#22d3a5]/40 hover:bg-[#22d3a5]/5 transition-all text-sm font-medium ${className}`}
    >
      <Share2 className="w-4 h-4" />
      Share on WhatsApp
    </button>
  );
}
