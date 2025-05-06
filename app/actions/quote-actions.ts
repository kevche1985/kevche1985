"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { QuoteStatus } from "@/types/supabase"

export async function getQuotes(status?: QuoteStatus) {
  const supabase = createServerSupabaseClient()

  let query = supabase.from("quotes").select(`
    *,
    quote_items (*)
  `)

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching quotes:", error)
    throw new Error(error.message)
  }

  return data
}

export async function getQuoteById(id: string) {
  const supabase = createServerSupabaseClient()

  const { data: quote, error: quoteError } = await supabase.from("quotes").select("*").eq("id", id).single()

  if (quoteError) {
    console.error("Error fetching quote:", quoteError)
    throw new Error(quoteError.message)
  }

  const { data: items, error: itemsError } = await supabase.from("quote_items").select("*").eq("quote_id", id)

  if (itemsError) {
    console.error("Error fetching quote items:", itemsError)
    throw new Error(itemsError.message)
  }

  return { quote, items }
}

export async function createQuote(formData: FormData) {
  const supabase = createServerSupabaseClient()

  // Extract form data
  const customerName = formData.get("customerName") as string
  const customerEmail = formData.get("customerEmail") as string
  const customerPhone = formData.get("customerPhone") as string
  const subtotal = Number.parseFloat(formData.get("subtotal") as string)
  const tax = Number.parseFloat(formData.get("tax") as string)
  const discount = Number.parseFloat(formData.get("discount") as string)
  const total = Number.parseFloat(formData.get("total") as string)
  const validUntil = formData.get("validUntil") as string
  const notes = formData.get("notes") as string
  const createdBy = formData.get("createdBy") as string
  const itemsJson = formData.get("items") as string

  // Parse items
  let items = []
  try {
    items = JSON.parse(itemsJson)
  } catch (error) {
    console.error("Error parsing items:", error)
    throw new Error("Invalid items format")
  }

  // Generate a unique quote number
  const timestamp = Date.now().toString()
  const randomPart = Math.floor(1000 + Math.random() * 9000).toString()
  const quoteNumber = `Q-${timestamp.substring(timestamp.length - 6)}-${randomPart}`

  // Create the quote
  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .insert({
      quote_number: quoteNumber,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      subtotal,
      tax,
      discount,
      total,
      currency: "USD", // Default currency
      status: "draft",
      valid_until: validUntil,
      notes: notes || null,
      created_by: createdBy,
    })
    .select()
    .single()

  if (quoteError) {
    console.error("Error creating quote:", quoteError)
    throw new Error(quoteError.message)
  }

  // Create quote items
  if (items.length > 0) {
    const quoteItems = items.map((item: any) => ({
      quote_id: quote.id,
      product_id: item.productId || null,
      variant_id: item.variantId || null,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total: item.total,
      customizations: item.customizations || null,
    }))

    const { error: itemsError } = await supabase.from("quote_items").insert(quoteItems)

    if (itemsError) {
      console.error("Error creating quote items:", itemsError)
      throw new Error(itemsError.message)
    }
  }

  revalidatePath("/admin/quotes")
  return quote
}

export async function updateQuoteStatus(id: string, status: QuoteStatus) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("quotes")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating quote status:", error)
    throw new Error(error.message)
  }

  revalidatePath("/admin/quotes")
  revalidatePath(`/admin/quotes/${id}`)
  return data
}

export async function convertQuoteToOrder(id: string) {
  try {
    const response = await fetch(`/api/quotes/${id}/convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to convert quote to order")
    }

    const data = await response.json()

    revalidatePath("/admin/quotes")
    revalidatePath(`/admin/quotes/${id}`)
    revalidatePath("/admin/orders")

    return data.order
  } catch (error) {
    console.error("Error converting quote to order:", error)
    throw error
  }
}

export async function deleteQuote(id: string) {
  const supabase = createServerSupabaseClient()

  // Delete quote items first (due to foreign key constraint)
  const { error: itemsError } = await supabase.from("quote_items").delete().eq("quote_id", id)

  if (itemsError) {
    console.error("Error deleting quote items:", itemsError)
    throw new Error(itemsError.message)
  }

  // Then delete the quote
  const { error: quoteError } = await supabase.from("quotes").delete().eq("id", id)

  if (quoteError) {
    console.error("Error deleting quote:", quoteError)
    throw new Error(quoteError.message)
  }

  revalidatePath("/admin/quotes")
  return { success: true }
}
