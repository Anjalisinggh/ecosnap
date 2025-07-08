import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { GoogleAnalytics } from "@next/third-parties/google"
import "./globals.css"
import { MonitoringProvider } from "@/components/monitoring-provider"
import { icons } from "lucide-react"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "EcoSnap - AI Plant Disease Detection",
  description: "AI-powered plant disease detection and treatment recommendations with real-time monitoring",
  keywords: "plant disease, AI detection, plant care, agriculture, gardening",
  authors: [{ name: "Anjali" }],
  openGraph: {
    title: "EcoSnap - AI Plant Disease Detection",
    description: "Detect plant diseases instantly with AI",
    type: "website",
   
  },
  icons: {
    icon: "/plantt.png", // ✅ this is at the top level now
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className={`${spaceGrotesk.className} antialiased`}>
        <MonitoringProvider>{children}</MonitoringProvider>
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
