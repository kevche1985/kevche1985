import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { prompt } = body

    // Extract business name from prompt
    const businessNameMatch = prompt.match(/business named "([^"]+)"/)
    const businessName = businessNameMatch ? businessNameMatch[1] : "Your Business"

    // Generate a simple description
    const descriptions = [
      `A sleek, modern logo for ${businessName} featuring a minimalist design with clean lines and a professional color palette.`,
      `An elegant logo for ${businessName} with a distinctive icon that represents the brand's values and mission.`,
      `A bold, memorable logo for ${businessName} that stands out with its unique typography and balanced composition.`,
    ]

    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)]

    // Return mock data
    return NextResponse.json({
      imageUrl: "/abstract-professional-logo.png",
      description: randomDescription,
      id: `logo-${Date.now()}`,
    })
  } catch (error: any) {
    console.error("Error in simple logo generation:", error)
    return NextResponse.json({ error: `Error generating logo: ${error.message || "Unknown error"}` }, { status: 500 })
  }
}
