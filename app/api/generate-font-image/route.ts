import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  console.log("Font image generation API route called")

  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error("OpenAI API key is not set in environment variables")
      throw new Error("OpenAI API key is not set in environment variables")
    }

    console.log("Preparing request to DALL-E API")
    console.log("Prompt:", prompt)

    // Direct API call to OpenAI's DALL-E
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      }),
    })

    console.log("DALL-E API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("DALL-E API error:", errorData)
      throw new Error(`DALL-E API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("DALL-E API response received successfully")

    // Validate response structure
    if (!data.data || !data.data[0] || !data.data[0].url) {
      console.error("Unexpected response structure from DALL-E:", data)
      throw new Error("Unexpected response structure from DALL-E")
    }

    const imageUrl = data.data[0].url

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Font image generation error:", error)

    // Return detailed error information
    return NextResponse.json(
      {
        error: `Error generating font image: ${error instanceof Error ? error.message : String(error)}`,
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
