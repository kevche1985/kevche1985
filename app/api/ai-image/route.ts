import { NextResponse } from "next/server"
import OpenAI from "openai"

export const runtime = "nodejs"

export async function POST(request: Request) {
  console.log("AI Image API called")

  try {
    // Parse the request body
    const body = await request.json()
    const { prompt } = body

    // Validate the prompt
    if (!prompt) {
      console.error("No prompt provided")
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    console.log("Generating image with prompt:", prompt)

    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error("No API key found")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: false,
    })

    // Generate the image
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    })

    // Extract the image URL
    const imageUrl = response.data[0]?.url
    if (!imageUrl) {
      console.error("No image URL in response")
      return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
    }

    console.log("Image generated successfully")

    // Return the image URL
    return NextResponse.json({ imageUrl })
  } catch (error) {
    // Log and return any errors
    console.error("Error in image generation:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
