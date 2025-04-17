import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { prompt } = body

    // Validate the prompt
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Extract business name from prompt for the mock response
    const businessNameMatch = prompt.match(/business named "([^"]+)"/)
    const businessName = businessNameMatch ? businessNameMatch[1] : "Business"

    // Create a mock response
    const mockResponse = {
      id: `logo-${Date.now()}`,
      imageUrl: "/abstract-professional-logo.png", // Use our uploaded placeholder image
      description: `A professional logo for ${businessName} featuring a modern design with clean lines and a balanced composition.`,
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Error in mock logo generation:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
