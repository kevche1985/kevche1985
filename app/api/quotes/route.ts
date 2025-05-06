import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const customerId = searchParams.get("customerId")

    const supabase = createServerSupabaseClient()

    let query = supabase.from("quotes").select(`
      *,
      quote_items (*)
    `)

    if (status) {
      query = query.eq("status", status)
    }

    if (customerId) {
      query = query.eq("customer_id", customerId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching quotes:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ quotes: data })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = createServerSupabaseClient()

    // Generate a unique quote number
    const timestamp = Date.now().toString()
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString()
    const quoteNumber = `Q-${timestamp.substring(timestamp.length - 6)}-${randomPart}`

    // Create the quote
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .insert({
        ...body,
        quote_number: quoteNumber,
        status: body.status || "draft",
      })
      .select()
      .single()

    if (quoteError) {
      console.error("Error creating quote:", quoteError)
      return NextResponse.json({ error: quoteError.message }, { status: 500 })
    }

    // Create quote items if provided
    if (body.items && body.items.length > 0) {
      const quoteItems = body.items.map((item: any) => ({
        ...item,
        quote_id: quote.id,
      }))

      const { error: itemsError } = await supabase.from("quote_items").insert(quoteItems)

      if (itemsError) {
        console.error("Error creating quote items:", itemsError)
        return NextResponse.json({ error: itemsError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ quote })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
