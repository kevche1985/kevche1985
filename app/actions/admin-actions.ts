"use server"

import { db } from "@/lib/database"
import { getCurrentUser, hashPassword } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { UserRole } from "@/models/user"
import { createClient } from "@supabase/supabase-js"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Initialize the Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// User management actions
export async function createUser(formData: FormData) {
  try {
    const supabase = createServerActionClient({ cookies })

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = (formData.get("role") as string) || "user"

    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    })

    if (authError) {
      console.error("Error creating auth user:", authError)
      return { success: false, message: authError.message }
    }

    // Then create the user record in the users table
    const now = new Date().toISOString()
    const { error: dbError } = await supabase.from("users").insert({
      id: authData.user.id,
      email,
      name,
      role,
      is_active: true,
      created_at: now,
      updated_at: now,
    })

    if (dbError) {
      console.error("Error creating user record:", dbError)
      // Try to clean up the auth user if the DB insert fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { success: false, message: dbError.message }
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error in createUser:", error)
    return { success: false, message: "Failed to create user" }
  }
}

export async function updateUser(userId: string, formData: FormData) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== "admin") {
    return { success: false, message: "You do not have permission to update users" }
  }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const role = formData.get("role") as UserRole
  const isActive = formData.get("isActive") === "true"
  const password = formData.get("password") as string

  if (!name || !email || !role) {
    return { success: false, message: "Name, email, and role are required" }
  }

  // Get the user
  const user = await db.users.getUserById(userId)

  if (!user) {
    return { success: false, message: "User not found" }
  }

  // Check if email is changing and if it's already in use
  if (email !== user.email) {
    const existingUser = await db.users.getUserByEmail(email)

    if (existingUser) {
      return { success: false, message: "Email is already in use by another user" }
    }
  }

  // Prepare updates
  const updates: any = {
    name,
    email,
    role,
    isActive,
  }

  // If password is provided, hash it
  if (password) {
    updates.passwordHash = await hashPassword(password)
  }

  // Update the user
  await db.users.updateUser(userId, updates)

  revalidatePath("/admin/users")

  return { success: true, userId }
}

export async function deleteUser(userId: string) {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    return { success: false, message: "You do not have permission to delete users" }
  }

  // Prevent deleting yourself
  if (userId === user.id) {
    return { success: false, message: "You cannot delete your own account" }
  }

  await db.users.deleteUser(userId)

  revalidatePath("/admin/users")

  return { success: true }
}

// Product management actions
export async function createProduct(formData: FormData) {
  const user = await getCurrentUser()

  if (!user || (user.role !== "admin" && user.role !== "operator")) {
    return { success: false, message: "You do not have permission to create products" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const imagesJson = formData.get("images") as string
  const variantsJson = formData.get("variants") as string
  const tagsString = formData.get("tags") as string
  const isActive = formData.get("isActive") === "true"
  const isFeatured = formData.get("isFeatured") === "true"

  if (!name || !description || !category || !imagesJson || !variantsJson) {
    return { success: false, message: "Required fields are missing" }
  }

  let images, variants
  try {
    images = JSON.parse(imagesJson)
    variants = JSON.parse(variantsJson)
  } catch (error) {
    return { success: false, message: "Invalid JSON format for images or variants" }
  }

  const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : undefined

  const product = await db.products.createProduct({
    name,
    description,
    category,
    images,
    variants,
    tags,
    isActive,
    isFeatured,
  })

  revalidatePath("/admin/products")
  revalidatePath("/products")

  return { success: true, productId: product.id }
}

export async function updateProduct(productId: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user || (user.role !== "admin" && user.role !== "operator")) {
    return { success: false, message: "You do not have permission to update products" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const imagesJson = formData.get("images") as string
  const variantsJson = formData.get("variants") as string
  const tagsString = formData.get("tags") as string
  const isActive = formData.get("isActive") === "true"
  const isFeatured = formData.get("isFeatured") === "true"

  if (!name || !description || !category || !imagesJson || !variantsJson) {
    return { success: false, message: "Required fields are missing" }
  }

  let images, variants
  try {
    images = JSON.parse(imagesJson)
    variants = JSON.parse(variantsJson)
  } catch (error) {
    return { success: false, message: "Invalid JSON format for images or variants" }
  }

  const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : undefined

  await db.products.updateProduct(productId, {
    name,
    description,
    category,
    images,
    variants,
    tags,
    isActive,
    isFeatured,
  })

  revalidatePath("/admin/products")
  revalidatePath("/products")
  revalidatePath(`/products/${category.toLowerCase()}/${productId}`)

  return { success: true, productId }
}

export async function deleteProduct(productId: string) {
  const user = await getCurrentUser()

  if (!user || (user.role !== "admin" && user.role !== "operator")) {
    return { success: false, message: "You do not have permission to delete products" }
  }

  await db.products.deleteProduct(productId)

  revalidatePath("/admin/products")
  revalidatePath("/products")

  return { success: true }
}

// Quote management actions
export async function createQuote(formData: FormData) {
  const user = await getCurrentUser()

  if (!user || (user.role !== "admin" && user.role !== "operator")) {
    return { success: false, message: "You do not have permission to create quotes" }
  }

  const customerName = formData.get("customerName") as string
  const customerEmail = formData.get("customerEmail") as string
  const customerPhone = formData.get("customerPhone") as string
  const customerId = formData.get("customerId") as string
  const itemsJson = formData.get("items") as string
  const subtotal = Number.parseFloat(formData.get("subtotal") as string)
  const tax = Number.parseFloat(formData.get("tax") as string)
  const discount = Number.parseFloat(formData.get("discount") as string)
  const total = Number.parseFloat(formData.get("total") as string)
  const currency = (formData.get("currency") as string) || "USD"
  const validUntil = formData.get("validUntil") as string
  const notes = formData.get("notes") as string

  if (!customerName || !customerEmail || !itemsJson || isNaN(subtotal) || isNaN(total) || !validUntil) {
    return { success: false, message: "Required fields are missing or invalid" }
  }

  let items
  try {
    items = JSON.parse(itemsJson)
  } catch (error) {
    return { success: false, message: "Invalid JSON format for items" }
  }

  const quote = await db.quotes.createQuote({
    customerName,
    customerEmail,
    customerPhone,
    customerId,
    items,
    subtotal,
    tax,
    discount,
    total,
    currency,
    status: "draft",
    validUntil,
    notes,
    createdBy: user.id,
  })

  revalidatePath("/admin/quotes")

  return { success: true, quoteId: quote.id }
}

export async function updateQuoteStatus(quoteId: string, status: string) {
  const user = await getCurrentUser()

  if (!user || (user.role !== "admin" && user.role !== "operator")) {
    return { success: false, message: "You do not have permission to update quotes" }
  }

  await db.quotes.updateQuoteStatus(quoteId, status as any)

  revalidatePath("/admin/quotes")

  return { success: true, quoteId }
}

export async function convertQuoteToOrder(quoteId: string, orderId: string) {
  const user = await getCurrentUser()

  if (!user || (user.role !== "admin" && user.role !== "operator")) {
    return { success: false, message: "You do not have permission to convert quotes" }
  }

  await db.quotes.convertQuoteToOrder(quoteId, orderId)

  revalidatePath("/admin/quotes")
  revalidatePath("/admin/orders")

  return { success: true, quoteId, orderId }
}

// Other admin actions can be added here
