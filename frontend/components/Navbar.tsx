"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{ borderBottom: "1px solid #163d32", background: "rgba(3,13,10,0.85)", backdropFilter: "blur(12px)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="MedRead" className="w-8 h-8 rounded-lg" />
          <span className="text-lg font-semibold" style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
            MedRead
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {[{ href: "/scan", label: "Scan" }, { href: "/cabinet", label: "Cabinet" }].map(({ href, label }) => (
            <Link key={href} href={href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={pathname === href
                ? { background: "rgba(52,211,153,0.12)", color: "#34d399" }
                : { color: "#6b9e8f" }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
