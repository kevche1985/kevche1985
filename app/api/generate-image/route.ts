import { type NextRequest, NextResponse } from "next/server"

// Explicitly set this as a server-side only route
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  console.log("Image generation API route called")

  try {
    // Parse the request body
    const body = await request.json()
    const { prompt, style } = body

    console.log("Request body:", body)

    // Validate required fields
    if (!prompt) {
      console.error("Missing required field: prompt")
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    console.log("Generating image for prompt:", prompt, "with style:", style)

    try {
      // Get API key from environment variable - NEVER hardcode API keys
      const apiKey = process.env.OPENAI_API_KEY

      if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables")
      }

      // Enhance the prompt based on the selected style
      let enhancedPrompt = prompt
      if (style) {
        switch (style) {
          case "realistic":
            enhancedPrompt = `A photorealistic image of ${prompt}. Highly detailed, professional photography.`
            break
          case "vivid":
            enhancedPrompt = `A vibrant, colorful image of ${prompt}. Bold colors, high contrast.`
            break
          case "minimalist":
            enhancedPrompt = `A minimalist design of ${prompt}. Clean lines, simple shapes, limited color palette.`
            break
          case "abstract":
            enhancedPrompt = `An abstract representation of ${prompt}. Creative, artistic, non-literal interpretation.`
            break
          case "3d":
            enhancedPrompt = `A 3D rendered image of ${prompt}. Detailed textures, professional lighting.`
            break
          case "sketch":
            enhancedPrompt = `A detailed pencil sketch of ${prompt}. Fine lines, artistic shading.`
            break
          default:
            enhancedPrompt = prompt
        }
      }

      console.log("Sending request to OpenAI API with enhanced prompt:", enhancedPrompt)

      // Make direct API call to OpenAI
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: enhancedPrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "url",
        }),
      })

      // Handle API errors
      if (!response.ok) {
        const errorData = await response.json()
        console.error("OpenAI API error response:", errorData)
        throw new Error(errorData.error?.message || "Failed to generate image")
      }

      const data = await response.json()
      console.log("OpenAI API response received successfully")

      // Validate response data
      if (!data.data || !data.data[0] || !data.data[0].url) {
        console.error("Invalid response format from OpenAI:", data)
        throw new Error("Invalid response format from OpenAI")
      }

      const imageUrl = data.data[0].url
      console.log("Image URL generated successfully")

      return NextResponse.json({ imageUrl, isAIGenerated: true })
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError)

      // Fall back to mock image generator if OpenAI fails
      console.log("Falling back to mock image generator")
      return generateMockImage(request, prompt)
    }
  } catch (error) {
    console.error("Image generation error:", error)
    return NextResponse.json(
      {
        error: `Error generating image: ${error instanceof Error ? error.message : String(error)}`,
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

// Helper function to generate mock images
function generateMockImage(request: NextRequest, prompt: string) {
  // Create a placeholder URL with the prompt
  const placeholderUrl = `/placeholder.svg?height=1024&width=1024&text=${encodeURIComponent(prompt)}`

  // Add the full URL path
  const fullImageUrl = `${request.nextUrl.origin}${placeholderUrl}`
  console.log("Mock image URL:", fullImageUrl)

  return NextResponse.json({
    imageUrl: fullImageUrl,
    note: "Using mock image generator for demonstration purposes",
  })
}
