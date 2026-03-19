"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  X,
  Loader2,
  ImageIcon,
  Sparkles,
} from "lucide-react";
import { scanMedicine, MedicineResult } from "@/lib/api";
import ResultCard from "./ResultCard";
import LanguageToggle from "./LanguageToggle";

const LOADING_MESSAGES = [
  "Reading label...",
  "Understanding ingredients...",
  "Translating to plain language...",
  "Almost there...",
];

export default function Scanner() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [result, setResult] = useState<MedicineResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<string>("en");
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cycle loading messages
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsg((m) => (m + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  // Attach stream to video element
  useEffect(() => {
    if (showCamera && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [showCamera, cameraStream]);

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) {
      setError("File is too large. Max 10MB.");
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (!allowed.includes(f.type) && !f.name.endsWith(".heic")) {
      setError("Please upload a JPG, PNG, WEBP, or HEIC image.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setCameraStream(stream);
      setShowCamera(true);
    } catch {
      setError("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    cameraStream?.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const f = new File([blob], "capture.jpg", { type: "image/jpeg" });
      handleFile(f);
      stopCamera();
    }, "image/jpeg");
  };

  const handleScan = async () => {
    if (!file || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setLoadingMsg(0);
    try {
      const res = await scanMedicine(file, lang);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLangChange = async (newLang: string) => {
    setLang(newLang);
    if (file && result) {
      setLoading(true);
      setResult(null);
      setLoadingMsg(0);
      try {
        const res = await scanMedicine(file, newLang);
        setResult(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to translate.");
      } finally {
        setLoading(false);
      }
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Language Toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#888888]">Upload a medicine photo to get started</p>
        <LanguageToggle lang={lang} onChange={handleLangChange} loading={loading} />
      </div>

      {/* Camera View */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden bg-black border border-[#2a2a2a]"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-h-80 object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-3 bg-gradient-to-t from-black/80 to-transparent">
              <button
                onClick={stopCamera}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                className="flex-1 py-2.5 rounded-xl bg-[#7c6af7] text-white text-sm font-medium hover:bg-[#6b5de6] transition-colors"
              >
                Capture
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Zone */}
      {!showCamera && (
        <div>
          {!preview ? (
            <motion.div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              animate={{ scale: dragging ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all p-10 text-center ${
                dragging
                  ? "border-[#7c6af7] bg-[#7c6af7]/10"
                  : "border-[#2a2a2a] hover:border-[#7c6af7]/40 hover:bg-[#7c6af7]/5"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,.heic"
                onChange={handleInputChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#7c6af7]/15 flex items-center justify-center">
                  <ImageIcon className="w-7 h-7 text-[#7c6af7]" />
                </div>
                <div>
                  <p className="text-[#f0f0f0] font-medium">
                    Drop your medicine photo here
                  </p>
                  <p className="text-sm text-[#888888] mt-1">
                    or click to browse — JPG, PNG, WEBP, HEIC up to 10MB
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#111111]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Medicine preview"
                className="w-full max-h-72 object-contain"
              />
              <button
                onClick={reset}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Camera button (only when no preview) */}
      {!preview && !showCamera && (
        <button
          onClick={startCamera}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#2a2a2a] text-[#888888] hover:text-[#f0f0f0] hover:border-[#7c6af7]/40 transition-all text-sm font-medium"
        >
          <Camera className="w-4 h-4" />
          Use Camera
        </button>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 py-3 rounded-xl bg-[#f87171]/10 border border-[#f87171]/25 text-[#f87171] text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan Button */}
      {file && !showCamera && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleScan}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-3 ${
            loading
              ? "bg-[#7c6af7]/50 cursor-not-allowed"
              : "bg-[#7c6af7] hover:bg-[#6b5de6] animate-breathe"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{LOADING_MESSAGES[loadingMsg]}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Explain This Medicine
            </>
          )}
        </motion.button>
      )}

      {/* Loading pulse behind button */}
      {loading && (
        <div className="flex justify-center gap-1 pt-1">
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultCard result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
