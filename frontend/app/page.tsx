import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight, Camera, Search, Stethoscope, Globe, MessageCircle,
  Shield, Star, ShoppingCart, Bookmark, ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Medicine Label Reader — Plain Language Explanation | MedRead",
  description:
    "Scan a medicine photo, search by name, or describe your symptoms — get instant plain language explanations in 11 Indian languages. Free, private, no sign-up.",
  alternates: { canonical: "https://medread.in" },
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MedRead",
  url: "https://medread.in",
  description:
    "Medicine assistant that explains any medicine in plain language and recommends medicines for symptoms. Works in 11 Indian languages.",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

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
    q: "Which medicine should I take for fever and headache",
    a: "Use the Symptoms tab on the Scan page — type your symptoms and MedRead will suggest 3-4 OTC medicines available in India with direct buy links to 1mg, PharmEasy, and Netmeds.",
  },
  {
    q: "Is it safe to mix medicines",
    a: "Mixing medicines without checking can be dangerous. MedRead tells you whether each medicine is safe with alcohol and warns specific groups to be careful. Always consult a doctor for mixing multiple medicines.",
  },
  {
    q: "Medicine name meaning in plain language",
    a: "Most medicines have a brand name and a generic name. MedRead shows you both and explains exactly what the medicine does — what it treats, how it works, and who should use it.",
  },
];

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

          {/* ── HERO ─────────────────────────────────────────────────────── */}
          <section className="relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
                style={{ background: "radial-gradient(ellipse, rgba(52,211,153,0.09) 0%, transparent 65%)" }} />
              <div className="absolute top-40 right-0 w-[400px] h-[400px]"
                style={{ background: "radial-gradient(ellipse, rgba(34,211,238,0.05) 0%, transparent 70%)" }} />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-12 relative text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium mb-8"
                style={{ borderColor: "rgba(52,211,153,0.25)", background: "rgba(52,211,153,0.08)", color: "#34d399" }}>
                <Shield className="w-3 h-3" />
                Free · Private · No sign-up required
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.05] tracking-tight mb-6"
                style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                Understand any medicine
                <br />
                <span className="gradient-text">in plain language.</span>
              </h1>

              <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed" style={{ color: "#6b9e8f" }}>
                Three ways to get instant, jargon-free medicine information —
                in <span style={{ color: "#ecfdf5" }}>11 Indian languages.</span>
              </p>

              {/* Language pills */}
              <div className="flex flex-wrap gap-2 mb-14 justify-center">
                {["हिंदी", "বাংলা", "தமிழ்", "తెలుగు", "ಕನ್ನಡ", "മലയാളം", "ગુજરાતી", "+4 more"].map((l) => (
                  <span key={l} className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.12)", color: "#6b9e8f" }}>
                    {l}
                  </span>
                ))}
              </div>

              {/* ── 3 MODE CARDS — the centrepiece ───────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">

                {/* Card 1 — Photo */}
                <Link href="/scan" className="group relative rounded-2xl p-6 text-left transition-all hover:-translate-y-1"
                  style={{ background: "#0c2620", border: "1px solid #163d32" }}>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.06), transparent)", border: "1px solid rgba(52,211,153,0.25)" }} />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                      style={{ background: "rgba(52,211,153,0.12)" }}>
                      <Camera className="w-6 h-6" style={{ color: "#34d399" }} />
                    </div>
                    <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                      Scan a Photo
                    </h2>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: "#6b9e8f" }}>
                      Point your camera or upload a photo of any medicine strip, label, or prescription.
                    </p>
                    <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#34d399" }}>
                      Scan now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>

                {/* Card 2 — Search by name (gradient border = featured) */}
                <Link href="/scan?mode=text" className="group relative rounded-2xl p-6 text-left transition-all hover:-translate-y-1"
                  style={{ background: "#0c2620", border: "1px solid rgba(52,211,153,0.3)", boxShadow: "0 0 32px rgba(52,211,153,0.07)" }}>
                  <div className="absolute top-3.5 right-4 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>
                    Popular
                  </div>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                      style={{ background: "rgba(52,211,153,0.12)" }}>
                      <Search className="w-6 h-6" style={{ color: "#34d399" }} />
                    </div>
                    <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                      Search by Name
                    </h2>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: "#6b9e8f" }}>
                      Know the medicine name? Type it and get a full plain-language breakdown instantly.
                    </p>
                    <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#34d399" }}>
                      Search medicine <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>

                {/* Card 3 — Symptoms */}
                <Link href="/scan?mode=symptoms" className="group relative rounded-2xl p-6 text-left transition-all hover:-translate-y-1"
                  style={{ background: "#0c2620", border: "1px solid #163d32" }}>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.05), transparent)", border: "1px solid rgba(34,211,238,0.2)" }} />
                  <div className="absolute top-3.5 right-4 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(34,211,238,0.12)", color: "#22d3ee" }}>
                    New
                  </div>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                      style={{ background: "rgba(34,211,238,0.1)" }}>
                      <Stethoscope className="w-6 h-6" style={{ color: "#22d3ee" }} />
                    </div>
                    <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                      Search by Symptoms
                    </h2>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: "#6b9e8f" }}>
                      Describe what you&apos;re feeling and get 3–4 OTC medicine recommendations with buy links.
                    </p>
                    <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#22d3ee" }}>
                      Check symptoms <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>

              </div>

              <p className="text-xs" style={{ color: "#2a5a48" }}>
                Your photos and data are never stored. Processed instantly and discarded.
              </p>
            </div>
          </section>

          {/* ── WHAT YOU GET ──────────────────────────────────────────────── */}
          <section style={{ borderTop: "1px solid #163d32", background: "#071a14" }}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-medium mb-3"
                  style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                  Everything you need to know
                </h2>
                <p style={{ color: "#6b9e8f" }}>For every medicine, every scan, every search.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: "💊", title: "What it is", desc: "Plain one-line explanation of the medicine" },
                  { icon: "✅", title: "What it treats", desc: "Exactly what conditions or symptoms it helps with" },
                  { icon: "⚠️", title: "Side effects", desc: "Top 3–4 only, in simple language — not scary" },
                  { icon: "🍺", title: "Alcohol safety", desc: "Clear yes/no on whether it's safe with alcohol" },
                  { icon: "👥", title: "Who to be careful", desc: "Pregnant women, diabetics, kidney patients, etc." },
                  { icon: "🕐", title: "How to take it", desc: "Dosage timing in plain words" },
                  { icon: "🛒", title: "Buy links", desc: "Direct links to 1mg, PharmEasy, Netmeds" },
                  { icon: "💬", title: "Follow-up Q&A", desc: "Ask anything about the medicine, get a clear answer" },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="rounded-2xl p-5 hover-glow"
                    style={{ background: "#0c2620", border: "1px solid #163d32" }}>
                    <div className="text-2xl mb-3">{icon}</div>
                    <h3 className="font-semibold mb-1 text-sm" style={{ color: "#ecfdf5" }}>{title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "#6b9e8f" }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-medium mb-3"
                style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                Three ways to use MedRead
              </h2>
              <p style={{ color: "#6b9e8f" }}>Pick the one that fits your situation right now.</p>
            </div>

            <div className="space-y-4">
              {/* Row 1 */}
              <div className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start"
                style={{ background: "#0c2620", border: "1px solid #163d32" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(52,211,153,0.12)" }}>
                  <Camera className="w-7 h-7" style={{ color: "#34d399" }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold" style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                      Have a medicine strip or bottle?
                    </h3>
                  </div>
                  <p className="leading-relaxed mb-4" style={{ color: "#6b9e8f" }}>
                    Take a photo or upload an image. MedRead reads the label and gives you a complete breakdown —
                    what it is, how to take it, side effects, and who should be careful. Works even on blurry labels.
                  </p>
                  <Link href="/scan" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: "#34d399" }}>
                    Try photo scan <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Row 2 */}
              <div className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start"
                style={{ background: "#0c2620", border: "1px solid #163d32" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(52,211,153,0.12)" }}>
                  <Search className="w-7 h-7" style={{ color: "#34d399" }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                    Know the medicine name?
                  </h3>
                  <p className="leading-relaxed mb-4" style={{ color: "#6b9e8f" }}>
                    Type any brand name or generic name — Dolo 650, Metformin, Amoxicillin — and get the same full
                    explanation without needing a photo. Great for medicines you take regularly.
                  </p>
                  <Link href="/scan?mode=text" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: "#34d399" }}>
                    Search by name <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Row 3 */}
              <div className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start"
                style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.04), rgba(52,211,153,0.04))", border: "1px solid rgba(34,211,238,0.2)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(34,211,238,0.1)" }}>
                  <Stethoscope className="w-7 h-7" style={{ color: "#22d3ee" }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-semibold" style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                      Not sure which medicine to take?
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(34,211,238,0.12)", color: "#22d3ee" }}>New</span>
                  </div>
                  <p className="leading-relaxed mb-4" style={{ color: "#6b9e8f" }}>
                    Describe your symptoms — headache, fever, cold, body ache — and get 3–4 OTC medicine
                    recommendations ranked by relevance. Each one includes direct buy links to 1mg, PharmEasy,
                    and Netmeds so you can order in minutes.
                  </p>
                  <Link href="/scan?mode=symptoms" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: "#22d3ee" }}>
                    Describe symptoms <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── FEATURES STRIP ───────────────────────────────────────────── */}
          <section style={{ borderTop: "1px solid #163d32", borderBottom: "1px solid #163d32", background: "#071a14" }}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    icon: Globe,
                    color: "#22d3ee",
                    bg: "rgba(34,211,238,0.1)",
                    title: "11 Indian Languages",
                    desc: "हिंदी, বাংলা, தமிழ், తెలుగు, ਪੰਜਾਬੀ & more. Same clear explanation, your language.",
                  },
                  {
                    icon: Bookmark,
                    color: "#34d399",
                    bg: "rgba(52,211,153,0.1)",
                    title: "Medicine Cabinet",
                    desc: "Save any result and access it offline anytime. Export a JSON backup so you never lose it.",
                  },
                  {
                    icon: ShoppingCart,
                    color: "#34d399",
                    bg: "rgba(52,211,153,0.1)",
                    title: "Buy Directly Online",
                    desc: "One click to search 1mg, PharmEasy or Netmeds for any recommended medicine.",
                  },
                  {
                    icon: MessageCircle,
                    color: "#22d3ee",
                    bg: "rgba(34,211,238,0.1)",
                    title: "Follow-up Q&A",
                    desc: "Ask anything about a medicine and get a calm, clear answer with history saved per medicine.",
                  },
                  {
                    icon: Shield,
                    color: "#34d399",
                    bg: "rgba(52,211,153,0.1)",
                    title: "100% Private",
                    desc: "Photos processed instantly and discarded. No account. No tracking. Nothing stored on servers.",
                  },
                  {
                    icon: Star,
                    color: "#22d3ee",
                    bg: "rgba(34,211,238,0.1)",
                    title: "Safety First",
                    desc: "Symptoms search warns you when to see a doctor. Serious condition flags built in.",
                  },
                ].map(({ icon: Icon, color, bg, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-sm" style={{ color: "#ecfdf5" }}>{title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "#6b9e8f" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── TRUST QUOTE ───────────────────────────────────────────────── */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
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

          {/* ── FAQ ───────────────────────────────────────────────────────── */}
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

          {/* ── CTA BANNER ────────────────────────────────────────────────── */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
            <div className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.1) 0%, rgba(34,211,238,0.06) 100%)", border: "1px solid rgba(52,211,153,0.2)" }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(52,211,153,0.07) 0%, transparent 70%)" }} />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-medium mb-4"
                  style={{ fontFamily: "Fraunces, serif", color: "#ecfdf5" }}>
                  Know your medicine.<br />
                  <span className="gradient-text">Own your health.</span>
                </h2>
                <p className="mb-10 max-w-lg mx-auto" style={{ color: "#6b9e8f" }}>
                  Photo, name, or symptoms — pick the way that works for you right now.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/scan"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-[#030d0a] transition-all group"
                    style={{ background: "linear-gradient(135deg, #34d399, #22d3ee)", boxShadow: "0 0 36px rgba(52,211,153,0.2)" }}>
                    Get started — it&apos;s free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/cabinet"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-medium transition-all"
                    style={{ border: "1px solid #163d32", color: "#6b9e8f", background: "rgba(52,211,153,0.03)" }}>
                    <Bookmark className="w-4 h-4" /> View Cabinet
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
}
