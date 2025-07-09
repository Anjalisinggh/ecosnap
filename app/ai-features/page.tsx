"use client"

import { useState } from "react"
import { ArrowLeft, Sparkles, MessageCircle, Camera, Calendar, TrendingUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function AIFeaturesPage() {
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    {
      type: "ai",
      message: "Hello! I'm your AI plant care assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])

  const aiFeatures = [
    {
      id: "plant-id",
      title: "Smart Plant Identification",
      description: "Upload a photo and get instant plant identification with 95% accuracy",
      icon: Camera,
      color: "bg-green-100 text-green-700",
      status: "Active",
    },
    {
      id: "care-assistant",
      title: "AI Care Assistant",
      description: "Get personalized care recommendations based on your plant collection",
      icon: MessageCircle,
      color: "bg-blue-100 text-blue-700",
      status: "Active",
    },
    {
      id: "health-analysis",
      title: "Health Analysis",
      description: "AI-powered plant health assessment from photos",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-700",
      status: "Active",
    },
    {
      id: "smart-scheduling",
      title: "Smart Care Scheduling",
      description: "Automated watering and care reminders based on plant needs",
      icon: Calendar,
      color: "bg-orange-100 text-orange-700",
      status: "Beta",
    },
    {
      id: "predictive-care",
      title: "Predictive Care Insights",
      description: "Predict potential issues before they become problems",
      icon: Zap,
      color: "bg-red-100 text-red-700",
      status: "Coming Soon",
    },
  ]

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    const newUserMessage = {
      type: "user",
      message: chatMessage,
      timestamp: new Date(),
    }

    setChatHistory((prev) => [...prev, newUserMessage])
    setChatMessage("")

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your description, it sounds like your plant might be experiencing overwatering. Try reducing watering frequency and ensure proper drainage.",
        "That's a great question! For that type of plant, I'd recommend placing it in bright, indirect light and watering when the top inch of soil feels dry.",
        "It looks like your plant is showing signs of nutrient deficiency. Consider using a balanced liquid fertilizer diluted to half strength once a month during growing season.",
        "Those symptoms could indicate a pest issue. Check the undersides of leaves for small insects and consider using neem oil as a natural treatment.",
      ]

      const aiResponse = {
        type: "ai",
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      setChatHistory((prev) => [...prev, aiResponse])
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Beta":
        return "bg-yellow-100 text-yellow-800"
      case "Coming Soon":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col xs:flex-row xs:items-center gap-3 sm:gap-4 mb-6">
          <Link href="/" className="w-fit">
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="whitespace-nowrap">Back to EcoSnap</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              EcoSnap AI Features
            </h1>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* AI Features List */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 border-emerald-100 shadow-sm sm:shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Available AI Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {aiFeatures.map((feature) => {
                    const IconComponent = feature.icon
                    return (
                      <div
                        key={feature.id}
                        className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className={`p-2 sm:p-3 rounded-lg ${feature.color} flex-shrink-0`}>
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-1 sm:mb-2">
                            <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                              {feature.title}
                            </h3>
                            <Badge className={`text-xs ${getStatusColor(feature.status)}`}>
                              {feature.status}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                            {feature.description}
                          </p>
                          <Button
                            size="sm"
                            variant={feature.status === "Active" ? "default" : "outline"}
                            disabled={feature.status === "Coming Soon"}
                            className="w-full xs:w-auto"
                          >
                            {feature.status === "Active"
                              ? "Use Feature"
                              : feature.status === "Beta"
                                ? "Try Beta"
                                : "Coming Soon"}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="backdrop-blur-sm bg-white/80 border-emerald-100 shadow-sm sm:shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">AI Insights Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 text-xs sm:text-sm mb-1 sm:mb-2">
                      Plants Identified
                    </h4>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">247</div>
                    <p className="text-xs sm:text-sm text-green-700">+23% from last week</p>
                  </div>

                  <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 text-xs sm:text-sm mb-1 sm:mb-2">
                      Care Recommendations
                    </h4>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">1,432</div>
                    <p className="text-xs sm:text-sm text-blue-700">Across 89 species</p>
                  </div>

                  <div className="p-3 sm:p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 text-xs sm:text-sm mb-1 sm:mb-2">
                      Health Issues
                    </h4>
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">56</div>
                    <p className="text-xs sm:text-sm text-purple-700">94% early detection</p>
                  </div>

                  <div className="p-3 sm:p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 text-xs sm:text-sm mb-1 sm:mb-2">
                      Success Rate
                    </h4>
                    <div className="text-xl sm:text-2xl font-bold text-orange-600">96.2%</div>
                    <p className="text-xs sm:text-sm text-orange-700">Identification accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Chat Assistant */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="h-[400px] sm:h-[500px] lg:h-[600px] backdrop-blur-sm bg-white/80 border-emerald-100 shadow-sm sm:shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  EcoSnap AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-[calc(100%-57px)]">
                <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 mb-3 sm:mb-4 pr-2">
                  {chatHistory.map((message, index) => (
                    <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] p-2 sm:p-3 rounded-lg text-xs sm:text-sm ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                            : "bg-emerald-50 text-gray-800 border border-emerald-100"
                        }`}
                      >
                        {message.message}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Ask me anything about plant care..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="min-h-[60px] text-xs sm:text-sm"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    size="sm"
                  >
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick AI Actions */}
            <Card className="backdrop-blur-sm bg-white/80 border-emerald-100 shadow-sm sm:shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Quick AI Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent text-xs sm:text-sm">
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  Identify Plant from Photo
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent text-xs sm:text-sm">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  Analyze Plant Health
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent text-xs sm:text-sm">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  Generate Care Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent text-xs sm:text-sm">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  Get Smart Recommendations
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}