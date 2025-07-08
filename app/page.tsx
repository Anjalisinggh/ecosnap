"use client"
import { useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PlantDiseaseDetector from "@/components/plant-disease-detector"
import PlantCareTips from "@/components/plant-care-tips"
import UserDashboard from "@/components/user-dashboard"
import SystemStatus from "@/components/system-status"
import { Leaf, Camera, BookOpen, User, Activity } from "lucide-react"
import { trackUserEngagement } from "@/components/monitoring-provider"

export default function Home() {
  useEffect(() => {
    // Track page view
    trackUserEngagement("page_view", "Home", "landing")
  }, [])

  const handleTabChange = (value: string) => {
    trackUserEngagement("tab_change", "Navigation", value)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 relative overflow-hidden">
      {/* Cute Animated Background */}
      
      {/* <div className="absolute bottom-48 right-20 text-purple-400 text-lg animate-pulse delay-200">🦋</div>*/}

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 max-w-4xl mx-auto">
           <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-6 tracking-tight leading-tight" style={{ fontFamily: 'Elora' }}>
  Eco Snap
</h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed mb-6">
              AI-powered plant disease detection with{" "}
              <span className="text-emerald-600 font-bold">real-time monitoring</span> and{" "}
              <span className="text-teal-600 font-bold">expert recommendations</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 mb-8">
              <span className="flex items-center gap-2 bg-green-100 rounded-full px-4 py-2 border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                AI Powered
              </span>
              <span className="flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Real-time Monitoring
              </span>
              <span className="flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 border border-purple-200">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                Expert Care Tips
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  (document.querySelector('[value="detector"]') as HTMLElement | null)?.click()
                  trackUserEngagement("cta_click", "Hero", "start_detection")
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Start Plant Detection
              </button>
             <a
  href="https://www.smartgardener.com/home/selecting_plants" 
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => {
    (document.querySelector('[value="care"]') as HTMLElement | null)?.click()
    trackUserEngagement("cta_click", "Hero", "learn_care")
  }}
>
  <button
    className="bg-white/80 hover:bg-white text-gray-700 font-bold py-4 px-8 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
  >
    <BookOpen className="w-5 h-5" />
    Learn Plant Care
  </button>
</a>

            </div>
          </div>
        </div>

        <Tabs defaultValue="detector" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/80 backdrop-blur-sm border border-pink-200 shadow-lg">
            <TabsTrigger
              value="detector"
              className="flex items-center gap-2 font-semibold data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">AI Detection</span>
              <span className="sm:hidden">Detect</span>
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 font-semibold data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="care"
              className="flex items-center gap-2 font-semibold data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Plant Care</span>
              <span className="sm:hidden">Care</span>
            </TabsTrigger>
            <TabsTrigger
              value="status"
              className="flex items-center gap-2 font-semibold data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700"
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">System Status</span>
              <span className="sm:hidden">Status</span>
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="flex items-center gap-2 font-semibold data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700"
            >
              <Leaf className="w-4 h-4" />
              <span className="hidden sm:inline">About</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detector">
            <PlantDiseaseDetector />
          </TabsContent>

          <TabsContent value="dashboard">
            <UserDashboard />
          </TabsContent>

          <TabsContent value="care">
            <PlantCareTips />
          </TabsContent>

          <TabsContent value="status">
            <SystemStatus />
          </TabsContent>

          <TabsContent value="about">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center">
                <h2 className="text-4xl font-black text-gray-800 mb-4">About EcoSnap</h2>
                <p className="text-xl text-gray-600 mb-8 font-medium">
                  Advanced AI technology meets plant care expertise with comprehensive monitoring
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-green-700 mb-3">🤖 AI-Powered Detection</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our advanced machine learning models, powered by Hugging Face AI, can identify over 30 common plant
                    diseases with high accuracy. Real-time monitoring ensures optimal performance.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-blue-700 mb-3">📊 Smart Analytics</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Track your plant health journey with detailed analysis history, performance metrics, and
                    personalized insights powered by Google Analytics and Web Vitals.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-purple-700 mb-3">💊 Expert Treatment Plans</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Get expert-curated treatment recommendations and prevention tips for each detected disease, with
                    success tracking and error monitoring.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-pink-700 mb-3">🔍 Real-time Monitoring</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Advanced monitoring with error tracking, Web Vitals performance monitoring, and uptime tracking
                    ensures the best user experience.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-8 border border-pink-200 text-center shadow-lg">
                <h3 className="text-3xl font-black text-gray-800 mb-3">🌱 Join the EcoSnap Community</h3>
                <p className="text-gray-700 text-lg font-medium">
                  Help us improve plant disease detection with comprehensive monitoring and analytics.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
