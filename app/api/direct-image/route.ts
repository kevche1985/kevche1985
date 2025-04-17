import { NextResponse } from "next/server"

export const runtime = "nodejs"

// OpenAI API endpoint for image generation
const OPENAI_API_URL = "https://api.openai.com/v1/images/generations"

export async function POST(request: Request) {
  console.log("Direct Image API called")

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

    try {
      // Make a direct fetch request to the OpenAI API
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1,
          size: "1024x1024",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("OpenAI API error response:", errorData)
        return NextResponse.json(
          {
            error: `OpenAI API error: ${errorData.error?.message || "Unknown error"}`,
          },
          { status: response.status },
        )
      }

      const data = await response.json()

      // Extract the image URL
      const imageUrl = data.data?.[0]?.url
      if (!imageUrl) {
        console.error("No image URL in response:", data)
        return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
      }

      console.log("Image generated successfully")

      // Return the image URL
      return NextResponse.json({ imageUrl })
    } catch (apiError) {
      console.error("API request error:", apiError)
      return NextResponse.json(
        { error: `API request error: ${apiError instanceof Error ? apiError.message : String(apiError)}` },
        { status: 500 },
      )
    }
  } catch (error) {
    // Log and return any errors
    console.error("Error in image generation:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Error in image generation: ${errorMessage}` }, { status: 500 })
  }
}
