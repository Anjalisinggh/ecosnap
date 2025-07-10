"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Camera, Upload, Loader2, Leaf, Heart, Sparkles, ChevronRight, Bookmark, Share2 } from "lucide-react"
import Image from "next/image"
import db, { auth } from "@/lib/firebaseConfig"
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
import { toast } from "sonner"

interface DetectionResult {
  plantName: string
  confidence: number
  disease?: string
  careInstructions: string[]
  healthStatus: string
  growthStage: string
  timestamp?: string
  imageUrl?: string
}

export default function PlantDetection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isCameraLoading, setIsCameraLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<DetectionResult | null>(null)
  const [history, setHistory] = useState<DetectionResult[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Check if API key is available
  if (!process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY) {
    console.error("Hugging Face API key is missing")
  }

  // Load user's history from Firebase
  useEffect(() => {
    const fetchHistory = async () => {
      if (auth.currentUser) {
        try {
          const q = query(collection(db, "plantAnalyses"), where("userId", "==", auth.currentUser.uid))
          const querySnapshot = await getDocs(q)
          const userHistory = querySnapshot.docs.map(doc => {
            const data = doc.data() as DetectionResult
            return {
              ...data,
              id: doc.id // Include document ID for reference
            }
          })
          setHistory(userHistory)
        } catch (error) {
          console.error("Error fetching history:", error)
          toast.error("Failed to load history")
        }
      }
    }

    fetchHistory()
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.match('image.*')) {
        toast.error('Please upload an image file (JPEG, PNG)')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
        analyzeImage(result)
      }
      reader.onerror = () => {
        toast.error('Failed to read image file')
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    setIsCameraLoading(true)
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera API not supported in this browser")
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
        }
        setIsCameraActive(true)
      }
    } catch (error) {
      console.error("Camera Error:", error)
      toast.error(`Camera Error: ${error instanceof Error ? error.message : 'Unable to access camera'}`)
      setIsCameraActive(false)
    } finally {
      setIsCameraLoading(false)
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

        const stream = video.srcObject as MediaStream
        stream?.getTracks().forEach((track) => track.stop())
        setIsCameraActive(false)
      }
    }
  }

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    toast.info('Analyzing your plant...', { duration: 2000 })

    try {
      // Mock data for testing - comment this out for real API calls
      await new Promise(resolve => setTimeout(resolve, 1500))
      const mockResult: DetectionResult = {
        plantName: "Monstera Deliciosa",
        confidence: 92,
        disease: "No disease detected",
        careInstructions: [
          "Bright, indirect light",
          "Water when top 2 inches of soil are dry",
          "Prefers 60-80% humidity"
        ],
        healthStatus: "Healthy",
        growthStage: "Mature",
        imageUrl: imageData
      }
      setAnalysisResult(mockResult)
      return

    } catch (error) {
      console.error("Analysis error:", error)
      toast.error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setSelectedImage(null)
    setAnalysisResult(null)
    setIsAnalyzing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      setIsCameraActive(false)
    }
  }

  const saveToCollection = async () => {
    if (!analysisResult) return
    
    setIsSaving(true)
    try {
      if (!auth.currentUser) {
        toast.error("Please sign in to save to your collection")
        return
      }
      
      await addDoc(collection(db, "savedPlants"), {
        userId: auth.currentUser.uid,
        ...analysisResult,
        savedAt: serverTimestamp()
      })
      toast.success("Saved to your collection!")
    } catch (error) {
      console.error("Error saving to collection:", error)
      toast.error("Failed to save to collection")
    } finally {
      setIsSaving(false)
    }
  }

  const shareResults = async () => {
    if (!analysisResult) return

    try {
      const shareData = {
        title: `My ${analysisResult.plantName} Analysis`,
        text: `I just analyzed my ${analysisResult.plantName} using EcoSnap! Health: ${analysisResult.healthStatus}, Confidence: ${analysisResult.confidence}%`,
        url: window.location.href,
      }

      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(shareData.text)
        toast.success("Results copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast.error("Failed to share results")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 md:mb-8">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to EcoSnap
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Eco Snap
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Section - Image Capture/Upload */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-6">
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
                      disabled={isCameraLoading}
                      className="w-full max-w-xs bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {isCameraLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Starting Camera...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5 mr-2" />
                          Use Camera
                        </>
                      )}
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
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full rounded-2xl shadow-lg aspect-video object-cover bg-black"
                  />
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
                  <div className="relative rounded-2xl overflow-hidden aspect-square">
                    <Image
                      src={selectedImage}
                      alt="Selected plant"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover shadow-lg"
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

              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>

          {/* Right Section - Analysis Results */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-6">
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
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-emerald-900">{analysisResult.plantName}</h3>
                            {analysisResult.disease && (
                              <p className="text-sm text-emerald-700">{analysisResult.disease}</p>
                            )}
                          </div>
                          <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                            {analysisResult.confidence}% confidence
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <p className="text-sm text-emerald-800">
                              <span className="font-semibold">Health:</span> {analysisResult.healthStatus}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <p className="text-sm text-emerald-800">
                              <span className="font-semibold">Growth Stage:</span> {analysisResult.growthStage}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3">
                          <h4 className="font-semibold text-emerald-900 mb-2">Care Instructions</h4>
                          <ul className="space-y-2">
                            {analysisResult.careInstructions.map((instruction, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-emerald-800">{instruction}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        onClick={saveToCollection}
                        disabled={isSaving}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-full shadow-lg"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-4 h-4 mr-2" />
                            Save to Collection
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={shareResults}
                        className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-full bg-transparent"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Results
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* History Section */}
              {history.length > 0 && (
                <div className="pt-6 border-t border-emerald-100">
                  <h3 className="text-sm font-semibold text-emerald-700 mb-3">Recent Analyses</h3>
                  <div className="space-y-3">
                    {history.slice(0, 3).map((item, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl cursor-pointer hover:bg-emerald-100 transition-colors"
                        onClick={() => {
                          setSelectedImage(item.imageUrl || null)
                          setAnalysisResult(item)
                        }}
                      >
                        {item.imageUrl && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <Image
                              src={item.imageUrl}
                              alt={item.plantName}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-emerald-900 truncate">{item.plantName}</p>
                          <p className="text-xs text-emerald-600">{item.healthStatus}</p>
                        </div>
                        <div className="text-xs font-bold text-emerald-700">{item.confidence}%</div>
                      </div>
                    ))}
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