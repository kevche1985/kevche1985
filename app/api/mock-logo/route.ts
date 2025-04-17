import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { prompt, businessName } = body

    // Validate the prompt
    if (!prompt) {
      console.error("No prompt provided")
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    console.log("Generating mock logo with prompt:", prompt)

    // Generate a mock description
    const descriptions = [
      `A sleek and modern logo for ${businessName} featuring clean lines and a professional aesthetic.`,
      `An elegant logo design for ${businessName} that conveys trust and reliability.`,
      `A distinctive logo for ${businessName} that stands out with its unique visual elements.`,
      `A minimalist yet impactful logo for ${businessName} that communicates the brand's essence.`,
    ]

    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)]

    // Use a static image for now
    const imageUrl = "/abstract-professional-logo.png"

    // Return the mock logo data
    return NextResponse.json({
      imageUrl,
      description: randomDescription,
      id: `logo-${Date.now()}`,
    })
  } catch (error) {
    // Log and return any errors
    console.error("Error in mock logo generation:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Error in mock logo generation: ${errorMessage}` }, { status: 500 })
  }
}
