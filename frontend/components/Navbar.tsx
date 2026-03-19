"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pill } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#2a2a2a] bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#7c6af7]/20 flex items-center justify-center group-hover:bg-[#7c6af7]/30 transition-colors">
            <Pill className="w-4 h-4 text-[#7c6af7]" />
          </div>
          <span
            className="text-lg font-semibold text-[#f0f0f0]"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            MedRead
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/scan"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/scan"
                ? "bg-[#7c6af7]/20 text-[#7c6af7]"
                : "text-[#888888] hover:text-[#f0f0f0]"
            }`}
          >
            Scan
          </Link>
          <Link
            href="/cabinet"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/cabinet"
                ? "bg-[#7c6af7]/20 text-[#7c6af7]"
                : "text-[#888888] hover:text-[#f0f0f0]"
            }`}
          >
            Cabinet
          </Link>
        </div>
      </div>
    </nav>
  );
}
