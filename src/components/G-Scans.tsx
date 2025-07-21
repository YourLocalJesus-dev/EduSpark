"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";
import { useTheme } from '@/contexts/ThemeContext';

export default function ScanPage() {
  const { isDark } = useTheme();
  const [image, setImage] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const correctOcrErrors = (text: string): string => {
    const corrections: Record<string, string> = {
      "ight": "light",
      "ior": "mirror",
      "al": "all",
      "t ray": "t-ray",
      "incidet": "incident",
      "relected": "reflected",
      "deident": "deviated",
      "bes": "beam",
      "mms": "mirrors",
      "ox": "or",
      "\/": "/",
      "6,=6,": "θ = θ",
    };

    let fixedText = text;
    for (const [wrong, right] of Object.entries(corrections)) {
      const regex = new RegExp(`\\b${wrong}\\b`, "gi");
      fixedText = fixedText.replace(regex, right);
    }

    return fixedText;
  };

  const summarizeText = async (text: string) => {
    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    return data.summary || "Failed to summarize.";
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const { data } = await Tesseract.recognize(image, "eng");
      const rawText = data.text;
      const correctedText = correctOcrErrors(rawText);
      const summarized = await summarizeText(correctedText);
      setOcrText(summarized);
    } catch (err) {
      console.error("OCR or summary failed", err);
      alert("OCR or AI summarization failed.");
    } finally {
      setLoading(false);
    }
  };

  const parseText = (text: string | undefined) => {
    if (!text) return { title: "AI Notes", tag: "Summary", content: "No content available." };
    const lines = text.split("\n").filter(Boolean);
    return {
      title: lines[0] || "AI Notes",
      tag: "Summary",
      content: lines.slice(1).join(" ") || text,
    };
  };

  const note = ocrText ? parseText(ocrText) : null;

  return (
    <div className={`p-4 min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <h1 className="text-2xl font-bold mb-4">Image to AI Note</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className={`mb-4 p-2 rounded border transition-colors duration-200 ${
          isDark 
            ? 'bg-gray-800 border-gray-700 text-white file:bg-gray-700 file:text-white file:border-gray-600' 
            : 'bg-white border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-gray-300'
        } file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold hover:file:bg-opacity-80`}
      />
      
      <button
        onClick={handleScan}
        disabled={!image || loading}
        className={`px-4 py-2 rounded transition-colors duration-200 ${
          !image || loading
            ? isDark
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {loading ? "Processing..." : "Scan & Summarize"}
      </button>

      {note && (
        <div className={`mt-6 p-4 rounded-xl shadow-md w-fit transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {note.title}
            </h2>
            <span className="text-purple-400 ml-2 rounded-full px-3 py-1 text-sm bg-purple-700">
              {note.tag}
            </span>
          </div>
          <p className={`text-sm mt-2 whitespace-pre-line ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {note.content}
          </p>
          <p className={`text-xs mt-3 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {new Date().toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}