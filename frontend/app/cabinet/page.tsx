import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CabinetClient from "./CabinetClient";

export const metadata: Metadata = {
  title: "Medicine Cabinet",
  description: "Your saved medicine explanations in one place. Quick reference, no re-scanning.",
  alternates: { canonical: "https://medread.in/cabinet" },
};

export default function CabinetPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#030d0a" }}>
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-medium mb-2"
              style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
              Medicine Cabinet
            </h1>
            <p style={{ color: "#6b9e8f" }}>
              Your saved medicines. All data lives in your browser — nothing sent to any server.
            </p>
          </div>
          <CabinetClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}
