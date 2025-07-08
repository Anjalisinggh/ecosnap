"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Thermometer, Droplets, Sun, Wind, AlertTriangle, TrendingUp, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function MonitoringPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sensorData, setSensorData] = useState({
    temperature: 22,
    humidity: 65,
    lightLevel: 75,
    soilMoisture: 45,
    airQuality: 85,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      // Simulate real-time data updates
      setSensorData((prev) => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 5)),
        lightLevel: Math.max(0, Math.min(100, prev.lightLevel + (Math.random() - 0.5) * 10)),
        soilMoisture: Math.max(0, Math.min(100, prev.soilMoisture + (Math.random() - 0.5) * 3)),
        airQuality: Math.max(0, Math.min(100, prev.airQuality + (Math.random() - 0.5) * 2)),
      }))
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  const plants = [
    {
      id: 1,
      name: "Monstera Deliciosa",
      location: "Living Room",
      status: "Healthy",
      lastWatered: "2 days ago",
      nextWatering: "Tomorrow",
      health: 92,
    },
    {
      id: 2,
      name: "Snake Plant",
      location: "Bedroom",
      status: "Needs Water",
      lastWatered: "1 week ago",
      nextWatering: "Today",
      health: 78,
    },
    {
      id: 3,
      name: "Pothos",
      location: "Kitchen",
      status: "Healthy",
      lastWatered: "3 days ago",
      nextWatering: "In 2 days",
      health: 88,
    },
  ]

  const alerts = [
    {
      id: 1,
      type: "warning",
      message: "Snake Plant needs watering",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "info",
      message: "Humidity levels optimal for Monstera",
      time: "4 hours ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-green-100 text-green-800"
      case "Needs Water":
        return "bg-yellow-100 text-yellow-800"
      case "Critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSensorStatus = (value: number, type: string) => {
    switch (type) {
      case "temperature":
        if (value < 18 || value > 26) return "warning"
        return "good"
      case "humidity":
        if (value < 40 || value > 80) return "warning"
        return "good"
      case "soilMoisture":
        if (value < 30) return "critical"
        if (value < 50) return "warning"
        return "good"
      default:
        return "good"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
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
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                EcoSnap Monitor
              </h1>
            </div>
          </div>
          <div className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-100">
            Live • {currentTime.toLocaleTimeString()}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Environmental Sensors */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 border-emerald-100 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Environmental Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-red-500" />
                        <span className="font-medium">Temperature</span>
                      </div>
                      <span className="text-xl font-bold">{sensorData.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((sensorData.temperature / 35) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        getSensorStatus(sensorData.temperature, "temperature") === "good"
                          ? "border-emerald-500 text-emerald-700 bg-emerald-50"
                          : "border-amber-500 text-amber-700 bg-amber-50"
                      }
                    >
                      {getSensorStatus(sensorData.temperature, "temperature") === "good" ? "Optimal" : "Monitor"}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Humidity</span>
                      </div>
                      <span className="text-xl font-bold">{sensorData.humidity.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${sensorData.humidity}%` }}
                      ></div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        getSensorStatus(sensorData.humidity, "humidity") === "good"
                          ? "border-emerald-500 text-emerald-700 bg-emerald-50"
                          : "border-amber-500 text-amber-700 bg-amber-50"
                      }
                    >
                      {getSensorStatus(sensorData.humidity, "humidity") === "good" ? "Optimal" : "Monitor"}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sun className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium">Light Level</span>
                      </div>
                      <span className="text-xl font-bold">{sensorData.lightLevel.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${sensorData.lightLevel}%` }}
                      ></div>
                    </div>
                    <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50">
                      Good
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Wind className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">Soil Moisture</span>
                      </div>
                      <span className="text-xl font-bold">{sensorData.soilMoisture.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          sensorData.soilMoisture < 30
                            ? "bg-gradient-to-r from-red-400 to-red-600"
                            : sensorData.soilMoisture < 50
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                              : "bg-gradient-to-r from-green-400 to-green-600"
                        }`}
                        style={{ width: `${sensorData.soilMoisture}%` }}
                      ></div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        getSensorStatus(sensorData.soilMoisture, "soilMoisture") === "critical"
                          ? "border-red-500 text-red-700 bg-red-50"
                          : getSensorStatus(sensorData.soilMoisture, "soilMoisture") === "warning"
                            ? "border-amber-500 text-amber-700 bg-amber-50"
                            : "border-emerald-500 text-emerald-700 bg-emerald-50"
                      }
                    >
                      {getSensorStatus(sensorData.soilMoisture, "soilMoisture") === "critical"
                        ? "Low"
                        : getSensorStatus(sensorData.soilMoisture, "soilMoisture") === "warning"
                          ? "Monitor"
                          : "Good"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plant Status */}
            <Card>
              <CardHeader>
                <CardTitle>Plant Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plants.map((plant) => (
                    <div key={plant.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-800">{plant.name}</h3>
                        <p className="text-sm text-gray-600">{plant.location}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Last watered: {plant.lastWatered}</span>
                          <span>•</span>
                          <span>Next: {plant.nextWatering}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(plant.status)}>{plant.status}</Badge>
                        <div className="text-sm text-gray-600">Health: {plant.health}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts & Notifications */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-3 border rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          className={`w-4 h-4 mt-0.5 ${alert.type === "warning" ? "text-yellow-500" : "text-blue-500"}`}
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Droplets className="w-4 h-4 mr-2" />
                  Water Snake Plant
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Sun className="w-4 h-4 mr-2" />
                  Adjust Lighting
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  View All Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
