"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Star,
  Play,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Leaf,
  Droplets,
  Sun,
  Thermometer,
  Heart,
  Download,
} from "lucide-react"

interface Guide {
  id: string
  title: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  rating: number
  isCompleted: boolean
  isBookmarked: boolean
  hasVideo: boolean
  description: string
  steps: string[]
  tips: string[]
  icon: any
}

export default function PlantCareGuidesDetail() {
  const [selectedCategory] = useState("Plant Care Basics")
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null)

  const guides: Guide[] = [
    {
      id: "1",
      title: "Understanding Your Plant's Needs",
      duration: "5 min read",
      difficulty: "Beginner",
      rating: 4.9,
      isCompleted: true,
      isBookmarked: true,
      hasVideo: true,
      description: "Learn the fundamental needs every plant has: light, water, nutrients, and proper environment.",
      steps: [
        "Identify your plant's light requirements (low, medium, bright indirect, or direct sunlight)",
        "Check soil moisture by inserting your finger 1-2 inches deep",
        "Look for signs of healthy growth: new leaves, strong stems, vibrant colors",
        "Monitor temperature and humidity levels in your plant's location",
        "Establish a regular care routine based on your plant's specific needs",
      ],
      tips: [
        "Most houseplants prefer bright, indirect light",
        "Overwatering is more harmful than underwatering",
        "Group plants with similar needs together",
      ],
      icon: Leaf,
    },
    {
      id: "2",
      title: "Proper Watering Techniques",
      duration: "7 min read",
      difficulty: "Beginner",
      rating: 4.8,
      isCompleted: false,
      isBookmarked: false,
      hasVideo: true,
      description: "Master the art of watering - when, how much, and what type of water to use.",
      steps: [
        "Check soil moisture before watering using the finger test",
        "Water thoroughly until water drains from the bottom holes",
        "Use room temperature water to avoid shocking the roots",
        "Water in the morning to allow plants to absorb moisture during active hours",
        "Empty drainage trays after 30 minutes to prevent root rot",
      ],
      tips: [
        "Yellow leaves often indicate overwatering",
        "Use filtered or distilled water for sensitive plants",
        "Bottom watering works great for plants with fuzzy leaves",
      ],
      icon: Droplets,
    },
    {
      id: "3",
      title: "Light Requirements Guide",
      duration: "6 min read",
      difficulty: "Beginner",
      rating: 4.7,
      isCompleted: false,
      isBookmarked: true,
      hasVideo: false,
      description: "Understand different light conditions and how to provide the right amount for your plants.",
      steps: [
        "Identify the natural light in your space throughout the day",
        "Learn the difference between direct and indirect sunlight",
        "Use a light meter app to measure light intensity",
        "Position plants according to their light preferences",
        "Consider grow lights for low-light spaces",
      ],
      tips: [
        "South-facing windows get the most light",
        "Rotate plants weekly for even growth",
        "Sheer curtains can provide perfect indirect light",
      ],
      icon: Sun,
    },
    {
      id: "4",
      title: "Soil and Repotting Basics",
      duration: "8 min read",
      difficulty: "Intermediate",
      rating: 4.6,
      isCompleted: false,
      isBookmarked: false,
      hasVideo: true,
      description: "Learn about different soil types and when and how to repot your plants.",
      steps: [
        "Choose the right soil mix for your plant type",
        "Check if your plant needs repotting (roots growing out of drainage holes)",
        "Select a pot only 1-2 inches larger than the current one",
        "Gently remove old soil and inspect roots for health",
        "Plant at the same depth as before and water lightly",
      ],
      tips: [
        "Spring is the best time for repotting",
        "Add perlite to improve drainage",
        "Don't fertilize immediately after repotting",
      ],
      icon: Leaf,
    },
    {
      id: "5",
      title: "Temperature and Humidity Control",
      duration: "5 min read",
      difficulty: "Beginner",
      rating: 4.5,
      isCompleted: false,
      isBookmarked: false,
      hasVideo: false,
      description: "Create the perfect environment for your plants with proper temperature and humidity.",
      steps: [
        "Maintain consistent temperatures between 65-75°F (18-24°C)",
        "Avoid placing plants near heating/cooling vents",
        "Increase humidity with pebble trays or humidifiers",
        "Group plants together to create a microclimate",
        "Monitor with a thermometer and hygrometer",
      ],
      tips: [
        "Most houseplants prefer 40-60% humidity",
        "Misting can help but avoid fuzzy-leaved plants",
        "Bathrooms naturally have higher humidity",
      ],
      icon: Thermometer,
    },
    {
      id: "6",
      title: "Fertilizing Fundamentals",
      duration: "6 min read",
      difficulty: "Intermediate",
      rating: 4.4,
      isCompleted: false,
      isBookmarked: true,
      hasVideo: true,
      description: "Learn when, how, and what to feed your plants for optimal growth.",
      steps: [
        "Fertilize during growing season (spring and summer)",
        "Dilute liquid fertilizer to half the recommended strength",
        "Apply fertilizer to moist soil, never dry soil",
        "Look for signs your plant needs feeding: slow growth, pale leaves",
        "Stop fertilizing in fall and winter when growth slows",
      ],
      tips: [
        "Less is more when it comes to fertilizing",
        "Organic fertilizers release nutrients slowly",
        "Flush soil occasionally to prevent salt buildup",
      ],
      icon: Heart,
    },
  ]

  const toggleBookmark = (id: string) => {
    // Toggle bookmark functionality would go here
    console.log(`Toggling bookmark for guide ${id}`)
  }

  const markAsCompleted = (id: string) => {
    // Mark as completed functionality would go here
    console.log(`Marking guide ${id} as completed`)
  }

  if (selectedGuide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedGuide(null)}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Guides
            </Button>
          </div>

          {/* Guide Content */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              {/* Guide Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                      <selectedGuide.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-emerald-800">{selectedGuide.title}</h1>
                      <p className="text-emerald-600">{selectedGuide.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <Badge className="bg-green-100 text-green-800 border-green-200 rounded-full px-3 py-1">
                      {selectedGuide.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-emerald-600">{selectedGuide.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-700">{selectedGuide.rating}</span>
                    </div>
                    {selectedGuide.hasVideo && (
                      <Badge className="bg-red-100 text-red-700 border-red-200 rounded-full">
                        <Play className="w-3 h-3 mr-1" />
                        Video
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleBookmark(selectedGuide.id)}
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full"
                  >
                    {selectedGuide.isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full bg-transparent"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Video Section */}
              {selectedGuide.hasVideo && (
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-800 mb-2">Watch Video Tutorial</h3>
                    <p className="text-emerald-600 mb-4">Get a visual walkthrough of this guide</p>
                    <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-full">
                      <Play className="w-4 h-4 mr-2" />
                      Play Video
                    </Button>
                  </div>
                </div>
              )}

              {/* Steps Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Step-by-Step Guide
                </h2>
                <div className="space-y-4">
                  {selectedGuide.steps.map((step, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-emerald-50 rounded-2xl">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-emerald-800 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-emerald-600" />
                  Pro Tips
                </h2>
                <div className="space-y-3">
                  {selectedGuide.tips.map((tip, index) => (
                    <div key={index} className="flex gap-3 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl">
                      <div className="w-6 h-6 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-teal-800">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => markAsCompleted(selectedGuide.id)}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-full shadow-lg"
                  disabled={selectedGuide.isCompleted}
                >
                  {selectedGuide.isCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Complete
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-full bg-transparent"
                >
                  Share Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              {selectedCategory}
            </h1>
          </div>
        </div>

        <p className="text-emerald-600 mb-8 text-center max-w-2xl mx-auto">
          Master the fundamentals of plant care with these essential guides. Perfect for beginners and a great refresher
          for experienced plant parents! 🌱
        </p>

        {/* Guides List */}
        <div className="space-y-4">
          {guides.map((guide, index) => {
            const IconComponent = guide.icon
            return (
              <Card
                key={guide.id}
                className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedGuide(guide)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Guide Number & Icon */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>

                    {/* Guide Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-emerald-800 mb-1">{guide.title}</h3>
                          <p className="text-emerald-600 text-sm mb-3">{guide.description}</p>

                          <div className="flex items-center gap-4">
                            <Badge className="bg-green-100 text-green-800 border-green-200 rounded-full px-3 py-1">
                              {guide.difficulty}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-emerald-600">
                              <Clock className="w-4 h-4" />
                              {guide.duration}
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-gray-700">{guide.rating}</span>
                            </div>
                            {guide.hasVideo && (
                              <Badge className="bg-red-100 text-red-700 border-red-200 rounded-full">
                                <Play className="w-3 h-3 mr-1" />
                                Video
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {guide.isCompleted && (
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          )}
                          {guide.isBookmarked && (
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                              <BookmarkCheck className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Progress Summary */}
        <Card className="mt-8 bg-gradient-to-r from-emerald-100 to-green-100 border-0 shadow-lg rounded-2xl">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">Your Progress</h3>
            <div className="flex items-center justify-center gap-8">
              <div>
                <div className="text-2xl font-bold text-emerald-700">
                  {guides.filter((g) => g.isCompleted).length}/{guides.length}
                </div>
                <div className="text-sm text-emerald-600">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-700">{guides.filter((g) => g.isBookmarked).length}</div>
                <div className="text-sm text-emerald-600">Bookmarked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-700">
                  {Math.round((guides.filter((g) => g.isCompleted).length / guides.length) * 100)}%
                </div>
                <div className="text-sm text-emerald-600">Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
