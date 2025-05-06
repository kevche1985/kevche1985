import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    // Get the quote and its items
    const { data: quote, error: quoteError } = await supabase.from("quotes").select("*").eq("id", params.id).single()

    if (quoteError) {
      console.error("Error fetching quote:", quoteError)
      return NextResponse.json({ error: quoteError.message }, { status: 500 })
    }

    const { data: quoteItems, error: itemsError } = await supabase
      .from("quote_items")
      .select("*")
      .eq("quote_id", params.id)

    if (itemsError) {
      console.error("Error fetching quote items:", itemsError)
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    // Generate a unique order number
    const timestamp = Date.now().toString()
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString()
    const orderNumber = `ORD-${timestamp.substring(timestamp.length - 6)}-${randomPart}`

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: quote.customer_id,
        email: quote.customer_email,
        subtotal: quote.subtotal,
        tax: quote.tax,
        discount: quote.discount,
        shipping: 0, // Default value, can be updated later
        total: quote.total,
        currency: quote.currency,
        status: "payment_pending",
        shipping_method: "delivery", // Default value, can be updated later
        notes: quote.notes,
        quote_id: quote.id,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Create order items
    const orderItems = quoteItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      name: item.description,
      price: item.unit_price,
      quantity: item.quantity,
      customizations: item.customizations,
    }))

    const { error: orderItemsError } = await supabase.from("order_items").insert(orderItems)

    if (orderItemsError) {
      console.error("Error creating order items:", orderItemsError)
      return NextResponse.json({ error: orderItemsError.message }, { status: 500 })
    }

    // Update the quote status to converted
    const { error: updateError } = await supabase
      .from("quotes")
      .update({
        status: "converted",
        converted_to_order_id: order.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (updateError) {
      console.error("Error updating quote status:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
