"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Sun, Scissors, Bug, Calendar, Thermometer, Sparkles } from "lucide-react"
import Image from "next/image"

const careTips = [
  {
    icon: Droplets,
    title: "Watering Guidelines",
    tips: [
      "Water early morning to reduce evaporation",
      "Check soil moisture 1-2 inches deep",
      "Use room temperature water",
      "Water at soil level to prevent leaf diseases",
    ],
  },
  {
    icon: Sun,
    title: "Light Requirements",
    tips: [
      "Most plants need 6-8 hours of sunlight",
      "Rotate plants weekly for even growth",
      "Use grow lights for indoor plants",
      "Watch for signs of too much/little light",
    ],
  },
  {
    icon: Scissors,
    title: "Pruning & Maintenance",
    tips: [
      "Remove dead or diseased parts immediately",
      "Prune during dormant season",
      "Sterilize tools between plants",
      "Pinch flowers to encourage leaf growth",
    ],
  },
  {
    icon: Bug,
    title: "Pest Prevention",
    tips: [
      "Inspect plants weekly for pests",
      "Use companion planting for natural pest control",
      "Apply neem oil as preventive treatment",
      "Remove weeds that harbor pests",
    ],
  },
  {
    icon: Calendar,
    title: "Seasonal Care",
    tips: [
      "Adjust watering frequency by season",
      "Fertilize during growing season",
      "Protect from frost in winter",
      "Plan crop rotation annually",
    ],
  },
  {
    icon: Thermometer,
    title: "Environmental Conditions",
    tips: [
      "Maintain proper humidity levels",
      "Ensure good air circulation",
      "Monitor temperature fluctuations",
      "Protect from extreme weather",
    ],
  },
]

export default function PlantCareTips() {
  return (
    <div className="space-y-6">
      {/* Hero Section with Plant Image */}
      <div className="text-center relative">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl blur-2xl"></div>
            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
              <Image
                src="/images/plant.png"
                alt="Plant care guide"
                width={200}
                height={250}
                className="drop-shadow-xl"
              />
              <div className="absolute top-2 right-2 bg-green-500/20 backdrop-blur-sm rounded-full p-1">
                <Sparkles className="w-4 h-4 text-green-400 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-4xl font-black text-green-100 mb-4">🌿 Plant Care Guide</h2>
            <p className="text-green-300 text-lg font-medium">
              Essential tips to keep your plants healthy and thriving
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careTips.map((category, index) => (
          <Card
            key={index}
            className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 hover:shadow-2xl transition-all duration-300 hover:border-green-400/30"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <category.icon className="w-6 h-6 text-green-400" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="text-sm text-green-200 flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Reference Card */}
      <Card className="bg-gradient-to-r from-green-900/10 to-emerald-500/10 border-green-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-green-400">🚨 Emergency Plant Care</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-300 mb-2">Signs of Overwatering:</h4>
              <ul className="text-sm text-green-200 space-y-1">
                <li>• Yellow, mushy leaves</li>
                <li>• Fungal growth on soil</li>
                <li>• Root rot (black, smelly roots)</li>
                <li>• Wilting despite wet soil</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-300 mb-2">Signs of Underwatering:</h4>
              <ul className="text-sm text-green-200 space-y-1">
                <li>• Dry, crispy leaves</li>
                <li>• Soil pulling away from pot</li>
                <li>• Stunted growth</li>
                <li>• Leaves dropping prematurely</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
