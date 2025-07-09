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
      // Simulate real-time data updates with more realistic values
      setSensorData((prev) => ({
        temperature: Math.max(15, Math.min(35, prev.temperature + (Math.random() - 0.5) * 0.5)),
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 2)),
        lightLevel: Math.max(0, Math.min(100, prev.lightLevel + (Math.random() - 0.5) * 5)),
        soilMoisture: Math.max(0, Math.min(100, prev.soilMoisture + (Math.random() - 0.5) * 1.5)),
        airQuality: Math.max(0, Math.min(100, prev.airQuality + (Math.random() - 0.5) * 1)),
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
        return value < 18 || value > 26 ? "warning" : "good"
      case "humidity":
        return value < 40 || value > 80 ? "warning" : "good"
      case "soilMoisture":
        if (value < 30) return "critical"
        if (value < 50) return "warning"
        return "good"
      default:
        return "good"
    }
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "good":
        return { className: "border-emerald-500 text-emerald-700 bg-emerald-50", text: "Optimal" }
      case "warning":
        return { className: "border-amber-500 text-amber-700 bg-amber-50", text: "Monitor" }
      case "critical":
        return { className: "border-red-500 text-red-700 bg-red-50", text: "Critical" }
      default:
        return { className: "border-gray-500 text-gray-700 bg-gray-50", text: "Unknown" }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" passHref legacyBehavior>
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                EcoSnap Monitor
              </h1>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live • {currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Environmental Sensors */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 border-emerald-100 shadow-sm sm:shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Environmental Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Temperature */}
                  <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gradient-to-br from-red-50/50 to-red-100/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-sm sm:text-base">Temperature</span>
                      </div>
                      <span className="text-lg sm:text-xl font-bold">{sensorData.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div
                        className="bg-gradient-to-r from-red-400 to-red-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((sensorData.temperature / 35) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <Badge
                      variant="outline"
                      className={getBadgeVariant(getSensorStatus(sensorData.temperature, "temperature")).className}
                    >
                      {getBadgeVariant(getSensorStatus(sensorData.temperature, "temperature")).text}
                    </Badge>
                  </div>

                  {/* Humidity */}
                  <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gradient-to-br from-blue-50/50 to-blue-100/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <span className="font-medium text-sm sm:text-base">Humidity</span>
                      </div>
                      <span className="text-lg sm:text-xl font-bold">{sensorData.humidity.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                        style={{ width: `${sensorData.humidity}%` }}
                      ></div>
                    </div>
                    <Badge
                      variant="outline"
                      className={getBadgeVariant(getSensorStatus(sensorData.humidity, "humidity")).className}
                    >
                      {getBadgeVariant(getSensorStatus(sensorData.humidity, "humidity")).text}
                    </Badge>
                  </div>

                  {/* Light Level */}
                  <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gradient-to-br from-yellow-50/50 to-yellow-100/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium text-sm sm:text-base">Light Level</span>
                      </div>
                      <span className="text-lg sm:text-xl font-bold">{sensorData.lightLevel.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                        style={{ width: `${sensorData.lightLevel}%` }}
                      ></div>
                    </div>
                    <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50">
                      Good
                    </Badge>
                  </div>

                  {/* Soil Moisture */}
                  <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gradient-to-br from-green-50/50 to-green-100/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wind className="w-5 h-5 text-teal-500" />
                        <span className="font-medium text-sm sm:text-base">Soil Moisture</span>
                      </div>
                      <span className="text-lg sm:text-xl font-bold">{sensorData.soilMoisture.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div
                        className={`h-2 sm:h-3 rounded-full transition-all duration-500 ${
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
                      className={getBadgeVariant(getSensorStatus(sensorData.soilMoisture, "soilMoisture")).className}
                    >
                      {getBadgeVariant(getSensorStatus(sensorData.soilMoisture, "soilMoisture")).text}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plant Status */}
            <Card className="backdrop-blur-sm bg-white/80 border-emerald-100 shadow-sm sm:shadow">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Plant Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {plants.map((plant) => (
                    <div 
                      key={plant.id} 
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{plant.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">{plant.location}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Last watered: {plant.lastWatered}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">Next: {plant.nextWatering}</span>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-end sm:items-end gap-2 sm:gap-1 w-full sm:w-auto">
                        <Badge className={`text-xs sm:text-sm ${getStatusColor(plant.status)}`}>
                          {plant.status}
                        </Badge>
                        <div className="text-xs sm:text-sm text-gray-600">Health: {plant.health}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts & Notifications */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 border-emerald-100 shadow-sm sm:shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className="p-3 border rounded-lg hover:bg-amber-50/50 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          className={`w-4 h-4 mt-0.5 ${alert.type === "warning" ? "text-amber-500" : "text-blue-500"}`}
                        />
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm text-gray-800">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 border-emerald-100 shadow-sm sm:shadow">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-transparent hover:bg-emerald-50 text-xs sm:text-sm"
                >
                  <Droplets className="w-4 h-4 mr-2 text-blue-500" />
                  Water Snake Plant
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-transparent hover:bg-emerald-50 text-xs sm:text-sm"
                >
                  <Sun className="w-4 h-4 mr-2 text-yellow-500" />
                  Adjust Lighting
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-transparent hover:bg-emerald-50 text-xs sm:text-sm"
                >
                  <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
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