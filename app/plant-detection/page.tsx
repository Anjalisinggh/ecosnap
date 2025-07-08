"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Camera, Upload, Loader2, Leaf, Heart, Sparkles } from "lucide-react"
import Image from "next/image"

export default function PlantDetection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
        analyzeImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Unable to access camera. Please try uploading an image instead.")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (context) {
        context.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg")
        setSelectedImage(imageData)
        analyzeImage(imageData)

        // Stop camera
        const stream = video.srcObject as MediaStream
        stream?.getTracks().forEach((track) => track.stop())
        setIsCameraActive(false)
      }
    }
  }

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true)
    setAnalysisResult(null)

    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult(
        "🌿 **Monstera Deliciosa** (Swiss Cheese Plant)\n\n**Confidence:** 94%\n\n**Care Instructions:**\n• Bright, indirect light ☀️\n• Water when top soil is dry 💧\n• High humidity preferred 💨\n• Temperature: 65-80°F 🌡️\n\n**Health Status:** Healthy specimen ✨\n**Growth Stage:** Mature 🌱",
      )
      setIsAnalyzing(false)
    }, 2000)
  }

  const resetAnalysis = () => {
    setSelectedImage(null)
    setAnalysisResult(null)
    setIsAnalyzing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={resetAnalysis}
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full px-4 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Plant Detection
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Section - Image Capture/Upload */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-green-100 px-4 py-2 rounded-full mb-4">
                  <Camera className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-emerald-800">Capture or Upload Plant Image</h2>
                </div>
              </div>

              {!selectedImage && !isCameraActive && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center space-y-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-200 to-green-200 rounded-full flex items-center justify-center">
                        <Leaf className="w-10 h-10 text-emerald-600" />
                      </div>
                    </div>

                    <Button
                      onClick={startCamera}
                      size="lg"
                      className="w-full max-w-xs bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Use Camera
                    </Button>

                    <div className="flex items-center gap-3">
                      <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent flex-1"></div>
                      <span className="text-emerald-600 text-sm font-medium">or</span>
                      <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent flex-1"></div>
                    </div>

                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="lg"
                      className="w-full max-w-xs border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              )}

              {isCameraActive && (
                <div className="space-y-4">
                  <video ref={videoRef} autoPlay playsInline className="w-full rounded-2xl shadow-lg" />
                  <div className="flex gap-3">
                    <Button
                      onClick={capturePhoto}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-full shadow-lg"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Capture Photo
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const stream = videoRef.current?.srcObject as MediaStream
                        stream?.getTracks().forEach((track) => track.stop())
                        setIsCameraActive(false)
                      }}
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {selectedImage && (
                <div className="space-y-4">
                  <div className="relative">
                    <Image
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected plant"
                      width={400}
                      height={300}
                      className="w-full rounded-2xl object-cover shadow-lg"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <Heart className="w-5 h-5 text-emerald-500" />
                    </div>
                  </div>
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-full bg-transparent"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Take Another Photo
                  </Button>
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>

          {/* Right Section - Analysis Results */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-emerald-100 px-4 py-2 rounded-full mb-4">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg font-semibold text-teal-800">Analysis Results</h2>
                </div>
              </div>

              <div className="min-h-[300px] flex items-center justify-center">
                {!selectedImage && !isAnalyzing && (
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
                      <Leaf className="w-12 h-12 text-teal-500" />
                    </div>
                    <p className="text-emerald-600 font-medium">Take a photo or upload an image to get started</p>
                    <p className="text-emerald-500 text-sm">Let's discover what plant you have! 🌱</p>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-emerald-700 font-semibold">Analyzing your plant...</p>
                      <p className="text-emerald-500 text-sm">This might take a moment ✨</p>
                    </div>
                  </div>
                )}

                {analysisResult && (
                  <div className="w-full space-y-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-inner">
                      <div className="whitespace-pre-line text-sm text-emerald-800 leading-relaxed">
                        {analysisResult}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-full shadow-lg"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Save to Collection
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-full bg-transparent"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Share Results
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
