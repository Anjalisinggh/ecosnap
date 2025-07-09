"use client"

import { useState } from "react"
import { ArrowLeft, Search, BookOpen, Play, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import PlantCareGuidesDetail from "../plant-care-guides-detail/page"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"

export default function PlantCarePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: "basics", name: "Plant Care Basics", count: 12 },
    { id: "houseplants", name: "Houseplants", count: 24 },
    { id: "succulents", name: "Succulents", count: 18 },
    { id: "herbs", name: "Herbs & Vegetables", count: 15 },
    { id: "troubleshooting", name: "Troubleshooting", count: 20 },
  ]

  const guides = [
    {
      id: 1,
      title: "Complete Guide to Watering Plants",
      category: "Basics",
      duration: "8 min read",
      difficulty: "Beginner",
      rating: 4.8,
      image: "/water.jpg?height=200&width=300",
      description: "Learn the fundamentals of proper plant watering techniques",
    },
    {
      id: 2,
      title: "Understanding Light Requirements",
      category: "Basics",
      duration: "6 min read",
      difficulty: "Beginner",
      rating: 4.9,
      image: "/light.jpg?height=200&width=300",
      description: "Master the art of providing optimal lighting for your plants",
    },
    {
      id: 3,
      title: "Monstera Care Guide",
      category: "Houseplants",
      duration: "10 min read",
      difficulty: "Intermediate",
      rating: 4.7,
      image: "/mons.jpg?height=200&width=300",
      description: "Everything you need to know about caring for Monstera plants",
    },
    {
      id: 4,
      title: "Succulent Propagation Methods",
      category: "Succulents",
      duration: "12 min read",
      difficulty: "Intermediate",
      rating: 4.6,
      image: "/su.jpg?height=200&width=300",
      description: "Step-by-step guide to propagating your favorite succulents",
    },
  ]

  const videos = [
    {
      id: 1,
      title: "Repotting Your Plants: A Visual Guide",
      duration: "15:30",
      views: "125K",
      thumbnail: "/thumbnails/repotting.jpg",
    },
    {
      id: 2,
      title: "Identifying Common Plant Pests",
      duration: "12:45",
      views: "89K",
      thumbnail: "/thumbnails/plantpest.jpg?height=180&width=320",
    },
    {
      id: 3,
      title: "Creating the Perfect Plant Corner",
      duration: "18:20",
      views: "203K",
      thumbnail: "/thumbnails/corner.jpg?height=180&width=320",
    },
  ]

  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              EcoSnap Learning Center
            </h1>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-4 h-4" />
          <Input
            placeholder="Search guides, tips, and tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-emerald-200 focus:border-emerald-400 bg-white/80 backdrop-blur-sm"
          />
        </div>

        <Tabs defaultValue="guides" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border-emerald-100">
            <TabsTrigger
              value="guides"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
            >
              Guides & Articles
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
            >
              Video Tutorials
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
            >
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide) => (
                <Card
                  key={guide.id}
                  className="hover:shadow-xl transition-all cursor-pointer backdrop-blur-sm bg-white/80 border-emerald-100 hover:border-emerald-200 transform hover:scale-105"
                >
                  <div className="relative">
                    <Image
                      src={guide.image || "/placeholder.svg"}
                      alt={guide.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 right-2 bg-white text-gray-800">{guide.category}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{guide.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{guide.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {guide.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {guide.rating}
                      </div>
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {guide.difficulty}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      width={320}
                      height={180}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                    <Badge className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white">
                      {video.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-500">{video.views} views</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {!selectedCategory ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Link key={category.id} href={`/plant-care/${category.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-800 mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.count} guides available</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div>
                <Button
                  onClick={() => setSelectedCategory(null)}
                  className="mb-4 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Categories
                </Button>
                <PlantCareGuidesDetail
                //   category={selectedCategory}
                //   guides={guides.filter((g) => g.category.toLowerCase() === selectedCategory.toLowerCase())}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
