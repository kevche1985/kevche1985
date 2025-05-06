import { type NextRequest, NextResponse } from "next/server"
import { logger, type LogLevel } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10)
    const level = searchParams.get("level") as LogLevel | undefined
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const startDate = searchParams.get("startDate") ? Number.parseInt(searchParams.get("startDate")!, 10) : undefined
    const endDate = searchParams.get("endDate") ? Number.parseInt(searchParams.get("endDate")!, 10) : undefined

    // Get logs with error handling
    let logs = []
    try {
      logs = await logger.getLogs(offset, limit, {
        level,
        category,
        search,
        startDate,
        endDate,
      })
    } catch (error) {
      console.error("Error retrieving logs:", error)
      logs = []
    }

    // Get categories with error handling
    let categories = []
    try {
      categories = await logger.getCategories()
    } catch (error) {
      console.error("Error retrieving categories:", error)
      categories = []
    }

    // Always return a valid JSON response
    return NextResponse.json({ logs, categories })
  } catch (error) {
    console.error("Error in logs API route:", error)
    // Return a valid JSON response even in case of error
    return NextResponse.json({
      logs: [],
      categories: [],
      error: "An error occurred while fetching logs",
    })
  }
}

export async function DELETE() {
  try {
    await logger.clearLogs()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error clearing logs:", error)
    return NextResponse.json(
      {
        error: "Failed to clear logs",
        success: false,
      },
      { status: 500 },
    )
  }
}
