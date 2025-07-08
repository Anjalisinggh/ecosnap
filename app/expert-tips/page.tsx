"use client"

import { useState } from "react"
import { ArrowLeft, Star, Calendar, Lightbulb, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function ExpertTipsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSeason, setSelectedSeason] = useState("all")

  const tips = [
    {
      id: 1,
      title: "Winter Plant Care Essentials",
      expert: "Dr. Sarah Green",
      category: "Seasonal Care",
      season: "winter",
      difficulty: "Beginner",
      rating: 4.9,
      readTime: "5 min",
      content:
        "During winter months, most houseplants enter a dormant phase. Reduce watering frequency by 50% and avoid fertilizing until spring returns.",
      tags: ["watering", "dormancy", "winter"],
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Identifying Overwatering vs Underwatering",
      expert: "Prof. Michael Plant",
      category: "Troubleshooting",
      season: "all",
      difficulty: "Intermediate",
      rating: 4.8,
      readTime: "7 min",
      content:
        "Yellow leaves can indicate both over and underwatering. Check soil moisture and leaf texture to determine the correct diagnosis.",
      tags: ["watering", "diagnosis", "leaves"],
      date: "2024-01-12",
    },
    {
      id: 3,
      title: "Spring Repotting Guide",
      expert: "Lisa Botanist",
      category: "Seasonal Care",
      season: "spring",
      difficulty: "Intermediate",
      rating: 4.7,
      readTime: "10 min",
      content:
        "Spring is the ideal time for repotting. Look for roots growing through drainage holes or circling the pot as signs your plant needs a new home.",
      tags: ["repotting", "spring", "roots"],
      date: "2024-01-10",
    },
    {
      id: 4,
      title: "Creating Humidity for Tropical Plants",
      expert: "Dr. Emma Leaf",
      category: "Environment",
      season: "all",
      difficulty: "Beginner",
      rating: 4.6,
      readTime: "6 min",
      content:
        "Use pebble trays, group plants together, or invest in a humidifier to maintain 50-60% humidity for tropical houseplants.",
      tags: ["humidity", "tropical", "environment"],
      date: "2024-01-08",
    },
    {
      id: 5,
      title: "Summer Heat Stress Prevention",
      expert: "Carlos Verde",
      category: "Seasonal Care",
      season: "summer",
      difficulty: "Advanced",
      rating: 4.5,
      readTime: "8 min",
      content:
        "Protect plants from intense summer heat by providing shade during peak hours and increasing watering frequency gradually.",
      tags: ["heat", "summer", "protection"],
      date: "2024-01-05",
    },
  ]

  const categories = ["all", "Seasonal Care", "Troubleshooting", "Environment", "Propagation", "Pest Control"]
  const seasons = ["all", "spring", "summer", "fall", "winter"]

  const filteredTips = tips.filter((tip) => {
    const matchesSearch =
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || tip.category === selectedCategory
    const matchesSeason = selectedSeason === "all" || tip.season === selectedSeason || tip.season === "all"

    return matchesSearch && matchesCategory && matchesSeason
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
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
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              EcoSnap Expert Tips
            </h1>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-4 h-4" />
            <Input
              placeholder="Search tips, experts, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-emerald-200 focus:border-emerald-400 bg-white/80 backdrop-blur-sm"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger>
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season} value={season}>
                  {season === "all" ? "All Seasons" : season.charAt(0).toUpperCase() + season.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tips Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip) => (
            <Card
              key={tip.id}
              className="hover:shadow-xl transition-all cursor-pointer backdrop-blur-sm bg-white/80 border-emerald-100 hover:border-emerald-200 transform hover:scale-105"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getDifficultyColor(tip.difficulty)}>{tip.difficulty}</Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {tip.rating}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{tip.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>by {tip.expert}</span>
                  <span>•</span>
                  <span>{tip.readTime}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{tip.content}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {tip.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(tip.date).toLocaleDateString()}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {tip.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTips.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No tips found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Featured Expert Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Featured Expert of the Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">SG</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">Dr. Sarah Green</h3>
                <p className="text-sm text-gray-600 mb-2">Botanical Specialist • 15+ years experience</p>
                <p className="text-sm text-gray-700">
                  "Winter plant care requires patience and observation. Remember, less is often more during the dormant
                  season."
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span>127 tips published</span>
                  <span>•</span>
                  <span>4.8 average rating</span>
                  <span>•</span>
                  <span>50K+ readers</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
