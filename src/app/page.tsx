'use client';

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// ✅ Hugging Face API setup
const HUGGING_FACE_API_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN!;
const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification";

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);

  const diagnosePlant = async (file: File) => {
    setLoading(true);
    setDiagnosis(null);
    try {
      const res = await fetch(MODEL_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}`,
          "Content-Type": "application/octet-stream",
        },
        body: file,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("API Error:", text);
        alert("❌ Hugging Face API error. See console.");
        return;
      }

      const predictions = await res.json();
      console.log("Predictions:", predictions);

      const top = predictions[0];
      setDiagnosis({
        name: top.label,
        confidence: (top.score * 100).toFixed(2) + "%"
      });
    } catch (error) {
      console.error("Diagnosis failed:", error);
      alert("⚠️ Could not connect to Hugging Face API.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const now = Date.now();
    if (now - lastRequestTime < 5000) {
      alert("Please wait a few seconds before uploading again.");
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setLastRequestTime(now);
      await diagnosePlant(file);
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-between px-6 sm:px-20 py-12 font-[var(--font-geist-sans)] overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle, #4e7758, #6e936d, #90af84, #b3cc9b, #d8e9b3)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md z-0" />

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl font-bold mb-4 text-[#2e4d3b]">
            Welcome to EcoSnap 🤍
          </h1>
          <p className="text-lg text-[#2e4d3b]/80 mb-12">
            Diagnose plant diseases instantly using Hugging Face AI.
          </p>
        </div>

        <div className="flex-1 grid place-items-center w-full">
          <div className="flex flex-col-reverse lg:flex-row gap-16 items-center w-full max-w-6xl">
            {/* Upload Section */}
            <div className="flex flex-col gap-6 max-w-xl text-center lg:text-left items-center lg:items-start">
              <motion.h2
                className="text-3xl sm:text-4xl font-bold"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Diagnose Plant Diseases with AI 🌿
              </motion.h2>

              <p className="text-lg text-[#070807]">
                Upload a plant leaf photo to get AI-powered diagnosis.
              </p>

              <motion.label
                htmlFor="fileInput"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-6 py-3 bg-[#a8c3a1] text-[#1e2b20] font-medium rounded-xl cursor-pointer shadow-md transition"
              >
                Upload Plant Photo
              </motion.label>

              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {preview && (
                <motion.div
                  className="mt-4 rounded-xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Image
                    src={preview}
                    alt="Plant Preview"
                    width={300}
                    height={300}
                    style={{ height: "auto" }}
                    className="object-cover rounded-xl"
                  />
                </motion.div>
              )}

              {loading && (
                <p className="text-green-800 mt-4">🌿 Analyzing image... Please wait</p>
              )}

              {diagnosis && (
                <div className="bg-white/50 p-4 rounded-xl shadow mt-4 text-left">
                  <h3 className="text-xl font-semibold text-[#2e4d3b]">
                    Predicted Disease: {diagnosis.name}
                  </h3>
                  <p className="text-sm mt-2 text-gray-800">
                    Confidence: {diagnosis.confidence}
                  </p>
                </div>
              )}
            </div>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-[300px] sm:w-[400px] flex-shrink-0"
            >
              <Image
                src="/plant.png"
                alt="Plant Illustration"
                width={400}
                height={400}
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>

        <footer className="text-sm text-[#000000] text-center mt-12">
          Made with 🤍 by Anjali
        </footer>
      </div>
    </div>
  );
}
