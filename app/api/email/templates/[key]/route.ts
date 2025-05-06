import { NextResponse } from "next/server"
import { mailService } from "@/lib/mail"
import { logger } from "@/lib/logger"
import { kv } from "@vercel/kv"

export async function GET(request: Request, { params }: { params: { key: string } }) {
  try {
    const { key } = params

    if (!key) {
      return NextResponse.json({ success: false, message: "Template key is required" }, { status: 400 })
    }

    const template = await mailService.getTemplate(key)

    if (!template) {
      return NextResponse.json({ success: false, message: "Template not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, template })
  } catch (error) {
    await logger.error("api", `Failed to get email template: ${params.key}`, { error: error.message })
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { key: string } }) {
  try {
    const { key } = params

    if (!key) {
      return NextResponse.json({ success: false, message: "Template key is required" }, { status: 400 })
    }

    const body = await request.json()

    if (!body.template) {
      return NextResponse.json({ success: false, message: "Template content is required" }, { status: 400 })
    }

    const success = await mailService.saveTemplate(key, body.template)

    if (success) {
      return NextResponse.json({ success: true, message: "Template saved successfully" })
    } else {
      return NextResponse.json({ success: false, message: "Failed to save template" }, { status: 500 })
    }
  } catch (error) {
    await logger.error("api", `Failed to save email template: ${params.key}`, { error: error.message })
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { key: string } }) {
  try {
    const { key } = params

    if (!key) {
      return NextResponse.json({ success: false, message: "Template key is required" }, { status: 400 })
    }

    await kv.del(`email:template:${key}`)

    return NextResponse.json({ success: true, message: "Template deleted successfully" })
  } catch (error) {
    await logger.error("api", `Failed to delete email template: ${params.key}`, { error: error.message })
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}
