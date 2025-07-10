"use client"
import Link from "next/link"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Camera, Leaf, AlertTriangle, CheckCircle, Loader2, TrendingUp, Share2 } from "lucide-react"
import Image from "next/image"
import { trackAPICall, trackPlantAnalysis, trackUserEngagement, trackError } from "@/components/monitoring-provider"
import db, { auth } from "@/lib/firebaseConfig" 
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
import { toast } from "sonner"

interface DetectionResult {
  disease: string
  confidence: number
  severity: "Low" | "Medium" | "High"
  treatment: string[]
  prevention: string[]
  description: string
  timestamp: string
  analysisId: string
}

export default function PlantDiseaseDetector() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [analysisStats, setAnalysisStats] = useState({
    total: 0,
    success: 0,
    avgConfidence: 0,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await loadAnalysisStats(user.uid)
      } else {
        setAnalysisStats({ total: 0, success: 0, avgConfidence: 0 })
      }
    })

    trackUserEngagement("page_view", "Plant Detector", "main")

    return () => unsubscribe()
  }, [])

  const loadAnalysisStats = async (userId: string) => {
    try {
      const q = query(collection(db, "analysisResults"), where("userId", "==", userId))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        setAnalysisStats({ total: 0, success: 0, avgConfidence: 0 })
        return
      }

      const history = querySnapshot.docs.map(doc => doc.data())
      const total = history.length
      const success = history.filter(h => h.confidence > 50).length
      const avgConfidence = history.reduce((acc, h) => acc + h.confidence, 0) / total || 0
      
      setAnalysisStats({ total, success, avgConfidence })
    } catch (error) {
      console.error("Error loading analysis stats:", error)
      trackError(error instanceof Error ? error : new Error('Failed to load analysis stats'), "firebase_load_stats")
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      trackUserEngagement("image_upload", "Plant Detector", file.type)

      if (file.size > 10 * 1024 * 1024) {
        const error = new Error("Image size must be less than 10MB")
        setError(error.message)
        trackError(error, "file_size_validation")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setResult(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError(null)
    const startTime = Date.now()

    try {
      trackUserEngagement("analysis_start", "Plant Detector", "ai_detection")

      const response = await fetch("/api/analyze-plant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: selectedImage,
          userId: auth.currentUser?.uid,
        }),
      })

      const analysisTime = Date.now() - startTime

      if (!response.ok) {
        throw new Error(`Analysis failed with status ${response.status}`)
      }

      const data = await response.json()
      setResult(data)

      trackAPICall("/api/analyze-plant", analysisTime, true)
      trackPlantAnalysis(true, data.disease, data.confidence, analysisTime)

      if (auth.currentUser) {
        await saveAnalysis({
          disease: data.disease,
          confidence: data.confidence,
          severity: data.severity,
          image: selectedImage
        })
        await loadAnalysisStats(auth.currentUser.uid)
      }
    } catch (err) {
      const analysisTime = Date.now() - startTime
      const error = err instanceof Error ? err : new Error("Unknown analysis error")

      setError("Failed to analyze image. Please try again.")

      trackError(error, "plant_analysis")
      trackAPICall("/api/analyze-plant", analysisTime, false, error.message)
      trackPlantAnalysis(false, "unknown", 0, analysisTime)

      console.error("Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const saveAnalysis = async (result: {
    disease: string
    confidence: number
    severity: string
    image?: string
  }) => {
    try {
      const user = auth.currentUser
      if (!user) return

      await addDoc(collection(db, "analysisResults"), {
        userId: user.uid,
        disease: result.disease,
        confidence: result.confidence,
        severity: result.severity,
        timestamp: serverTimestamp(),
        image: result.image || ""
      })
    } catch (error) {
      console.error("Error saving analysis:", error)
      trackError(error instanceof Error ? error : new Error('Failed to save analysis'), "firebase_save_analysis")
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "text-green-700 bg-green-100 border-green-200"
      case "Medium":
        return "text-yellow-700 bg-yellow-100 border-yellow-200"
      case "High":
        return "text-red-700 bg-red-100 border-red-200"
      default:
        return "text-gray-700 bg-gray-100 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Low":
        return <CheckCircle className="w-4 h-4" />
      case "Medium":
        return <AlertTriangle className="w-4 h-4" />
      case "High":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const shareResults = async () => {
    if (!result) return

    try {
      const shareData = {
        title: `Plant Disease Detection Results`,
        text: `My plant has ${result.disease} (${result.confidence}% confidence). Severity: ${result.severity}. Treatment: ${result.treatment[0]}`,
        url: window.location.href,
      }

      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.text)
        toast.success("Results copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast.error("Failed to share results")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stats Bar */}
      {auth.currentUser && analysisStats.total > 0 && (
        <Card className="bg-white/90 backdrop-blur-md border border-white/20 shadow-xl">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-black text-blue-600">{analysisStats.total}</div>
                <div className="text-sm text-blue-500 font-medium">Total Analyses</div>
              </div>
              <div>
                <div className="text-2xl font-black text-green-600">{analysisStats.success}</div>
                <div className="text-sm text-green-500 font-medium">Successful</div>
              </div>
              <div>
                <div className="text-2xl font-black text-purple-600">{analysisStats.avgConfidence.toFixed(0)}%</div>
                <div className="text-sm text-purple-500 font-medium">Avg Confidence</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Section */}
      <Card className="border-2 border-dashed border-white/30 bg-white/90 backdrop-blur-md shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 text-2xl font-black">
            <Camera className="w-7 h-7" />
            AI-Powered Plant Disease Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            {selectedImage ? (
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-green-200/50 to-emerald-200/50 rounded-xl blur-xl"></div>
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt="Selected plant"
                  width={400}
                  height={300}
                  className="relative rounded-xl object-cover w-full h-64 border-2 border-green-300 shadow-2xl"
                />
                <Button
                  onClick={() => {
                    fileInputRef.current?.click()
                    trackUserEngagement("change_image", "Plant Detector", "reselect")
                  }}
                  variant="outline"
                  className="mt-4 border-green-300 text-green-700 hover:bg-green-50 font-semibold"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Different Image
                </Button>
              </div>
            ) : (
              <div
                onClick={() => {
                  fileInputRef.current?.click()
                  trackUserEngagement("upload_click", "Plant Detector", "initial")
                }}
                className="cursor-pointer p-12 border-2 border-dashed border-green-300 rounded-xl hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 shadow-inner"
              >
                <Upload className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <p className="text-green-700 font-bold text-lg">Click to upload plant image</p>
                <p className="text-green-600 text-sm mt-2 font-medium">Supports JPG, PNG, WebP (max 10MB)</p>
                <p className="text-green-500 text-xs mt-1">Best results: Clear, well-lit photos of affected leaves</p>
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

            {selectedImage && (
              <Button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Leaf className="w-5 h-5 mr-2" />
                    Analyze Plant Health
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <p className="font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {result && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Disease Information */}
          <Card className="bg-white/90 backdrop-blur-md border border-white/20 shadow-2xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-green-700 text-xl font-black">
                  <Leaf className="w-6 h-6" />
                  AI Detection Results
                </CardTitle>
                <Button
                  onClick={shareResults}
                  variant="outline"
                  size="sm"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-black text-2xl text-gray-800">{result.disease}</h3>
                <p className="text-gray-600 text-sm mt-1 font-medium">{result.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 font-medium">AI Confidence:</span>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{result.confidence}%</span>
                </div>

                <div>
                  <span className="text-sm text-gray-600 font-medium">Severity Level:</span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border ${getSeverityColor(result.severity)}`}
                    >
                      {getSeverityIcon(result.severity)}
                      {result.severity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 font-medium">
                Analysis ID: {result.analysisId} • {new Date(result.timestamp).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {/* Treatment Recommendations */}
          <Card className="bg-white/90 backdrop-blur-md border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 text-xl font-black">
                <CheckCircle className="w-6 h-6" />
                Expert Treatment Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                  💊 Immediate Treatment Steps:
                </h4>
                <ul className="space-y-2">
                  {result.treatment.map((step, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2 font-medium">
                      <span className="text-green-600 font-black min-w-[20px]">{index + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                  🛡️ Prevention for Future:
                </h4>
                <ul className="space-y-2">
                  {result.prevention.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2 font-medium">
                      <span className="text-blue-600 min-w-[8px]">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feature Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Link href="/ai-features">
          <Card className="bg-white/80 border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <Camera className="w-10 h-10 mx-auto text-green-600 mb-3" />
              <h3 className="font-black text-green-800 text-lg">AI-Powered Analysis</h3>
              <p className="text-sm text-green-600 mt-1 font-medium">Advanced ML models detect 30+ diseases</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/monitoring">
          <Card className="bg-white/80 border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-10 h-10 mx-auto text-blue-600 mb-3" />
              <h3 className="font-black text-blue-800 text-lg">Real-time Monitoring</h3>
              <p className="text-sm text-blue-600 mt-1 font-medium">Track performance with advanced analytics</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/expert-tips">
          <Card className="bg-white/80 border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-10 h-10 mx-auto text-purple-600 mb-3" />
              <h3 className="font-black text-purple-800 text-lg">Expert Recommendations</h3>
              <p className="text-sm text-purple-600 mt-1 font-medium">Curated treatment plans from specialists</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}