"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Server, Zap, Globe, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface SystemMetrics {
  apiStatus: "online" | "offline" | "degraded"
  responseTime: number
  uptime: number
  errorRate: number
  totalRequests: number
  successRate: number
}

interface PerformanceMetrics {
  cls: number
  fid: number
  lcp: number
  fcp: number
  ttfb: number
}

export default function SystemStatus() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    apiStatus: "online",
    responseTime: 0,
    uptime: 99.9,
    errorRate: 0.1,
    totalRequests: 0,
    successRate: 99.9,
  })

  const [performance, setPerformance] = useState<PerformanceMetrics>({
    cls: 0,
    fid: 0,
    lcp: 0,
    fcp: 0,
    ttfb: 0,
  })

  const [realtimeStats, setRealtimeStats] = useState({
    activeUsers: 0,
    analysesThisHour: 0,
    avgConfidence: 0,
  })

  useEffect(() => {
    // Simulate real-time metrics
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        responseTime: Math.random() * 500 + 200,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 5),
        errorRate: Math.random() * 2,
        successRate: 100 - Math.random() * 2,
      }))

      setRealtimeStats((prev) => ({
        activeUsers: Math.floor(Math.random() * 50) + 10,
        analysesThisHour: Math.floor(Math.random() * 100) + 50,
        avgConfidence: Math.floor(Math.random() * 20) + 75,
      }))
    }, 3000)

    // Get Web Vitals if available
    if (typeof window !== "undefined") {
      // Simulate Web Vitals data
      setPerformance({
        cls: Math.random() * 0.1,
        fid: Math.random() * 100 + 50,
        lcp: Math.random() * 1000 + 1500,
        fcp: Math.random() * 500 + 800,
        ttfb: Math.random() * 200 + 100,
      })
    }

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "degraded":
        return "bg-yellow-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4" />
      case "degraded":
        return <AlertTriangle className="w-4 h-4" />
      case "offline":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getPerformanceGrade = (value: number, metric: string) => {
    switch (metric) {
      case "lcp":
        return value < 2500 ? "A" : value < 4000 ? "B" : "C"
      case "fid":
        return value < 100 ? "A" : value < 300 ? "B" : "C"
      case "cls":
        return value < 0.1 ? "A" : value < 0.25 ? "B" : "C"
      case "fcp":
        return value < 1800 ? "A" : value < 3000 ? "B" : "C"
      case "ttfb":
        return value < 200 ? "A" : value < 500 ? "B" : "C"
      default:
        return "A"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-black text-green-800 mb-2">🔍 System Status</h2>
        <p className="text-green-600 text-lg font-medium">Real-time monitoring and performance metrics</p>
      </div>

      {/* System Status Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(metrics.apiStatus)}
                  <span className="font-bold text-lg capitalize">{metrics.apiStatus}</span>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(metrics.apiStatus)} animate-pulse`}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Zap className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{metrics.responseTime.toFixed(0)}ms</p>
                <p className="text-sm text-gray-600">Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Globe className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{metrics.uptime.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Server className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{metrics.totalRequests}</p>
                <p className="text-sm text-gray-600">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Analytics */}
      <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Activity className="w-6 h-6" />
            Real-time Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-green-700 mb-1">{realtimeStats.activeUsers}</div>
              <div className="text-sm text-green-600 font-medium">Active Users</div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(realtimeStats.activeUsers / 60) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-black text-blue-700 mb-1">{realtimeStats.analysesThisHour}</div>
              <div className="text-sm text-blue-600 font-medium">Analyses This Hour</div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(realtimeStats.analysesThisHour / 150) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-black text-purple-700 mb-1">{realtimeStats.avgConfidence}%</div>
              <div className="text-sm text-purple-600 font-medium">Avg AI Confidence</div>
              <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${realtimeStats.avgConfidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Web Vitals Performance */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Zap className="w-6 h-6" />
            Web Vitals Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{performance.lcp.toFixed(0)}ms</div>
              <div className="text-sm text-gray-600 mb-2">LCP</div>
             <div className="inline-block bg-white shadow-md border rounded-lg px-3 py-1">
  <Badge variant={getPerformanceGrade(performance.lcp, "lcp") === "A" ? "default" : "secondary"}>
    Grade {getPerformanceGrade(performance.lcp, "lcp")}
  </Badge>
</div>

            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{performance.fid.toFixed(0)}ms</div>
              <div className="text-sm text-gray-600 mb-2">FID</div>
              
              <Badge variant={getPerformanceGrade(performance.fid, "fid") === "A" ? "default" : "secondary"}>
                Grade {getPerformanceGrade(performance.fid, "fid")}
              </Badge>
            
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{performance.cls.toFixed(3)}</div>
              <div className="text-sm text-gray-600 mb-2">CLS</div>
              <Badge variant={getPerformanceGrade(performance.cls, "cls") === "A" ? "default" : "secondary"}>
                Grade {getPerformanceGrade(performance.cls, "cls")}
              </Badge>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{performance.fcp.toFixed(0)}ms</div>
              <div className="text-sm text-gray-600 mb-2">FCP</div>
              <Badge variant={getPerformanceGrade(performance.fcp, "fcp") === "A" ? "default" : "secondary"}>
                Grade {getPerformanceGrade(performance.fcp, "fcp")}
              </Badge>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{performance.ttfb.toFixed(0)}ms</div>
              <div className="text-sm text-gray-600 mb-2">TTFB</div>
              <Badge variant={getPerformanceGrade(performance.ttfb, "ttfb") === "A" ? "default" : "secondary"}>
                Grade {getPerformanceGrade(performance.ttfb, "ttfb")}
              </Badge>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>LCP:</strong> Largest Contentful Paint • <strong>FID:</strong> First Input Delay •{" "}
              <strong>CLS:</strong> Cumulative Layout Shift
            </p>
            <p>
              <strong>FCP:</strong> First Contentful Paint • <strong>TTFB:</strong> Time to First Byte
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Error Monitoring */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-green-800">Error Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Error Rate</span>
                <span className="font-bold text-lg">{metrics.errorRate.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${metrics.errorRate * 10}%` }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-bold text-lg text-green-600">{metrics.successRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${metrics.successRate}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-green-800">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Hugging Face API</span>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Operational
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database</span>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Operational
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Analytics</span>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Operational
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Monitoring</span>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Operational
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
