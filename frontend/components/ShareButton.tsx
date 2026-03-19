"use client";

import { Share2 } from "lucide-react";
import { MedicineResult, formatForWhatsApp } from "@/lib/api";

interface ShareButtonProps { result: MedicineResult; className?: string; }

export default function ShareButton({ result, className = "" }: ShareButtonProps) {
  const handleShare = () => {
    const encoded = encodeURIComponent(formatForWhatsApp(result));
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  return (
    <button onClick={handleShare}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${className}`}
      style={{ border: "1px solid #163d32", color: "#6b9e8f" }}>
      <Share2 className="w-4 h-4" />
      Share on WhatsApp
    </button>
  );
}
