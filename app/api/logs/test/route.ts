import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"

export async function POST() {
  try {
    // Create a test log entry
    await logger.info("system", "Test log entry created", { timestamp: Date.now() })

    // Create additional log entries of different levels
    await logger.debug("system", "Debug test message", { detail: "This is a debug message" })
    await logger.warn("system", "Warning test message", { detail: "This is a warning message" })
    await logger.error("system", "Error test message", { detail: "This is an error message" })

    return NextResponse.json({ success: true, message: "Test logs created" })
  } catch (error) {
    console.error("Error creating test logs:", error)
    return NextResponse.json({ error: "Failed to create test logs" }, { status: 500 })
  }
}
