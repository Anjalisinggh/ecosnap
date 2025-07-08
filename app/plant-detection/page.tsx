"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export default function PlantDetectionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg")
        setSelectedImage(imageData)
        stopCamera()
        analyzeImage()
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setIsCameraActive(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        analyzeImage()
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setAnalysisResult({
      plantName: "Monstera Deliciosa",
      commonName: "Swiss Cheese Plant",
      confidence: 94,
      health: "Good",
      recommendations: [
        "Water when top inch of soil is dry",
        "Provide bright, indirect light",
        "Maintain humidity above 50%",
        "Fertilize monthly during growing season",
      ],
      issues: ["Slight yellowing on lower leaves - normal aging"],
      nextCare: "Water in 2-3 days",
    })
    setIsAnalyzing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Plant Detection</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Camera/Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Capture or Upload Plant Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedImage && !isCameraActive && (
                <div className="space-y-4">
                  <Button onClick={startCamera} className="w-full" size="lg">
                    <Camera className="w-5 h-5 mr-2" />
                    Use Camera
                  </Button>

                  <div className="text-center text-gray-500">or</div>

                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full" size="lg">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Image
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {isCameraActive && (
                <div className="space-y-4">
                  <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                  <div className="flex gap-2">
                    <Button onClick={capturePhoto} className="flex-1">
                      <Camera className="w-4 h-4 mr-2" />
                      Capture
                    </Button>
                    <Button onClick={stopCamera} variant="outline">
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
                      className="w-full rounded-lg object-cover"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedImage(null)
                      setAnalysisResult(null)
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Take Another Photo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedImage && (
                <div className="text-center text-gray-500 py-8">Take a photo or upload an image to get started</div>
              )}

              {isAnalyzing && (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
                  <p className="text-gray-600">Analyzing your plant...</p>
                </div>
              )}

              {analysisResult && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-600">Analysis Complete</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{analysisResult.plantName}</h3>
                    <p className="text-gray-600">{analysisResult.commonName}</p>
                    <Badge variant="outline" className="mt-2">
                      {analysisResult.confidence}% confidence
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Health Status</h4>
                    <Badge className="bg-green-100 text-green-800">{analysisResult.health}</Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Care Recommendations</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {analysisResult.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Next Care Action</h4>
                    <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">{analysisResult.nextCare}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
