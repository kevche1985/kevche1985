import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    const { data: quote, error: quoteError } = await supabase.from("quotes").select("*").eq("id", params.id).single()

    if (quoteError) {
      console.error("Error fetching quote:", quoteError)
      return NextResponse.json({ error: quoteError.message }, { status: 500 })
    }

    const { data: items, error: itemsError } = await supabase.from("quote_items").select("*").eq("quote_id", params.id)

    if (itemsError) {
      console.error("Error fetching quote items:", itemsError)
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    return NextResponse.json({ quote, items })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = createServerSupabaseClient()

    // Update the quote
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (quoteError) {
      console.error("Error updating quote:", quoteError)
      return NextResponse.json({ error: quoteError.message }, { status: 500 })
    }

    // Update quote items if provided
    if (body.items && body.items.length > 0) {
      // First delete existing items
      const { error: deleteError } = await supabase.from("quote_items").delete().eq("quote_id", params.id)

      if (deleteError) {
        console.error("Error deleting quote items:", deleteError)
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }

      // Then insert new items
      const quoteItems = body.items.map((item: any) => ({
        ...item,
        quote_id: params.id,
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    // Delete quote items first (due to foreign key constraint)
    const { error: itemsError } = await supabase.from("quote_items").delete().eq("quote_id", params.id)

    if (itemsError) {
      console.error("Error deleting quote items:", itemsError)
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    // Then delete the quote
    const { error: quoteError } = await supabase.from("quotes").delete().eq("id", params.id)

    if (quoteError) {
      console.error("Error deleting quote:", quoteError)
      return NextResponse.json({ error: quoteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
