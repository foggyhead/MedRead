import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #163d32", background: "#071a14" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: "#6b9e8f" }}>MedRead</span>
          <span style={{ color: "#163d32" }}>·</span>
          <span className="text-sm" style={{ color: "#2a5a48" }}>© 2026</span>
          <span style={{ color: "#163d32" }}>·</span>
          <span className="text-sm" style={{ color: "#2a5a48" }}>Built by Harsha</span>
        </div>
        <p className="text-xs text-center sm:text-right" style={{ color: "#2a5a48" }}>
          Not a substitute for medical advice · Your images are never stored
        </p>
      </div>
      <div style={{ borderTop: "1px solid #0e2e24" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: "#1a3d2c" }}>
            Always consult your doctor or pharmacist before taking any medicine.
          </p>
          <div className="flex items-center gap-4 text-xs" style={{ color: "#1a3d2c" }}>
            <Link href="/" className="hover:text-[#2a5a48] transition-colors">Home</Link>
            <Link href="/scan" className="hover:text-[#2a5a48] transition-colors">Scan</Link>
            <Link href="/cabinet" className="hover:text-[#2a5a48] transition-colors">Cabinet</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
