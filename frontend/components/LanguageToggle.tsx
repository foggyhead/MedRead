"use client";

interface LanguageToggleProps {
  lang: string;
  onChange: (lang: string) => void;
  loading?: boolean;
}

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

export default function LanguageToggle({
  lang,
  onChange,
  loading,
}: LanguageToggleProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => onChange(code)}
          disabled={loading}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
            lang === code
              ? "bg-[#7c6af7] text-white border-[#7c6af7]"
              : "bg-transparent text-[#888888] border-[#2a2a2a] hover:text-[#f0f0f0] hover:border-[#7c6af7]/40"
          } disabled:opacity-50`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
