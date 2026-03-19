const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface PurchaseLink {
  store: string;
  url: string;
  color: string;
}

export interface SymptomMedicine {
  medicine_name: string;
  generic_name: string;
  what_is_this: string;
  used_for: string[];
  side_effects: string[];
  who_should_be_careful: string[];
  confidence: "low" | "medium" | "high";
  purchase_links: PurchaseLink[];
}

export interface SymptomResult {
  needs_doctor: boolean;
  doctor_note: string | null;
  medicines: SymptomMedicine[];
}

export interface MedicineResult {
  medicine_name: string;
  what_is_this: string;
  used_for: string[];
  how_to_take: string;
  side_effects: string[];
  who_should_be_careful: string[];
  alcohol_safe: boolean;
  alcohol_reason: string;
  generic_name: string;
  confidence: "low" | "medium" | "high";
}

export interface SavedMedicine {
  id: string;
  medicine_name: string;
  short_description: string;
  saved_at: string;
  result: MedicineResult;
}

export async function scanMedicine(
  file: File,
  lang: string = "en"
): Promise<MedicineResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("lang", lang);

  const res = await fetch(`${API_URL}/api/scan`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("You've reached the hourly scan limit (10 scans/hour). Please try again in an hour.");
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to scan medicine");
  }

  return res.json();
}

export async function searchMedicine(
  name: string,
  lang: string = "en"
): Promise<MedicineResult> {
  const res = await fetch(`${API_URL}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, lang }),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("You've reached the hourly search limit (10 searches/hour). Please try again in an hour.");
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to find medicine");
  }

  return res.json();
}

export async function searchBySymptoms(
  symptoms: string,
  lang: string = "en"
): Promise<SymptomResult> {
  const res = await fetch(`${API_URL}/api/symptoms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms, lang }),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("You've reached the hourly limit. Please try again in an hour.");
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to get recommendations");
  }

  return res.json();
}

export async function askFollowUp(
  medicineContext: string,
  question: string
): Promise<string> {
  const res = await fetch(`${API_URL}/api/followup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ medicine_context: medicineContext, question }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to get answer");
  }

  const data = await res.json();
  return data.answer;
}

// LocalStorage helpers
const CABINET_KEY = "medread_cabinet";

export function getCabinet(): SavedMedicine[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CABINET_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveToCabinet(result: MedicineResult): SavedMedicine {
  const item: SavedMedicine = {
    id: Date.now().toString(),
    medicine_name: result.medicine_name,
    short_description: result.what_is_this,
    saved_at: new Date().toISOString(),
    result,
  };
  const cabinet = getCabinet();
  cabinet.unshift(item);
  localStorage.setItem(CABINET_KEY, JSON.stringify(cabinet));
  return item;
}

export function deleteFromCabinet(id: string): void {
  const cabinet = getCabinet().filter((m) => m.id !== id);
  localStorage.setItem(CABINET_KEY, JSON.stringify(cabinet));
}

export function exportCabinet(): void {
  const data = JSON.stringify(getCabinet(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `medread-cabinet-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importCabinet(json: string): { added: number; error?: string } {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return { added: 0, error: "Invalid file format." };
    const existing = getCabinet();
    const existingIds = new Set(existing.map((m) => m.id));
    const newItems = parsed.filter(
      (m) => m.id && m.medicine_name && m.result && !existingIds.has(m.id)
    );
    const merged = [...newItems, ...existing];
    localStorage.setItem(CABINET_KEY, JSON.stringify(merged));
    return { added: newItems.length };
  } catch {
    return { added: 0, error: "Could not read file. Make sure it's a valid MedRead export." };
  }
}

// ── Recent searches ─────────────────────────────────────────────────────────
const RECENT_KEY = "medread_recent";

export interface RecentSearch {
  id: string;
  type: "text" | "symptoms";
  query: string;
  result_name: string;
  searched_at: string;
}

export function getRecentSearches(): RecentSearch[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); }
  catch { return []; }
}

export function saveRecentSearch(type: "text" | "symptoms", query: string, resultName: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentSearches().filter(
      (s) => !(s.type === type && s.query.toLowerCase() === query.toLowerCase())
    );
    const updated = [
      { id: Date.now().toString(), type, query, result_name: resultName, searched_at: new Date().toISOString() },
      ...existing,
    ].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch { /* ignore */ }
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RECENT_KEY);
}

// ── WhatsApp formatters ──────────────────────────────────────────────────────
export function formatForWhatsApp(result: MedicineResult): string {
  const lines = [
    `💊 *${result.medicine_name}*`,
    result.generic_name ? `_(${result.generic_name})_` : "",
    "",
    `📋 *What is this?*`,
    result.what_is_this,
    "",
    `✅ *Used for:*`,
    ...result.used_for.map((u) => `• ${u}`),
    "",
    `🕐 *How to take:*`,
    result.how_to_take,
    "",
    `⚠️ *Side effects:*`,
    ...result.side_effects.map((s) => `• ${s}`),
    "",
    `🍺 *Safe with alcohol?* ${result.alcohol_safe ? "Yes" : "No"} — ${result.alcohol_reason}`,
    "",
    `_Explained by MedRead.in — Not a substitute for medical advice._`,
  ];
  return lines.filter((l) => l !== undefined).join("\n");
}

export function formatSymptomsForWhatsApp(symptoms: string, medicines: SymptomMedicine[]): string {
  const lines: string[] = [
    `🩺 *Medicines for: "${symptoms}"*`,
    `_Recommended by MedRead.in_`,
    "",
  ];
  medicines.forEach((med, i) => {
    lines.push(`*${i + 1}. ${med.medicine_name}*${med.generic_name ? ` _(${med.generic_name})_` : ""}`);
    lines.push(med.what_is_this);
    if (med.side_effects.length > 0)
      lines.push(`⚠️ Side effects: ${med.side_effects.slice(0, 2).join(", ")}`);
    if (med.purchase_links.length > 0)
      lines.push(`🛒 Buy on: ${med.purchase_links.map((l) => l.store).join(" · ")}`);
    lines.push("");
  });
  lines.push(`_Not a substitute for medical advice. Always consult your doctor or pharmacist._`);
  return lines.join("\n");
}
