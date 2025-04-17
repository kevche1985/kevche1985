import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("Mock logo generator API route called")

  try {
    // Parse the request body
    const { businessName } = await request.json()

    // Validate required fields
    if (!businessName) {
      return NextResponse.json({ error: "Business name is required" }, { status: 400 })
    }

    // Generate a random logo URL from a set of placeholder images
    const placeholderLogos = [
      "/abstract-professional-logo.png",
      "/abstract-geometric-logo.png",
      "/abstract-leaf-logo.png",
    ]

    const logoUrl = placeholderLogos[Math.floor(Math.random() * placeholderLogos.length)]

    console.log("Mock logo generated successfully:", logoUrl)
    return NextResponse.json({ logoUrl })
  } catch (error) {
    console.error("Mock logo generation error:", error)
    return NextResponse.json(
      { error: `Error generating mock logo: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
