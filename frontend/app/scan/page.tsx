import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Scanner from "@/components/Scanner";
import { Camera, Search, Stethoscope } from "lucide-react";

export const metadata: Metadata = {
  title: "Medicine Assistant — Scan, Search, or Find by Symptoms",
  description:
    "Upload a photo, search by medicine name, or describe your symptoms to get instant plain-language medicine information in 11 Indian languages.",
  alternates: { canonical: "https://medread.in/scan" },
};

const modes = [
  {
    icon: Camera,
    label: "Scan Photo",
    desc: "Upload or capture any medicine label",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
  },
  {
    icon: Search,
    label: "Search by Name",
    desc: "Type any brand or generic name",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
  },
  {
    icon: Stethoscope,
    label: "Find by Symptoms",
    desc: "Describe what you feel, get OTC options",
    color: "#22d3ee",
    bg: "rgba(34,211,238,0.1)",
  },
];

export default function ScanPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#030d0a" }}>
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-medium mb-3"
              style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
              Medicine Assistant
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "#6b9e8f" }}>
              Three ways to understand your medicine. Pick one below.
            </p>
          </div>

          {/* Mode hint strip */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            {modes.map(({ icon: Icon, label, desc, color, bg }) => (
              <div key={label} className="rounded-xl p-3 text-center"
                style={{ background: "#0c2620", border: "1px solid #163d32" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ background: bg }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: "#ecfdf5" }}>{label}</p>
                <p className="text-[10px] leading-snug" style={{ color: "#6b9e8f" }}>{desc}</p>
              </div>
            ))}
          </div>

          <Suspense fallback={null}>
            <Scanner />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
