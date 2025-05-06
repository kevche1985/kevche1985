import { NextResponse } from "next/server"
import { setValue, getValue } from "@/lib/kv-store"

export async function GET() {
  try {
    // Test basic database operations
    const testKey = "api:test:key"
    const testValue = {
      message: "Database connection test",
      timestamp: new Date().toISOString(),
    }

    // Set a value
    await setValue(testKey, testValue)

    // Get the value back
    const retrievedValue = await getValue(testKey)

    // Check if the retrieved value matches what we set
    const success = retrievedValue && retrievedValue.message === testValue.message

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Database connection successful",
        test: retrievedValue,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Database test failed - retrieved value doesn't match",
          expected: testValue,
          got: retrievedValue,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
