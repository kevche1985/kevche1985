"use server"

import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { OrderItem, OrderAddress } from "@/models/order"

export async function createOrder(formData: FormData) {
  const user = await getCurrentUser()

  // Get form data
  const email = formData.get("email") as string
  const itemsJson = formData.get("items") as string
  const subtotal = Number.parseFloat(formData.get("subtotal") as string)
  const tax = Number.parseFloat(formData.get("tax") as string)
  const shipping = Number.parseFloat(formData.get("shipping") as string)
  const discount = Number.parseFloat(formData.get("discount") as string)
  const total = Number.parseFloat(formData.get("total") as string)
  const currency = (formData.get("currency") as string) || "USD"
  const shippingAddressJson = formData.get("shippingAddress") as string
  const billingAddressJson = formData.get("billingAddress") as string
  const paymentMethod = formData.get("paymentMethod") as string
  const notes = formData.get("notes") as string

  if (!email || !itemsJson || isNaN(subtotal) || isNaN(total)) {
    return { success: false, message: "Required fields are missing or invalid" }
  }

  let items: OrderItem[]
  try {
    items = JSON.parse(itemsJson)
  } catch (error) {
    return { success: false, message: "Invalid items format" }
  }

  let shippingAddress: OrderAddress | undefined
  if (shippingAddressJson) {
    try {
      shippingAddress = JSON.parse(shippingAddressJson)
    } catch (error) {
      return { success: false, message: "Invalid shipping address format" }
    }
  }

  let billingAddress: OrderAddress | undefined
  if (billingAddressJson) {
    try {
      billingAddress = JSON.parse(billingAddressJson)
    } catch (error) {
      return { success: false, message: "Invalid billing address format" }
    }
  }

  // Determine the supplier ID based on the products in the order
  // For simplicity, we'll assume all items in the order come from the same supplier
  const firstItem = items[0]
  const product = await db.products.getProductById(firstItem.productId)
  const supplierId = product ? product.supplierId : "default-supplier" // Replace "default-supplier" with a default supplier ID

  // Create the order
  const order = await db.orders.createOrder({
    userId: user?.id,
    email,
    items,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    currency,
    status: "checkout",
    shippingAddress,
    billingAddress,
    paymentMethod,
    notes,
    payments: [],
    supplierId: supplierId, // ADDED: Supplier ID
  })

  revalidatePath("/my-print/orders")

  return { success: true, orderId: order.id }
}

export async function addPaymentToOrder(orderId: string, formData: FormData) {
  const user = await getCurrentUser()

  // Get the order
  const order = await db.orders.getOrderById(orderId)

  if (!order) {
    return { success: false, message: "Order not found" }
  }

  // Check if the user owns the order or is an admin
  if (order.userId && order.userId !== user?.id && user?.role !== "admin") {
    return { success: false, message: "You do not have permission to update this order" }
  }

  const method = formData.get("method") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const status = formData.get("status") as "pending" | "completed" | "failed" | "refunded"
  const transactionId = formData.get("transactionId") as string
  const metadataJson = formData.get("metadata") as string

  if (!method || isNaN(amount) || !status) {
    return { success: false, message: "Required payment fields are missing or invalid" }
  }

  let metadata: Record<string, any> | undefined
  if (metadataJson) {
    try {
      metadata = JSON.parse(metadataJson)
    } catch (error) {
      return { success: false, message: "Invalid payment metadata format" }
    }
  }

  // Add the payment
  await db.orders.addPayment(orderId, {
    method,
    amount,
    status,
    transactionId,
    metadata,
  })

  // If payment is completed, update order status
  if (status === "completed") {
    await db.orders.updateOrderStatus(orderId, "payment_completed", "Payment received")
  }

  revalidatePath("/my-print/orders")
  revalidatePath(`/my-print/orders/${orderId}`)

  return { success: true, orderId }
}

export async function updateOrderStatus(orderId: string, status: string, note?: string) {
  const user = await getCurrentUser()

  if (!user || (user.role !== "admin" && user.role !== "operator")) {
    return { success: false, message: "You do not have permission to update order status" }
  }

  // Get the order
  const order = await db.orders.getOrderById(orderId)

  if (!order) {
    return { success: false, message: "Order not found" }
  }

  await db.orders.updateOrderStatus(orderId, status as any, note)

  revalidatePath("/admin/orders")
  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath("/my-print/orders")
  revalidatePath(`/my-print/orders/${orderId}`)

  return { success: true, orderId }
}

export async function getUserOrders(page = 1, limit = 20) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to view your orders" }
  }

  const orders = await db.orders.listOrdersByUser(user.id, page, limit)

  return { success: true, orders }
}
