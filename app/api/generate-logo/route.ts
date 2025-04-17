import { type NextRequest, NextResponse } from "next/server"

// Explicitly set this as a server-side only route
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  console.log("Logo generation API route called")

  try {
    // Parse the request body
    const body = await request.json()
    const { businessName, industry, style, colors } = body

    console.log("Request body:", body)

    // Validate required fields
    if (!businessName || !industry) {
      console.error("Missing required fields:", { businessName, industry })
      return NextResponse.json({ error: "Business name and industry are required" }, { status: 400 })
    }

    console.log("Generating logo for:", { businessName, industry, style, colors })

    try {
      // Get API key from environment variable - NEVER hardcode API keys
      const apiKey = process.env.OPENAI_API_KEY

      if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables")
      }

      // Create a detailed prompt for the logo using the new format
      const prompt = `Create Your Custom Logo

Company Name: "${businessName}"

Slogan: "${body.slogan || "Innovation for Tomorrow"}"

Industry: ${industry}

Preferred Colors: ${colors || "brand appropriate"}

Additional Information: ${body.additionalInfo || style || "modern, professional style"}

The AI will generate a logo image with:
- Your company name and slogan integrated
- A clean, simple design without any background elements
- A watermark that says "PrintOnDemand" at the bottom

The logo should be simple, memorable, and work well at different sizes.
Create a clean logo with a white background, suitable for a professional business.`

      console.log("Sending request to OpenAI API")

      // Make direct API call to OpenAI
      const response = await fetch("https://api.openai.com/v1/images/generations", {
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
          quality: "standard",
          response_format: "url",
        }),
      })

      // Handle API errors
      if (!response.ok) {
        const errorData = await response.json()
        console.error("OpenAI API error response:", errorData)
        throw new Error(errorData.error?.message || "Failed to generate logo")
      }

      const data = await response.json()
      console.log("OpenAI API response received successfully")

      // Validate response data
      if (!data.data || !data.data[0] || !data.data[0].url) {
        console.error("Invalid response format from OpenAI:", data)
        throw new Error("Invalid response format from OpenAI")
      }

      const logoUrl = data.data[0].url
      console.log("Logo URL generated successfully:", logoUrl)

      return NextResponse.json({ logoUrl, isAIGenerated: true })
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError)

      // Fall back to mock logo generator if OpenAI fails
      console.log("Falling back to mock logo generator")
      return generateMockLogo(request, businessName, industry)
    }
  } catch (error) {
    console.error("Logo generation error:", error)
    return NextResponse.json(
      {
        error: `Error generating logo: ${error instanceof Error ? error.message : String(error)}`,
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

// Helper function to generate mock logos
function generateMockLogo(request: NextRequest, businessName: string, industry: string) {
  // Determine which mock logo to use based on the industry
  let logoUrl = ""

  // Simple logic to choose a logo based on industry
  if (industry.toLowerCase().includes("tech") || industry.toLowerCase().includes("tecnología")) {
    logoUrl = "/abstract-geometric-logo.png"
  } else if (
    industry.toLowerCase().includes("health") ||
    industry.toLowerCase().includes("salud") ||
    industry.toLowerCase().includes("wellness") ||
    industry.toLowerCase().includes("bienestar")
  ) {
    logoUrl = "/abstract-leaf-logo.png"
  } else {
    logoUrl = "/abstract-professional-logo.png"
  }

  // Add the full URL path
  const fullLogoUrl = `${request.nextUrl.origin}${logoUrl}`
  console.log("Mock logo URL:", fullLogoUrl)

  return NextResponse.json({
    logoUrl: fullLogoUrl,
    note: "Using mock logo generator for demonstration purposes",
  })
}
