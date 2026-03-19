import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Disclaimer from "@/components/Disclaimer";
import { ArrowRight, Zap, Globe, MessageCircle, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Medicine Label Reader — Plain Language Explanation | MedRead",
  description:
    "Upload a photo of any medicine strip, label, or prescription and get an instant plain language explanation. Works in Hindi & English. Free, private, instant.",
  alternates: { canonical: "https://medread.in" },
};

const features = [
  {
    icon: Zap,
    title: "Plain Language",
    desc: "We cut the jargon. Every word explained like you're talking to a friend, not a doctor.",
    color: "#7c6af7",
  },
  {
    icon: Globe,
    title: "Hindi & English",
    desc: "Switch between English and हिंदी with one tap. Same clear explanation, your language.",
    color: "#22d3a5",
  },
  {
    icon: MessageCircle,
    title: "Ask Follow Ups",
    desc: "Got questions? Ask anything about the medicine and get a calm, clear answer instantly.",
    color: "#7c6af7",
  },
];

const faqs = [
  {
    q: "How to read medicine label in Hindi",
    a: "MedRead can explain any medicine label in Hindi. Upload a photo and tap the हिंदी toggle — you'll get a full breakdown in plain Hindi, no jargon.",
  },
  {
    q: "What do side effects on medicine mean",
    a: "Side effects are reactions your body may have to a medicine. MedRead lists only the top 3–4 most common ones in simple words, so you know what to watch for without getting scared.",
  },
  {
    q: "Is it safe to mix medicines",
    a: "Mixing medicines without checking can be dangerous. MedRead tells you whether each medicine is safe with alcohol and warns specific groups (like pregnant women or diabetics) to be careful. For mixing multiple medicines, always consult a doctor.",
  },
  {
    q: "How to understand a prescription",
    a: "Prescriptions use abbreviations like OD (once daily), BD (twice daily), SOS (when needed). MedRead explains all of this in plain language when you upload a photo of your prescription.",
  },
  {
    q: "Medicine name meaning in plain language",
    a: "Most medicines have a brand name and a generic name. MedRead shows you both and explains exactly what the medicine does — what it treats, how it works, and who should use it.",
  },
];

