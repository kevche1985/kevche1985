import { NextResponse } from "next/server"
import { mailService, type EmailConfig } from "@/lib/mail"

export async function POST(request: Request) {
  try {
    const config = (await request.json()) as EmailConfig

    if (!config || !config.host || !config.port || !config.auth || !config.auth.user || !config.auth.pass) {
      return NextResponse.json({ success: false, message: "Invalid configuration" }, { status: 400 })
    }

    const success = await mailService.saveConfig(config)

    if (success) {
      return NextResponse.json({ success: true, message: "Configuration saved successfully" })
    } else {
      return NextResponse.json({ success: false, message: "Failed to save configuration" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const config = await mailService.getConfig()

    if (!config) {
      return NextResponse.json({ success: false, message: "Configuration not found" }, { status: 404 })
    }

    // Don't return the password in the response
    const safeConfig = {
      ...config,
      auth: {
        ...config.auth,
        pass: config.auth.pass ? "********" : "",
      },
    }

    return NextResponse.json({ success: true, config: safeConfig })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}
