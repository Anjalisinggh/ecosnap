"use client"

import type React from "react"
import { useEffect } from "react"
import { onCLS, onINP, onFCP, onLCP, onTTFB } from "web-vitals"

// Web Vitals tracking
function sendToAnalytics(metric: any) {
  // Send to Google Analytics
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", metric.name, {
      event_category: "Web Vitals",
      event_label: metric.id,
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      non_interaction: true,
    })
  }

  // Log for debugging
  console.log("Web Vital:", metric)
}

// Custom error tracking
export const trackError = (error: Error, context?: string) => {
  console.error("EcoSnap Error:", error, context)

  // Send to analytics
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", "exception", {
      description: error.message,
      fatal: false,
      custom_map: { context },
    })
  }
}

// Track API calls
export const trackAPICall = (endpoint: string, duration: number, success: boolean, error?: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", "api_call", {
      event_category: "API",
      event_label: endpoint,
      value: duration,
      custom_map: { success, error },
    })
  }
}

// Track plant analysis
export const trackPlantAnalysis = (success: boolean, disease: string, confidence: number, analysisTime: number) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", "plant_analysis", {
      event_category: "Plant Detection",
      event_label: disease,
      value: confidence,
      custom_map: {
        success,
        analysis_time: analysisTime,
        confidence_level: confidence > 80 ? "high" : confidence > 60 ? "medium" : "low",
      },
    })
  }
}

// Track user engagement
export const trackUserEngagement = (action: string, category: string, label?: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
    })
  }
}

export function MonitoringProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Web Vitals tracking with correct syntax
    try {
      onCLS(sendToAnalytics)
      onINP(sendToAnalytics)
      onFCP(sendToAnalytics)
      onLCP(sendToAnalytics)
      onTTFB(sendToAnalytics)
    } catch (error) {
      console.warn("Web Vitals not available:", error)
    }

    // Global error handler
    const handleError = (event: ErrorEvent) => {
      trackError(new Error(event.message), event.filename)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error(event.reason), "unhandled_promise_rejection")
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return <>{children}</>
}
