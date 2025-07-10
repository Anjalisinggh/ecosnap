"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth"
import { 
  collection, query, where, getDocs, orderBy, setDoc, doc, getDoc 
} from "firebase/firestore"

import db, { auth } from "@/lib/firebaseConfig"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { History, User, Calendar, TrendingUp, Leaf, UserPlus } from "lucide-react"

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

interface UserProfile {
  email: string
  name: string
  createdAt?: string
}

export default function UserDashboard() {
  const [user, setUser] = useState<{ email: string; uid: string } | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [history, setHistory] = useState<AnalysisHistory[]>([])
  const [stats, setStats] = useState<UserStats>({
    totalAnalyses: 0,
    healthyPlants: 0,
    diseasesDetected: 0,
    lastAnalysis: ""
  })
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [form, setForm] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "",
    name: ""  // Added name field
  })
  const [isSignIn, setIsSignIn] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  const fetchUserHistory = async (userId: string) => {
    const q = query(
      collection(db, "analysisResults"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    )
    const querySnapshot = await getDocs(q)
    const results: AnalysisHistory[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      results.push({
        id: doc.id,
        disease: data.disease,
        confidence: data.confidence,
        severity: data.severity,
        timestamp: data.timestamp?.toDate().toISOString() || "",
        image: data.image || ""
      })
    })

    setHistory(results)
    calculateStats(results)
  }

  const fetchUserProfile = async (uid: string) => {
    const docSnap = await getDoc(doc(db, "users", uid))
    if (docSnap.exists()) {
      setUserProfile(docSnap.data() as UserProfile)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid
        setUser({ email: firebaseUser.email || "", uid })
        setIsSignedIn(true)
        fetchUserHistory(uid)
        fetchUserProfile(uid)
      } else {
        setUser(null)
        setUserProfile(null)
        setIsSignedIn(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const calculateStats = (historyData: AnalysisHistory[]) => {
    const totalAnalyses = historyData.length
    const healthyPlants = historyData.filter((h) => h.disease.toLowerCase().includes("healthy")).length
    const diseasesDetected = totalAnalyses - healthyPlants
    const lastAnalysis = historyData.length > 0 ? historyData[0].timestamp : ""

    setStats({ totalAnalyses, healthyPlants, diseasesDetected, lastAnalysis })
  }

  const handleSubmit = async () => {
    setError("")
    if (!form.email || !form.password) {
      setError("Email and password are required.")
      return
    }
    if (!isSignIn && form.password !== form.confirmPassword) {
      setError("Passwords do not match!")
      return
    }
    if (!isSignIn && !form.name) {
      setError("Name is required for sign up")
      return
    }
    try {
      if (isSignIn) {
        await signInWithEmailAndPassword(auth, form.email, form.password)
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password)
        const newUser = userCredential.user
        await setDoc(doc(db, "users", newUser.uid), {
          email: newUser.email,
          name: form.name,
          createdAt: new Date()
        })
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleSignOut = async () => {
    await signOut(auth)
    localStorage.removeItem("ecosnap-history")
    setHistory([])
    setStats({ totalAnalyses: 0, healthyPlants: 0, diseasesDetected: 0, lastAnalysis: "" })
  }

  if (!isSignedIn) {
    return (
      <Card className="max-w-md mx-auto mt-10 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            {isSignIn ? <User className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
            {isSignIn ? "Sign In to EcoSnap" : "Sign Up for EcoSnap"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSignIn && (
            <Input 
              type="text" 
              placeholder="Full Name" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
            />
          )}
          <Input 
            type="email" 
            placeholder="Email" 
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={form.password} 
            onChange={(e) => setForm({ ...form, password: e.target.value })} 
          />
          {!isSignIn && (
            <Input 
              type="password" 
              placeholder="Confirm Password" 
              value={form.confirmPassword} 
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} 
            />
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
          <p className="text-sm text-center text-gray-600">
            {isSignIn ? (
              <>Don't have an account? <button onClick={() => setIsSignIn(false)} className="text-green-700 hover:underline">Sign up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setIsSignIn(true)} className="text-green-700 hover:underline">Sign in</button></>
            )}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <User className="w-6 h-6" /> Welcome back, 
              </CardTitle>
              <h1 className="text-green-700 mt-1">{userProfile?.name}!</h1>
            </div>
            <Button variant="outline" onClick={handleSignOut} size="sm">Sign Out</Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-4 gap-4">
        {[{
          icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
          value: stats.totalAnalyses,
          label: "Total Analyses"
        }, {
          icon: <Leaf className="w-8 h-8 text-green-600" />,
          value: stats.healthyPlants,
          label: "Healthy Plants"
        }, {
          icon: <History className="w-8 h-8 text-orange-600" />,
          value: stats.diseasesDetected,
          label: "Diseases Found"
        }, {
          icon: <Calendar className="w-8 h-8 text-purple-600" />,
          value: stats.lastAnalysis ? new Date(stats.lastAnalysis).toLocaleDateString() : "Never",
          label: "Last Analysis"
        }].map((item, idx) => (
          <Card key={idx} className="bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                {item.icon}
                <div>
                  <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                  <p className="text-sm text-gray-600">{item.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <History className="w-6 h-6" /> Analysis History
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    analysis.severity === "Low"
                      ? "bg-green-100 text-green-800"
                      : analysis.severity === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
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