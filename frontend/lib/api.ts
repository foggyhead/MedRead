const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to scan medicine");
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
