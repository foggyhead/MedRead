import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Disclaimer from "@/components/Disclaimer";
import Scanner from "@/components/Scanner";

export const metadata: Metadata = {
  title: "Scan a Medicine",
  description:
    "Upload a photo of any medicine strip or label and get an instant plain language explanation in English or Hindi.",
  alternates: { canonical: "https://medread.in/scan" },
};

export default function ScanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl sm:text-4xl font-medium text-[#f0f0f0] mb-2"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Scan a medicine
            </h1>
            <p className="text-[#888888]">
              Upload a clear photo of the medicine label, strip, or packaging.
            </p>
          </div>

          <Scanner />
        </div>
      </main>

      <footer className="border-t border-[#2a2a2a]">
        <Disclaimer />
      </footer>
    </div>
  );
}
