"use client";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "bn", label: "বাংলা" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "or", label: "ଓଡ଼ିଆ" },
];

interface LanguageToggleProps { lang: string; onChange: (lang: string) => void; loading?: boolean; }

export default function LanguageToggle({ lang, onChange, loading }: LanguageToggleProps) {
  return (
    <div
      className="flex gap-1.5 overflow-x-auto pb-1"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => onChange(code)}
          disabled={loading}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all border disabled:opacity-50"
          style={lang === code
            ? { background: "rgba(52,211,153,0.15)", color: "#34d399", borderColor: "rgba(52,211,153,0.3)" }
            : { background: "transparent", color: "#6b9e8f", borderColor: "#163d32" }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
