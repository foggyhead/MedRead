"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Loader2, ImageIcon, Sparkles, Search, Stethoscope } from "lucide-react";
import { scanMedicine, searchMedicine, searchBySymptoms, MedicineResult, SymptomResult } from "@/lib/api";
import ResultCard from "./ResultCard";
import SymptomResultCard from "./SymptomResultCard";
import LanguageToggle from "./LanguageToggle";

const LOADING_MESSAGES = [
  "Reading label...",
  "Understanding ingredients...",
  "Translating to plain language...",
  "Almost there...",
];

const SEARCH_LOADING_MESSAGES = [
  "Looking up medicine...",
  "Gathering information...",
  "Translating to plain language...",
  "Almost there...",
];

const SYMPTOM_LOADING_MESSAGES = [
  "Analysing your symptoms...",
  "Finding matching medicines...",
  "Checking OTC availability in India...",
  "Almost there...",
];

type Mode = "photo" | "text" | "symptoms";

export default function Scanner() {
  const [mode, setMode] = useState<Mode>("photo");

  // Photo mode state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Text mode state
  const [medicineName, setMedicineName] = useState("");

  // Symptoms mode state
  const [symptoms, setSymptoms] = useState("");
  const [symptomResult, setSymptomResult] = useState<SymptomResult | null>(null);

  // Shared state
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [result, setResult] = useState<MedicineResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<string>("en");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const messages =
    mode === "text" ? SEARCH_LOADING_MESSAGES :
    mode === "symptoms" ? SYMPTOM_LOADING_MESSAGES :
    LOADING_MESSAGES;

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => setLoadingMsg((m) => (m + 1) % messages.length), 2000);
    return () => clearInterval(interval);
  }, [loading, messages.length]);

  useEffect(() => {
    if (showCamera && cameraStream && videoRef.current) videoRef.current.srcObject = cameraStream;
  }, [showCamera, cameraStream]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setResult(null);
    setSymptomResult(null);
    setError(null);
  };

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) { setError("File is too large. Max 10MB."); return; }
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (!allowed.includes(f.type) && !f.name.endsWith(".heic")) { setError("Please upload a JPG, PNG, WEBP, or HEIC image."); return; }
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); setError(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setCameraStream(stream); setShowCamera(true);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")
          setError("Camera access denied. Please allow camera permission in your browser settings and try again.");
        else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError")
          setError("No camera found on this device. Please upload a photo instead.");
        else if (err.name === "NotReadableError")
          setError("Camera is in use by another app. Please close other apps and try again.");
        else
          setError("Could not start camera. Please try uploading a photo instead.");
      } else {
        setError("Could not start camera. Please try uploading a photo instead.");
      }
    }
  };

  const stopCamera = () => { cameraStream?.getTracks().forEach((t) => t.stop()); setCameraStream(null); setShowCamera(false); };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => { if (!blob) return; handleFile(new File([blob], "capture.jpg", { type: "image/jpeg" })); stopCamera(); }, "image/jpeg");
  };

  const handlePhotoScan = async () => {
    if (!file || loading) return;
    setLoading(true); setResult(null); setError(null); setLoadingMsg(0);
    try { setResult(await scanMedicine(file, lang)); }
    catch (err) { setError(err instanceof Error ? err.message : "Something went wrong."); }
    finally { setLoading(false); }
  };

  const handleTextSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!medicineName.trim() || loading) return;
    setLoading(true); setResult(null); setError(null); setLoadingMsg(0);
    try { setResult(await searchMedicine(medicineName.trim(), lang)); }
    catch (err) { setError(err instanceof Error ? err.message : "Something went wrong."); }
    finally { setLoading(false); }
  };

  const handleSymptomSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!symptoms.trim() || loading) return;
    setLoading(true); setSymptomResult(null); setError(null); setLoadingMsg(0);
    try { setSymptomResult(await searchBySymptoms(symptoms.trim(), lang)); }
    catch (err) { setError(err instanceof Error ? err.message : "Something went wrong."); }
    finally { setLoading(false); }
  };

  const handleLangChange = async (newLang: string) => {
    setLang(newLang);
    if (result) {
      setLoading(true); setResult(null); setLoadingMsg(0);
      try {
        if (mode === "photo" && file) setResult(await scanMedicine(file, newLang));
        else if (mode === "text" && medicineName.trim()) setResult(await searchMedicine(medicineName.trim(), newLang));
      } catch (err) { setError(err instanceof Error ? err.message : "Failed to translate."); }
      finally { setLoading(false); }
    }
    if (symptomResult && mode === "symptoms" && symptoms.trim()) {
      setLoading(true); setSymptomResult(null); setLoadingMsg(0);
      try { setSymptomResult(await searchBySymptoms(symptoms.trim(), newLang)); }
      catch (err) { setError(err instanceof Error ? err.message : "Failed to translate."); }
      finally { setLoading(false); }
    }
  };

  const resetPhoto = () => { setFile(null); setPreview(null); setResult(null); setError(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div className="flex rounded-2xl p-1 gap-1" style={{ background: "#071a14", border: "1px solid #163d32" }}>
        {([
          ["photo", ImageIcon, "Photo"],
          ["text", Search, "Search"],
          ["symptoms", Stethoscope, "Symptoms"],
        ] as const).map(([m, Icon, label]) => (
          <button key={m} onClick={() => switchMode(m)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={mode === m
              ? { background: "linear-gradient(135deg, #34d399, #22d3ee)", color: "#030d0a" }
              : { color: "#6b9e8f" }}>
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Language toggle — hide for symptoms (AI handles language internally) */}
      <div className="space-y-2">
        <p className="text-sm" style={{ color: "#6b9e8f" }}>Choose your language</p>
        <LanguageToggle lang={lang} onChange={handleLangChange} loading={loading} />
      </div>

      <AnimatePresence mode="wait">

        {/* TEXT MODE */}
        {mode === "text" && (
          <motion.div key="text" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <form onSubmit={handleTextSearch} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6b9e8f" }} />
                <input
                  type="text"
                  value={medicineName}
                  onChange={(e) => { setMedicineName(e.target.value); setResult(null); setError(null); }}
                  placeholder="e.g. Paracetamol, Dolo 650, Metformin..."
                  className="w-full pl-11 pr-4 py-4 rounded-2xl text-base focus:outline-none transition-all"
                  style={{ background: "#0c2620", border: "1px solid #163d32", color: "#ecfdf5" }}
                  disabled={loading}
                  autoFocus
                />
              </div>
              {medicineName.trim() && !loading && (
                <motion.button type="submit" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="w-full py-4 rounded-xl font-semibold text-[#030d0a] flex items-center justify-center gap-3"
                  style={{ background: "linear-gradient(135deg, #34d399, #22d3ee)", boxShadow: "0 0 36px rgba(52,211,153,0.2)" }}>
                  <Sparkles className="w-5 h-5" />
                  Explain This Medicine
                </motion.button>
              )}
            </form>
          </motion.div>
        )}

        {/* SYMPTOMS MODE */}
        {mode === "symptoms" && (
          <motion.div key="symptoms" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <form onSubmit={handleSymptomSearch} className="space-y-3">
              <div>
                <div className="relative">
                  <Stethoscope className="absolute left-4 top-4 w-4 h-4" style={{ color: "#6b9e8f" }} />
                  <textarea
                    value={symptoms}
                    onChange={(e) => { setSymptoms(e.target.value); setSymptomResult(null); setError(null); }}
                    placeholder="Describe your symptoms... e.g. headache and mild fever since morning, runny nose, body ache"
                    rows={3}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl text-base focus:outline-none transition-all resize-none"
                    style={{ background: "#0c2620", border: "1px solid #163d32", color: "#ecfdf5" }}
                    disabled={loading}
                  />
                </div>
                <p className="text-xs mt-1.5" style={{ color: "#2a5a48" }}>
                  Only over-the-counter medicines will be recommended. For serious symptoms, always see a doctor.
                </p>
              </div>
              {symptoms.trim() && !loading && (
                <motion.button type="submit" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="w-full py-4 rounded-xl font-semibold text-[#030d0a] flex items-center justify-center gap-3"
                  style={{ background: "linear-gradient(135deg, #34d399, #22d3ee)", boxShadow: "0 0 36px rgba(52,211,153,0.2)" }}>
                  <Stethoscope className="w-5 h-5" />
                  Find Medicines for My Symptoms
                </motion.button>
              )}
            </form>
          </motion.div>
        )}

        {/* PHOTO MODE */}
        {mode === "photo" && (
          <motion.div key="photo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
            {/* Camera */}
            <AnimatePresence>
              {showCamera && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid #163d32" }}>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full max-h-80 object-cover bg-black" />
                  <canvas ref={canvasRef} className="hidden" />
                  {/* Framing guide overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-4/5 h-3/5 rounded-xl"
                      style={{ border: "2px solid rgba(52,211,153,0.7)", boxShadow: "0 0 0 9999px rgba(0,0,0,0.4)" }} />
                    <p className="mt-3 text-xs font-medium px-3 py-1 rounded-full"
                      style={{ background: "rgba(0,0,0,0.65)", color: "#34d399" }}>
                      Align medicine label within frame
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-3"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                    <button onClick={stopCamera} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium"
                      style={{ border: "1px solid rgba(255,255,255,0.15)" }}>Cancel</button>
                    <button onClick={capturePhoto} className="flex-1 py-2.5 rounded-xl text-[#030d0a] text-sm font-semibold"
                      style={{ background: "linear-gradient(135deg, #34d399, #22d3ee)" }}>Capture</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showCamera && (
              !preview ? (
                <motion.div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  animate={{ scale: dragging ? 1.02 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed cursor-pointer p-12 text-center transition-all"
                  style={{ borderColor: dragging ? "#34d399" : "#163d32", background: dragging ? "rgba(52,211,153,0.05)" : "rgba(52,211,153,0.01)" }}>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,.heic"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(52,211,153,0.12)" }}>
                      <ImageIcon className="w-7 h-7" style={{ color: "#34d399" }} />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "#ecfdf5" }}>Drop your medicine photo here</p>
                      <p className="text-sm mt-1" style={{ color: "#6b9e8f" }}>or click to browse — JPG, PNG, WEBP, HEIC up to 10MB</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid #163d32", background: "#071a14" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Medicine preview" className="w-full max-h-72 object-contain" />
                  <button onClick={resetPhoto} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <X className="w-4 h-4 text-white" />
                  </button>
                </motion.div>
              )
            )}

            {!preview && !showCamera && (
              <button onClick={startCamera}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ border: "1px solid #163d32", color: "#6b9e8f" }}>
                <Camera className="w-4 h-4" />Use Camera
              </button>
            )}

            {file && !showCamera && !loading && (
              <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                onClick={handlePhotoScan}
                className="w-full py-4 rounded-xl font-semibold text-[#030d0a] flex items-center justify-center gap-3"
                style={{ background: "linear-gradient(135deg, #34d399, #22d3ee)", boxShadow: "0 0 36px rgba(52,211,153,0.2)" }}>
                <Sparkles className="w-5 h-5" />Explain This Medicine
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3"
          style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}>
          <Loader2 className="w-5 h-5 animate-spin" />
          {messages[loadingMsg]}
        </motion.div>
      )}

      {loading && <div className="flex justify-center gap-1"><span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" /></div>}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="px-4 py-3 rounded-xl text-sm"
            style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ResultCard result={result} />
          </motion.div>
        )}
        {symptomResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SymptomResultCard result={symptomResult} symptoms={symptoms} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
