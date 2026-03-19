import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Disclaimer from "@/components/Disclaimer";
import { ArrowRight, Zap, Globe, MessageCircle, Shield, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Medicine Label Reader — Plain Language Explanation | MedRead",
  description:
    "Upload a photo of any medicine strip, label, or prescription and get an instant plain language explanation. Works in 11 Indian languages. Free, private, instant.",
  alternates: { canonical: "https://medread.in" },
};

const features = [
  {
    icon: Zap,
    title: "Plain Language",
    desc: "We cut the jargon. Every word explained like you're talking to a friend, not a doctor.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
  },
  {
    icon: Globe,
    title: "11 Indian Languages",
    desc: "Hindi, Tamil, Bengali, Telugu, Marathi & more. Same clear explanation, your language.",
    color: "#22d3ee",
    bg: "rgba(34,211,238,0.1)",
  },
  {
    icon: MessageCircle,
    title: "Ask Follow Ups",
    desc: "Got questions? Ask anything about the medicine and get a calm, clear answer instantly.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
  },
];

const faqs = [
  {
    q: "How to read medicine label in Hindi",
    a: "MedRead can explain any medicine label in Hindi. Upload a photo and tap हिंदी — you'll get a full breakdown in plain Hindi, no jargon.",
  },
  {
    q: "What do side effects on medicine mean",
    a: "Side effects are reactions your body may have to a medicine. MedRead lists only the top 3–4 most common ones in simple words, so you know what to watch for without getting scared.",
  },
  {
    q: "Is it safe to mix medicines",
    a: "Mixing medicines without checking can be dangerous. MedRead tells you whether each medicine is safe with alcohol and warns specific groups to be careful. Always consult a doctor for mixing multiple medicines.",
  },
  {
    q: "How to understand a prescription",
    a: "Prescriptions use abbreviations like OD (once daily), BD (twice daily), SOS (when needed). MedRead explains all of this in plain language when you upload a photo.",
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
  description: "Medicine label reader that explains any medicine in plain language. Works in 11 Indian languages.",
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
      <div className="min-h-screen flex flex-col" style={{ background: "#030d0a" }}>
        <Navbar />

        <main className="flex-1 pt-16">
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px]"
                style={{ background: "radial-gradient(ellipse, rgba(52,211,153,0.1) 0%, transparent 65%)" }} />
              <div className="absolute top-32 right-0 w-[500px] h-[400px]"
                style={{ background: "radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)" }} />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 relative">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                {/* Left */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium mb-8"
                    style={{ borderColor: "rgba(52,211,153,0.25)", background: "rgba(52,211,153,0.08)", color: "#34d399" }}>
                    <Shield className="w-3 h-3" />
                    Free · Private · No sign-up
                  </div>

                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.05] tracking-tight mb-6"
                    style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                    Your medicine,
                    <br />
                    <span className="gradient-text">in plain language.</span>
                  </h1>

                  <p className="text-lg sm:text-xl mb-3 leading-relaxed max-w-xl mx-auto lg:mx-0"
                    style={{ color: "#6b9e8f" }}>
                    Point. Scan. Understand.{" "}
                    <span style={{ color: "#ecfdf5" }}>No medical degree required.</span>
                  </p>
                  <p className="text-base mb-10 max-w-xl mx-auto lg:mx-0" style={{ color: "#6b9e8f" }}>
                    Built for Indian families who deserve to know what they&apos;re taking — in their own language.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <Link href="/scan"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-[#030d0a] transition-all group"
                      style={{ background: "linear-gradient(135deg, #34d399, #22d3ee)", boxShadow: "0 0 36px rgba(52,211,153,0.25)" }}>
                      Scan a Medicine
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/cabinet"
                      className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-medium transition-all"
                      style={{ border: "1px solid #163d32", color: "#6b9e8f", background: "rgba(52,211,153,0.03)" }}>
                      View Cabinet
                    </Link>
                  </div>

                  <p className="text-xs mt-5" style={{ color: "#2a5a48" }}>
                    Your images are never stored. Processed and discarded immediately.
                  </p>

                  {/* Language pills */}
                  <div className="flex flex-wrap gap-2 mt-8 justify-center lg:justify-start">
                    {["हिंदी", "বাংলা", "தமிழ்", "తెలుగు", "ಕನ್ನಡ", "മലയാളം", "ગુજરાતી", "+4 more"].map((l) => (
                      <span key={l} className="text-xs px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.12)", color: "#6b9e8f" }}>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right — demo */}
                <div className="flex-shrink-0 w-full max-w-sm float">
                  <DemoCard />
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-medium mb-3"
                style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                Built different
              </h2>
              <p style={{ color: "#6b9e8f" }}>Not another health app. Actually useful for real families.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="rounded-2xl p-6 hover-glow transition-all"
                  style={{ background: "#0c2620", border: "1px solid #163d32" }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: bg }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b9e8f" }}>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section style={{ borderTop: "1px solid #163d32", borderBottom: "1px solid #163d32", background: "#071a14" }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-medium mb-4"
                    style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                    Three steps.<br />
                    <span className="gradient-text">Total clarity.</span>
                  </h2>
                  <p className="mb-10" style={{ color: "#6b9e8f" }}>No sign-up. No app. Works in your browser.</p>
                  <div className="space-y-8">
                    {[
                      { n: "1", t: "Upload a photo", d: "Take a photo of any medicine strip, bottle, or prescription." },
                      { n: "2", t: "AI reads the label", d: "Gemini Vision reads every ingredient, dosage, and warning." },
                      { n: "3", t: "Get plain language", d: "Clear breakdown in your language. No jargon, ever." },
                    ].map(({ n, t, d }) => (
                      <div key={n} className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
                          style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", fontFamily: "JetBrains Mono, monospace" }}>
                          {n}
                        </div>
                        <div>
                          <p className="font-semibold mb-0.5" style={{ color: "#ecfdf5" }}>{t}</p>
                          <p className="text-sm" style={{ color: "#6b9e8f" }}>{d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl p-8" style={{ background: "#0c2620", border: "1px solid #163d32" }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: "rgba(52,211,153,0.12)" }}>
                    <Shield className="w-6 h-6" style={{ color: "#34d399" }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                    100% private
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "#6b9e8f" }}>
                    Your medicine photos are processed instantly and never stored. No account. No tracking. Nothing saved on any server.
                  </p>
                  {["No account required", "Images deleted immediately", "No data sold or shared", "Works on any device"].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm mb-3" style={{ color: "#6b9e8f" }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#34d399" }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Trust */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" style={{ color: "#34d399" }} />
              ))}
            </div>
            <blockquote className="text-2xl sm:text-3xl font-medium max-w-2xl mx-auto mb-4"
              style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
              &ldquo;Finally, I understand what my mother&apos;s medicines actually do.&rdquo;
            </blockquote>
            <p className="text-sm" style={{ color: "#6b9e8f" }}>Built for every Indian family</p>
          </section>

          {/* FAQ */}
          <section style={{ borderTop: "1px solid #163d32", background: "#071a14" }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
              <h2 className="text-3xl sm:text-4xl font-medium mb-2 text-center"
                style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>Common questions</h2>
              <p className="text-center mb-12" style={{ color: "#6b9e8f" }}>Things people actually search for</p>
              <div className="space-y-3">
                {faqs.map(({ q, a }) => (
                  <details key={q} className="group rounded-2xl overflow-hidden hover-glow"
                    style={{ background: "#0c2620", border: "1px solid #163d32" }}>
                    <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium list-none select-none"
                      style={{ color: "#ecfdf5" }}>
                      {q}
                      <span className="ml-4 flex-shrink-0 text-xl leading-none group-open:rotate-45 transition-transform"
                        style={{ color: "#6b9e8f" }}>+</span>
                    </summary>
                    <div className="px-6 pb-5 pt-4 text-sm leading-relaxed"
                      style={{ borderTop: "1px solid #163d32", color: "#6b9e8f" }}>{a}</div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
            <div className="rounded-3xl p-12 text-center relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.1) 0%, rgba(34,211,238,0.06) 100%)", border: "1px solid rgba(52,211,153,0.2)" }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(52,211,153,0.07) 0%, transparent 70%)" }} />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-medium mb-4"
                  style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                  Know your medicine.<br />
                  <span className="gradient-text">Own your health.</span>
                </h2>
                <p className="mb-8 max-w-lg mx-auto" style={{ color: "#6b9e8f" }}>
                  Every medicine in your cabinet deserves a plain language explanation. Start with one.
                </p>
                <Link href="/scan"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-[#030d0a] transition-all group"
                  style={{ background: "linear-gradient(135deg, #34d399, #22d3ee)", boxShadow: "0 0 36px rgba(52,211,153,0.2)" }}>
                  Scan your first medicine
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer style={{ borderTop: "1px solid #163d32", background: "#071a14" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm" style={{ color: "#2a5a48" }}>© 2026 MedRead · Built by Harsha · Not a substitute for medical advice.</p>
            <div className="flex items-center gap-6 text-sm" style={{ color: "#2a5a48" }}>
              <Link href="/scan" className="hover:text-[#6b9e8f] transition-colors">Scan</Link>
              <Link href="/cabinet" className="hover:text-[#6b9e8f] transition-colors">Cabinet</Link>
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
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d;
          animation: autoFlip 6s ease-in-out infinite;
        }
        @keyframes autoFlip {
          0%, 35% { transform: rotateY(0deg); }
          50%, 85% { transform: rotateY(180deg); }
          100% { transform: rotateY(0deg); }
        }
        .demo-face { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .demo-back { transform: rotateY(180deg); }
      `}</style>
      <div style={{ perspective: "1000px", height: "280px" }}>
        <div className="demo-flip-inner">
          <div className="demo-face rounded-2xl p-6 flex flex-col justify-between"
            style={{ background: "#0c2620", border: "1px solid #163d32", boxShadow: "0 0 40px rgba(52,211,153,0.07)" }}>
            <div className="flex items-center gap-1.5 mb-4">
              {[0,1,2,3,4].map((i) => (
                <div key={i} className="flex-1 h-16 rounded-xl flex items-center justify-center"
                  style={{ background: i % 2 === 0 ? "rgba(52,211,153,0.1)" : "rgba(34,211,238,0.08)", border: "1px solid rgba(52,211,153,0.15)" }}>
                  <div className="w-5 h-9 rounded-lg" style={{ border: "1px solid rgba(52,211,153,0.2)" }} />
                </div>
              ))}
            </div>
            <div>
              <div className="h-2.5 w-36 rounded-full mb-2" style={{ background: "#163d32" }} />
              <div className="h-2 w-24 rounded-full mb-1.5" style={{ background: "#0e2e24" }} />
              <div className="h-2 w-28 rounded-full" style={{ background: "#0e2e24" }} />
            </div>
            <div className="flex items-center gap-2 text-xs mt-4" style={{ color: "#2a5a48" }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#34d399" }} />
              Reading label...
            </div>
          </div>

          <div className="demo-face demo-back rounded-2xl p-6 flex flex-col justify-between"
            style={{ background: "#0c2620", border: "1px solid rgba(52,211,153,0.3)", boxShadow: "0 0 40px rgba(52,211,153,0.1)" }}>
            <div>
              <div className="text-xl font-semibold mb-0.5" style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                Paracetamol 650mg
              </div>
              <div className="text-xs mb-5" style={{ fontFamily: "JetBrains Mono, monospace", color: "#6b9e8f" }}>
                acetaminophen
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#2a5a48" }}>What is this?</p>
                  <p className="text-sm" style={{ color: "#ecfdf5" }}>A common painkiller and fever reducer</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: "#2a5a48" }}>Used for</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Headache", "Fever", "Body pain"].map((t) => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-lg"
                        style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "#34d399" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#34d399" }} />
              High confidence read
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
