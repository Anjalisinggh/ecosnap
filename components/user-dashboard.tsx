"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { History, User, Calendar, TrendingUp, Leaf } from "lucide-react"
import { Auth } from "firebase/auth"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth"
import { getAuth } from "firebase/auth"

interface AnalysisHistory {
  id: string
  disease: string
  confidence: number
  severity: string
  timestamp: string
  image?: string
}

interface UserStats {
  totalAnalyses: number
  healthyPlants: number
  diseasesDetected: number
  lastAnalysis: string
}

export default function UserDashboard() {
  const auth = getAuth();
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [history, setHistory] = useState<AnalysisHistory[]>([])
  const [stats, setStats] = useState<UserStats>({
    totalAnalyses: 0,
    healthyPlants: 0,
    diseasesDetected: 0,
    lastAnalysis: "",
  })
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [signInForm, setSignInForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ email: firebaseUser.email || "" })
        setIsSignedIn(true)
      } else {
        setUser(null)
        setIsSignedIn(false)
      }
    })

    const savedHistory = localStorage.getItem("ecosnap-history")
    if (savedHistory) {
      const historyData = JSON.parse(savedHistory)
      setHistory(historyData)
      calculateStats(historyData)
    }

    return () => unsubscribe()
  }, [])

  const calculateStats = (historyData: AnalysisHistory[]) => {
    const totalAnalyses = historyData.length
    const healthyPlants = historyData.filter((h) => h.disease.toLowerCase().includes("healthy")).length
    const diseasesDetected = totalAnalyses - healthyPlants
    const lastAnalysis = historyData.length > 0 ? historyData[0].timestamp : ""

    setStats({
      totalAnalyses,
      healthyPlants,
      diseasesDetected,
      lastAnalysis,
    })
  }

  const handleSignIn = async () => {
    const { email, password } = signInForm
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setError("")
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        try {
          await createUserWithEmailAndPassword(auth, email, password)
          setError("")
        } catch (createError: any) {
          setError(createError.message)
        }
      } else {
        setError(err.message)
      }
    }
  }

  const handleSignOut = async () => {
    await signOut(auth)
    localStorage.removeItem("ecosnap-history")
    setHistory([])
    setStats({ totalAnalyses: 0, healthyPlants: 0, diseasesDetected: 0, lastAnalysis: "" })
  }

  const addToHistory = (analysis: Omit<AnalysisHistory, "id">) => {
    const newAnalysis = { ...analysis, id: Date.now().toString() }
    const updatedHistory = [newAnalysis, ...history].slice(0, 50)
    setHistory(updatedHistory)
    localStorage.setItem("ecosnap-history", JSON.stringify(updatedHistory))
    calculateStats(updatedHistory)
  }

  if (!isSignedIn) {
    return (
      <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <User className="w-6 h-6" />
            Sign In to EcoSnap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              value={signInForm.email}
              onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <Input
              type="password"
              value={signInForm.password}
              onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleSignIn} className="w-full bg-green-600 hover:bg-green-700">
            Sign In / Sign Up
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <User className="w-6 h-6" />
              Welcome back!
            </CardTitle>
            <Button variant="outline" onClick={handleSignOut} size="sm">
              Sign Out
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-green-700">{user?.email}</p>
        </CardContent>
      </Card>

      {/* Stats Dashboard */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalAnalyses}</p>
                <p className="text-sm text-gray-600">Total Analyses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.healthyPlants}</p>
                <p className="text-sm text-gray-600">Healthy Plants</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <History className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.diseasesDetected}</p>
                <p className="text-sm text-gray-600">Diseases Found</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm font-bold text-gray-800">
                  {stats.lastAnalysis ? new Date(stats.lastAnalysis).toLocaleDateString() : "Never"}
                </p>
                <p className="text-sm text-gray-600">Last Analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis History */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <History className="w-6 h-6" />
            Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No analyses yet. Upload your first plant image!</p>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 10).map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">{analysis.disease}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(analysis.timestamp).toLocaleDateString()} • {analysis.confidence}% confidence
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      analysis.severity === "Low"
                        ? "bg-green-100 text-green-800"
                        : analysis.severity === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {analysis.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
