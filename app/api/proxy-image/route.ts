import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    console.log("Proxying image from:", imageUrl)

    // Fetch the image from the external URL
    const imageResponse = await fetch(imageUrl, {
      headers: {
        // Add a user agent to avoid being blocked by some servers
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!imageResponse.ok) {
      console.error("Failed to fetch image:", imageResponse.status, imageResponse.statusText)
      return NextResponse.json(
        {
          error: `Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`,
        },
        { status: 500 },
      )
    }

    // Get the image data as an array buffer
    const imageBuffer = await imageResponse.arrayBuffer()

    // Get the content type from the response
    const contentType = imageResponse.headers.get("content-type") || "image/png"

    // Return the image data with the appropriate content type
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (error) {
    console.error("Error proxying image:", error)
    return NextResponse.json(
      {
        error: `Error proxying image: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
