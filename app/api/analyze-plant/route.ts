import { type NextRequest, NextResponse } from "next/server"

// Expanded disease database with real plant diseases
const diseaseDatabase = {
  apple_scab: {
    disease: "Apple Scab",
    description: "Fungal disease causing dark, scabby lesions on leaves and fruit",
    severity: "Medium" as const,
    treatment: [
      "Apply fungicide containing captan or myclobutanil",
      "Remove fallen leaves and infected plant debris",
      "Prune to improve air circulation",
      "Apply dormant oil spray in early spring",
    ],
    prevention: [
      "Choose scab-resistant apple varieties",
      "Ensure good air circulation",
      "Avoid overhead watering",
      "Apply preventive fungicide sprays",
    ],
  },
  tomato_blight: {
    disease: "Tomato Late Blight",
    description: "Devastating fungal disease affecting tomato plants",
    severity: "High" as const,
    treatment: [
      "Apply copper-based fungicide immediately",
      "Remove and destroy affected plants",
      "Improve drainage and air circulation",
      "Avoid watering leaves directly",
    ],
    prevention: [
      "Plant certified disease-free seeds",
      "Rotate crops annually",
      "Water at soil level only",
      "Apply preventive copper sprays",
    ],
  },
  powdery_mildew: {
    disease: "Powdery Mildew",
    description: "White powdery fungal coating on leaf surfaces",
    severity: "Medium" as const,
    treatment: [
      "Spray with baking soda solution (1 tsp per quart)",
      "Apply neem oil in evening hours",
      "Remove severely affected leaves",
      "Increase air circulation around plants",
    ],
    prevention: [
      "Plant in sunny, well-ventilated areas",
      "Avoid overcrowding plants",
      "Water at soil level",
      "Choose resistant plant varieties",
    ],
  },
  leaf_spot: {
    disease: "Bacterial Leaf Spot",
    description: "Bacterial infection causing dark spots with yellow halos",
    severity: "Medium" as const,
    treatment: [
      "Apply copper-based bactericide",
      "Remove infected leaves immediately",
      "Avoid overhead watering",
      "Disinfect pruning tools between cuts",
    ],
    prevention: [
      "Use drip irrigation systems",
      "Provide adequate plant spacing",
      "Avoid working with wet plants",
      "Remove plant debris regularly",
    ],
  },
  rust: {
    disease: "Plant Rust",
    description: "Fungal disease causing orange/brown pustules on leaves",
    severity: "High" as const,
    treatment: [
      "Apply systemic fungicide containing propiconazole",
      "Remove and destroy infected leaves",
      "Improve air circulation",
      "Water early morning at soil level",
    ],
    prevention: [
      "Plant rust-resistant varieties",
      "Ensure proper plant spacing",
      "Avoid evening watering",
      "Remove alternate host plants nearby",
    ],
  },
  healthy: {
    disease: "Healthy Plant",
    description: "No disease detected - plant appears healthy",
    severity: "Low" as const,
    treatment: [
      "Continue current care routine",
      "Monitor regularly for changes",
      "Maintain proper watering schedule",
      "Ensure adequate nutrition",
    ],
    prevention: [
      "Keep consistent watering schedule",
      "Provide adequate sunlight",
      "Use balanced fertilizer monthly",
      "Inspect plants weekly for early detection",
    ],
  },
}

async function analyzeWithHuggingFace(imageBase64: string) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Hugging Face accepts base64 data inside a JSON payload
      body: JSON.stringify({ inputs: imageBase64 }),
    },
  )

  if (!response.ok) {
    // Forward the exact HF error for easier debugging
    const errText = await response.text()
    throw new Error(`HF API ${response.status}: ${errText}`)
  }

  return (await response.json()) as Array<{ label: string; score: number }>
}

function mapHuggingFaceToDisease(hfResult: any[]) {
  if (!hfResult || hfResult.length === 0) {
    return { ...diseaseDatabase.healthy, confidence: 50 }
  }

  const topResult = hfResult[0]
  const confidence = Math.round(topResult.score * 100)

  // Map Hugging Face labels to our disease database
  const label = topResult.label.toLowerCase()

  if (label.includes("scab")) {
    return { ...diseaseDatabase.apple_scab, confidence }
  } else if (label.includes("blight")) {
    return { ...diseaseDatabase.tomato_blight, confidence }
  } else if (label.includes("mildew")) {
    return { ...diseaseDatabase.powdery_mildew, confidence }
  } else if (label.includes("spot")) {
    return { ...diseaseDatabase.leaf_spot, confidence }
  } else if (label.includes("rust")) {
    return { ...diseaseDatabase.rust, confidence }
  } else if (label.includes("healthy")) {
    return { ...diseaseDatabase.healthy, confidence }
  } else {
    // Default to a generic disease if not found
    return {
       disease: topResult.label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      description: "Disease detected - consult with a plant specialist for specific treatment",
      severity: "Medium" as const,
      confidence,
      treatment: [
        "Isolate affected plant",
        "Remove infected parts",
        "Apply broad-spectrum fungicide",
        "Monitor closely for changes",
      ],
      prevention: [
        "Maintain good plant hygiene",
        "Ensure proper air circulation",
        "Water at soil level",
        "Regular plant inspection",
      ],
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { image, userId } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json({ error: "HUGGINGFACE_API_KEY env variable is missing" }, { status: 500 })
    }

    // Analyze with Hugging Face AI
    const hfResult = await analyzeWithHuggingFace(image)
    const diseaseInfo = mapHuggingFaceToDisease(hfResult)

    // Save analysis to user history (if userId provided)
    if (userId) {
      // In a real app, you'd save this to a database
      console.log(`Saving analysis for user ${userId}:`, diseaseInfo.disease)
    }

    console.log("HF raw result:", hfResult)

    return NextResponse.json({
      ...diseaseInfo,
      timestamp: new Date().toISOString(),
      analysisId: Math.random().toString(36).substr(2, 9),
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze image. Please try again.",
      },
      { status: 500 },
    )
  }
}
