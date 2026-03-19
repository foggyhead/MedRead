import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Disclaimer from "@/components/Disclaimer";
import CabinetClient from "./CabinetClient";

export const metadata: Metadata = {
  title: "Medicine Cabinet",
  description:
    "Your saved medicine explanations in one place. Quick reference, no re-scanning.",
  alternates: { canonical: "https://medread.in/cabinet" },
};

export default function CabinetPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <h1
              className="text-3xl sm:text-4xl font-medium text-[#f0f0f0] mb-2"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Medicine Cabinet
            </h1>
            <p className="text-[#888888]">
              Your saved medicines. All data lives in your browser — nothing is
              sent to any server.
            </p>
          </div>

          <CabinetClient />
        </div>
      </main>

      <footer className="border-t border-[#2a2a2a]">
        <Disclaimer />
      </footer>
    </div>
  );
}
