import { type NextRequest, NextResponse } from "next/server"

// Explicitly set this as a server-side only route
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  console.log("Font generation API route called")

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

    console.log("Preparing request to OpenAI API")

    // Direct API call to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a typography expert. Generate font suggestions based on the user's description.
            For each font, provide:
            1. Font name
            2. Classification (serif, sans-serif, display, etc.)
            3. Key characteristics
            4. Best use cases
            5. Similar fonts
            
            Format your response as a JSON object with a "fonts" array containing 3 font suggestions, each with the properties:
            {
              "fonts": [
                {
                  "name": "Font Name",
                  "classification": "Font Classification",
                  "characteristics": ["characteristic1", "characteristic2", "characteristic3"],
                  "useCases": ["use case 1", "use case 2", "use case 3"],
                  "similarFonts": ["Similar Font 1", "Similar Font 2"]
                },
                ...
              ]
            }`,
          },
          {
            role: "user",
            content: `Suggest fonts for: ${prompt}`,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    })

    console.log("OpenAI API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("OpenAI API error:", errorData)
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("OpenAI API response received successfully")

    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error("Unexpected response structure from OpenAI:", data)
      throw new Error("Unexpected response structure from OpenAI")
    }

    const content = data.choices[0].message.content

    try {
      const fontSuggestions = JSON.parse(content)

      // Validate the parsed content has the expected structure
      if (!fontSuggestions.fonts || !Array.isArray(fontSuggestions.fonts)) {
        console.error("Invalid font suggestions format:", fontSuggestions)
        throw new Error("Invalid font suggestions format")
      }

      console.log("Font suggestions generated successfully")
      return NextResponse.json(fontSuggestions)
    } catch (parseError) {
      console.error("Error parsing font suggestions:", parseError)

      // Fallback to mock data if parsing fails
      console.log("Using fallback font suggestions")
      return NextResponse.json({
        fonts: [
          {
            name: "Montserrat",
            classification: "Sans-serif",
            characteristics: ["Modern", "Geometric", "Versatile"],
            useCases: ["Corporate branding", "Digital interfaces", "Headings"],
            similarFonts: ["Proxima Nova", "Gotham", "Avenir"],
          },
          {
            name: "Playfair Display",
            classification: "Serif",
            characteristics: ["Elegant", "Transitional", "High contrast"],
            useCases: ["Editorial design", "Luxury branding", "Headlines"],
            similarFonts: ["Didot", "Baskerville", "Bodoni"],
          },
          {
            name: "Roboto",
            classification: "Sans-serif",
            characteristics: ["Clean", "Neutral", "Highly readable"],
            useCases: ["User interfaces", "Mobile apps", "Body text"],
            similarFonts: ["Open Sans", "Helvetica", "Arial"],
          },
        ],
      })
    }
  } catch (error) {
    console.error("Font generation error:", error)

    // Return detailed error information
    return NextResponse.json(
      {
        error: `Error generating font suggestions: ${error instanceof Error ? error.message : String(error)}`,
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
