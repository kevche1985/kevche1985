"use server"

import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { DesignElement } from "@/models/design"

export async function saveDesign(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to save designs" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const elementsJson = formData.get("elements") as string
  const previewImage = formData.get("previewImage") as string
  const isPublic = formData.get("isPublic") === "true"
  const productId = (formData.get("productId") as string) || undefined
  const tagsString = formData.get("tags") as string

  if (!name || !elementsJson) {
    return { success: false, message: "Name and design elements are required" }
  }

  let elements: DesignElement[]
  try {
    elements = JSON.parse(elementsJson)
  } catch (error) {
    return { success: false, message: "Invalid design elements format" }
  }

  const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : undefined

  const design = await db.designs.createDesign({
    userId: user.id,
    name,
    description,
    elements,
    previewImage,
    isPublic,
    productId,
    tags,
  })

  revalidatePath("/my-print/designs")

  return { success: true, designId: design.id }
}

export async function updateDesign(designId: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to update designs" }
  }

  // Get the design
  const design = await db.designs.getDesignById(designId)

  if (!design) {
    return { success: false, message: "Design not found" }
  }

  // Check if the user owns the design or is an admin
  if (design.userId !== user.id && user.role !== "admin") {
    return { success: false, message: "You do not have permission to update this design" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const elementsJson = formData.get("elements") as string
  const previewImage = formData.get("previewImage") as string
  const isPublic = formData.get("isPublic") === "true"
  const productId = (formData.get("productId") as string) || undefined
  const tagsString = formData.get("tags") as string

  if (!name || !elementsJson) {
    return { success: false, message: "Name and design elements are required" }
  }

  let elements: DesignElement[]
  try {
    elements = JSON.parse(elementsJson)
  } catch (error) {
    return { success: false, message: "Invalid design elements format" }
  }

  const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : undefined

  await db.designs.updateDesign(designId, {
    name,
    description,
    elements,
    previewImage,
    isPublic,
    productId,
    tags,
  })

  revalidatePath("/my-print/designs")
  revalidatePath(`/my-print/designs/${designId}`)

  return { success: true, designId }
}

export async function deleteDesign(designId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to delete designs" }
  }

  // Get the design
  const design = await db.designs.getDesignById(designId)

  if (!design) {
    return { success: false, message: "Design not found" }
  }

  // Check if the user owns the design or is an admin
  if (design.userId !== user.id && user.role !== "admin") {
    return { success: false, message: "You do not have permission to delete this design" }
  }

  await db.designs.deleteDesign(designId)

  revalidatePath("/my-print/designs")

  return { success: true }
}

export async function getUserDesigns(page = 1, limit = 20) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to view your designs" }
  }

  const designs = await db.designs.listDesignsByUser(user.id, page, limit)

  return { success: true, designs }
}