const schemaData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MedRead",
  url: "https://medread.in",
  description:
    "Medicine label reader that explains any medicine in plain language. Works in Hindi and English.",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        <Navbar />

        <main className="flex-1 pt-16">
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-10"
                style={{
                  background:
                    "radial-gradient(ellipse, #7c6af7 0%, transparent 70%)",
                }}
              />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7c6af7]/30 bg-[#7c6af7]/10 text-xs font-medium text-[#7c6af7] mb-8">
                <Shield className="w-3 h-3" />
                Free · Private · Instant
              </div>

              <h1
                className="text-5xl sm:text-6xl md:text-7xl font-medium text-[#f0f0f0] leading-[1.1] tracking-tight mb-6"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Your medicine,
                <br />
                <span className="gradient-text">in plain language.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#888888] max-w-2xl mx-auto mb-10 leading-relaxed">
                Point. Scan. Understand.{" "}
                <span className="text-[#f0f0f0]">No medical degree required.</span>{" "}
                Built for Indian families who deserve to know what they&apos;re taking.
              </p>

              <Link
                href="/scan"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#7c6af7] text-white font-semibold text-lg hover:bg-[#6b5de6] transition-all hover:shadow-[0_0_30px_rgba(124,106,247,0.3)] group"
              >
                Scan a Medicine
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-xs text-[#555] mt-4">
                Your images are never stored. Everything is processed and
                discarded immediately.
              </p>

              {/* Animated Demo Card */}
              <div className="mt-20 flex justify-center">
                <DemoCard />
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map(({ icon: Icon, title, desc, color }) => (
                <div
                  key={title}
                  className="glass rounded-2xl p-6 hover-glow border border-[#2a2a2a] transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <h3
                    className="text-[#f0f0f0] font-semibold text-lg mb-2"
                    style={{ fontFamily: "Fraunces, serif" }}
                  >
                    {title}
                  </h3>
                  <p className="text-[#888888] text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section className="border-y border-[#2a2a2a] bg-[#111111]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
              <h2
                className="text-3xl sm:text-4xl font-medium text-[#f0f0f0] mb-4"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Three steps to clarity
              </h2>
              <p className="text-[#888888] mb-16 max-w-xl mx-auto">
                No sign-up. No app download. Works right in your browser.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                  {
                    step: "01",
                    title: "Upload a photo",
                    desc: "Take a photo of any medicine strip, bottle label, or prescription.",
                  },
                  {
                    step: "02",
                    title: "AI reads the label",
                    desc: "Our AI reads every ingredient, dosage, and warning on the label.",
                  },
                  {
                    step: "03",
                    title: "Get plain language",
                    desc: "Receive a clear breakdown in English or Hindi. No jargon, ever.",
                  },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="text-left">
                    <div
                      className="text-5xl font-bold mb-4 gradient-text"
                      style={{ fontFamily: "Fraunces, serif" }}
                    >
                      {step}
                    </div>
                    <h3
                      className="text-[#f0f0f0] font-semibold text-lg mb-2"
                      style={{ fontFamily: "Fraunces, serif" }}
                    >
                      {title}
                    </h3>
                    <p className="text-[#888888] text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
            <h2
              className="text-3xl sm:text-4xl font-medium text-[#f0f0f0] mb-2 text-center"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Common questions
            </h2>
            <p className="text-[#888888] text-center mb-12">
              Things people actually search for
            </p>
            <div className="space-y-4">
              {faqs.map(({ q, a }) => (
                <details
                  key={q}
                  className="group glass rounded-2xl border border-[#2a2a2a] overflow-hidden hover-glow"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-[#f0f0f0] font-medium list-none select-none">
                    {q}
                    <span className="ml-4 flex-shrink-0 text-[#888888] group-open:rotate-45 transition-transform text-xl leading-none">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-[#888888] text-sm leading-relaxed border-t border-[#2a2a2a] pt-4">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
            <div className="rounded-3xl bg-gradient-to-br from-[#7c6af7]/15 to-[#22d3a5]/10 border border-[#7c6af7]/20 p-12 text-center">
              <h2
                className="text-3xl sm:text-4xl font-medium text-[#f0f0f0] mb-4"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Know your medicine.
                <br />
                <span className="gradient-text">Own your health.</span>
              </h2>
              <p className="text-[#888888] mb-8 max-w-lg mx-auto">
                Every medicine in your cabinet deserves a plain language
                explanation. Start with one.
              </p>
              <Link
                href="/scan"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#7c6af7] text-white font-semibold hover:bg-[#6b5de6] transition-all hover:shadow-[0_0_30px_rgba(124,106,247,0.3)] group"
              >
                Scan your first medicine
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section>
        </main>

        <footer className="border-t border-[#2a2a2a] bg-[#111111]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#555] text-sm">
              © 2024 MedRead. Not a substitute for medical advice.
            </p>
            <div className="flex items-center gap-6 text-sm text-[#555]">
              <Link
                href="/scan"
                className="hover:text-[#888888] transition-colors"
              >
                Scan
              </Link>
              <Link
                href="/cabinet"
                className="hover:text-[#888888] transition-colors"
              >
                Cabinet
              </Link>
            </div>
          </div>
          <Disclaimer />
        </footer>
      </div>
    </>
  );
}

function DemoCard() {
  return (
    <div className="w-full max-w-sm">
      <style>{`
        .demo-flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: autoFlip 6s ease-in-out infinite;
        }
        @keyframes autoFlip {
          0%, 35% { transform: rotateY(0deg); }
          50%, 85% { transform: rotateY(180deg); }
          100% { transform: rotateY(0deg); }
        }
        .demo-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .demo-back { transform: rotateY(180deg); }
      `}</style>
      <div style={{ perspective: "1000px", height: "260px" }}>
        <div className="demo-flip-inner">
          {/* Front — medicine strip */}
          <div className="demo-face rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] p-6 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 mb-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-16 rounded-lg border border-[#3a3a3a] flex items-center justify-center"
                  style={{
                    background: i % 2 === 0 ? "#7c6af720" : "#22d3a520",
                  }}
                >
                  <div className="w-5 h-9 rounded-md border border-[#7c6af740]" />
                </div>
              ))}
            </div>
            <div>
              <div className="h-2.5 w-32 rounded bg-[#3a3a3a] mb-2" />
              <div className="h-2 w-24 rounded bg-[#2a2a2a] mb-1" />
              <div className="h-2 w-28 rounded bg-[#2a2a2a]" />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#555]">
              <div className="w-2 h-2 rounded-full bg-[#7c6af7] animate-pulse" />
              Reading label...
            </div>
          </div>

          {/* Back — result */}
          <div className="demo-face demo-back rounded-2xl bg-[#1a1a1a] border border-[#7c6af7]/30 p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(124,106,247,0.1)]">
            <div>
              <div
                className="text-xl font-semibold text-[#f0f0f0] mb-0.5"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Paracetamol 500mg
              </div>
              <div
                className="text-xs text-[#888888] mb-5"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                acetaminophen
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">
                    What is this?
                  </p>
                  <p className="text-sm text-[#f0f0f0]">
                    A common painkiller and fever reducer
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1.5">
                    Used for
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Headache", "Fever", "Body pain"].map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded-md bg-[#22d3a5]/15 text-[#22d3a5] border border-[#22d3a5]/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#4ade80]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
              High confidence read
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
