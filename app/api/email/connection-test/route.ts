import { NextResponse } from "next/server"

// Extremely simplified connection test route - using function declaration
export function POST() {
  return NextResponse.json({
    success: true,
    message: "Connection test simulated successfully",
    previewMode: true,
  })
}
