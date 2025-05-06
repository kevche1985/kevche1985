import { NextResponse } from "next/server"
import { mailService } from "@/lib/mail"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.email) {
      return NextResponse.json({ success: false, message: "Email address is required" }, { status: 400 })
    }

    const subject = body.subject || "Test Email from Delivery on Demand"
    const html = body.html || "<p>This is a test email from Delivery on Demand.</p>"

    const success = await mailService.sendEmail({
      to: body.email,
      subject,
      html,
    })

    if (success) {
      return NextResponse.json({ success: true, message: "Test email sent successfully" })
    } else {
      return NextResponse.json({ success: false, message: "Failed to send test email" }, { status: 500 })
    }
  } catch (error) {
    await logger.error("api", "Failed to send test email", { error: error.message })
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}
