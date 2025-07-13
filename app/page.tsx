"use client";

import { FaInstagram, FaTwitter, FaGithub } from "react-icons/fa"
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Leaf,
  Camera,
  BookOpen,
  User,
  Activity,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import PlantDiseaseDetector from "@/components/plant-disease-detector";
import PlantCareTips from "@/components/plant-care-tips";
import UserDashboard from "@/components/user-dashboard";
import SystemStatus from "@/components/system-status";
import { trackUserEngagement } from "@/components/monitoring-provider";

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  useEffect(() => {
    trackUserEngagement("page_view", "Home", "landing");
  }, []);

  const features = [
    {
      id: "ai-powered",
      label: "AI Powered",
      icon: Sparkles,
      color: "bg-green-100 text-green-700 border-green-200",
      description:
        "Advanced AI algorithms identify plants and provide personalized care recommendations",
    },
    {
      id: "real-time",
      label: "Real-time Monitoring",
      icon: Activity,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      description:
        "Monitor your plant's health with live updates and environmental tracking",
    },
    {
      id: "expert-tips",
      label: "Expert Care Tips",
      icon: Lightbulb,
      color: "bg-purple-100 text-purple-700 border-purple-200",
      description:
        "Professional botanist advice and seasonal care recommendations",
    },
  ];

  const handleTabChange = (value: string) => {
    trackUserEngagement("tab_change", "Navigation", value);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-green-300/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-teal-300/20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 relative">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-4 sm:mb-6 tracking-tight leading-tight font-logo">
              EcoSnap
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed mb-4 sm:mb-6">
              AI-powered plant disease detection with{" "}
              <span className="text-emerald-600 font-bold">real-time monitoring</span> and{" "}
              <span className="text-teal-600 font-bold">expert recommendations</span>
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              {features.map(({ id, label, icon: IconComponent, color }) => (
                <Badge
                  key={id}
                  variant="outline"
                  className={`${color} px-3 py-1 sm:px-4 sm:py-2 cursor-pointer transition-all hover:scale-105 text-xs sm:text-sm ${
                    activeFeature === id ? "ring-2 ring-offset-2" : ""
                  }`}
                  onClick={() =>
                    setActiveFeature(activeFeature === id ? null : id)
                  }
                >
                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  {label}
                </Badge>
              ))}
            </div>

            {activeFeature && (
              <Card className="mb-6 sm:mb-8 mx-auto max-w-md animate-fade-in">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-gray-600">
                    {features.find((f) => f.id === activeFeature)?.description}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/plant-detection" className="w-full sm:w-auto">
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  Start Plant Detection
                </button>
              </Link>
              <Link href="/plant-care" className="w-full sm:w-auto">
                <button className="w-full bg-white/80 hover:bg-white text-gray-700 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm text-sm sm:text-base">
                  <BookOpen className="w-4 h-4 sm:w-5" />
                  Learn Plant Care
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="detector" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-5 mb-6 sm:mb-8 bg-white/80 backdrop-blur-sm border border-pink-200 shadow-lg">
            <TabsTrigger
              value="detector"
              className="flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
            >
              <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">AI Detect</span>
              <span className="xs:hidden">Detect</span>
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="care"
              className="flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Plant Care</span>
              <span className="sm:hidden">Care</span>
            </TabsTrigger>
            <TabsTrigger
              value="status"
              className="flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700"
            >
              <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Status</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700"
            >
              <Leaf className="w-3 h-3 sm:w-4 sm:h-4" />
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
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 mb-2 sm:mb-4 font-logo">
                  About EcoSnap
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 font-medium">
                  Advanced AI technology meets plant care expertise with comprehensive monitoring
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <AboutCard
                  title="🤖 AI-Powered Detection"
                  color="green"
                  content="Our advanced machine learning models, powered by Hugging Face AI, can identify over 30 common plant diseases with high accuracy. Real-time monitoring ensures optimal performance."
                />
                <AboutCard
                  title="📊 Smart Analytics"
                  color="blue"
                  content="Track your plant health journey with detailed analysis history, performance metrics, and personalized insights powered by Google Analytics and Web Vitals."
                />
                <AboutCard
                  title="💊 Expert Treatment Plans"
                  color="purple"
                  content="Get expert-curated treatment recommendations and prevention tips for each detected disease, with success tracking and error monitoring."
                />
                <AboutCard
                  title="🔍 Real-time Monitoring"
                  color="pink"
                  content="Advanced monitoring with error tracking, Web Vitals performance monitoring, and uptime tracking ensures the best user experience."
                />
              </div>

              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 sm:p-8 border border-pink-200 text-center shadow-lg">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-800 mb-2 sm:mb-3">
                  🌱 Join the EcoSnap Community
                </h3>
                <p className="text-gray-700 text-base sm:text-lg font-medium">
                  Help us improve plant disease detection with comprehensive monitoring and analytics.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

            {/* Footer Section */}
    <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 py-3 relative z-10">
  <div className="container mx-auto px-4">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 font-logo">
          EcoSnap
        </h2>
        <span className="text-xs text-gray-500 hidden sm:inline">|</span>
        <p className="text-xs text-gray-600">
          AI-powered plant care
        </p>
      </div>
      
      <div className="flex items-center gap-4">
         <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} EcoSnap
          </p>
          <span className="text-xs text-gray-400">|</span>
          <p className="text-xs text-gray-500">
            Made with 🤍 by Anjali
          </p>
        </div>
        <div className="flex gap-3">
          <a 
            href="https://www.instagram.com/anjalisinggh_12/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-pink-600 transition-colors"
            aria-label="Instagram"
          >
            <FaInstagram className="w-4 h-4" />
          </a>
          <a 
            href="https://x.com/anjalisinggh12/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-400 transition-colors"
            aria-label="Twitter"
          >
            <FaTwitter className="w-4 h-4" />
          </a>
          <a 
            href="https://github.com/Anjalisinggh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="GitHub"
          >
            <FaGithub className="w-4 h-4" />
          </a>
        </div>
       
      </div>
    </div>
  </div>
</footer>

    </main>
    
  );
}

function AboutCard({ title, content, color }: { title: string; content: string; color: string }) {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-${color}-200 shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <h3 className={`text-xl sm:text-2xl font-bold text-${color}-700 mb-2 sm:mb-3`}>{title}</h3>
      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{content}</p>
        
    </div>
    
  );
}