import { NextResponse } from "next/server"
import { kv } from "@/lib/kv-store"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    const keys = await kv.keys("email:template:*")

    // Extract just the template keys without the prefix
    const templateKeys = keys.map((key) => key.replace("email:template:", ""))

    return NextResponse.json({ success: true, templates: templateKeys })
  } catch (error) {
    await logger.error("api", "Failed to get email templates", { error: error.message })
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}
