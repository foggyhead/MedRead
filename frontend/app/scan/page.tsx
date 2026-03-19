import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Disclaimer from "@/components/Disclaimer";
import Scanner from "@/components/Scanner";

export const metadata: Metadata = {
  title: "Scan a Medicine",
  description: "Upload a photo of any medicine strip or label and get an instant plain language explanation in 11 Indian languages.",
  alternates: { canonical: "https://medread.in/scan" },
};

export default function ScanPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#030d0a" }}>
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-medium mb-2"
              style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
              Scan a medicine
            </h1>
            <p style={{ color: "#6b9e8f" }}>
              Upload a clear photo of the medicine label, strip, or packaging.
            </p>
          </div>
          <Scanner />
        </div>
      </main>
      <footer style={{ borderTop: "1px solid #163d32" }}>
        <Disclaimer />
      </footer>
    </div>
  );
}
