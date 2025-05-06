import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/mail"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Check authentication for sensitive operations
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "operator")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const body = await request.json()
    const { to, subject, text, html, replyTo, attachments } = body

    // Validate required fields
    if (!to || !subject || (!text && !html)) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Send the email
    const success = await sendEmail({
      to,
      subject,
      text,
      html,
      replyTo,
      attachments,
    })

    if (success) {
      return NextResponse.json({ success: true, message: "Email sent successfully" })
    } else {
      return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in email API:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
