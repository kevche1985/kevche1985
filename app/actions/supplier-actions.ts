"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/database"

export async function getSuppliers() {
  try {
    const suppliers = await db.suppliers.getAllSuppliers()
    return { success: true, data: suppliers }
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return { success: false, error: "Failed to fetch suppliers" }
  }
}

export async function getSupplierById(id: string) {
  try {
    const supplier = await db.suppliers.getSupplierById(id)
    if (!supplier) {
      return { success: false, error: "Supplier not found" }
    }
    return { success: true, data: supplier }
  } catch (error) {
    console.error(`Error fetching supplier ${id}:`, error)
    return { success: false, error: "Failed to fetch supplier" }
  }
}

export async function createSupplier(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const contactPerson = formData.get("contactPerson") as string
    const notes = formData.get("notes") as string

    if (!name || !email || !contactPerson) {
      return { success: false, error: "Name, email, and contact person are required" }
    }

    const supplier = await db.suppliers.createSupplier({
      name,
      email,
      phone,
      address,
      contactPerson,
      notes,
    })

    revalidatePath("/admin/suppliers")
    return { success: true, data: supplier }
  } catch (error) {
    console.error("Error creating supplier:", error)
    return { success: false, error: "Failed to create supplier" }
  }
}

export async function updateSupplier(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const contactPerson = formData.get("contactPerson") as string
    const notes = formData.get("notes") as string

    if (!id || !name || !email || !contactPerson) {
      return { success: false, error: "ID, name, email, and contact person are required" }
    }

    const supplier = await db.suppliers.updateSupplier(id, {
      name,
      email,
      phone,
      address,
      contactPerson,
      notes,
    })

    revalidatePath("/admin/suppliers")
    return { success: true, data: supplier }
  } catch (error) {
    console.error("Error updating supplier:", error)
    return { success: false, error: "Failed to update supplier" }
  }
}

export async function deleteSupplier(id: string) {
  try {
    await db.suppliers.deleteSupplier(id)
    revalidatePath("/admin/suppliers")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting supplier ${id}:`, error)
    return { success: false, error: "Failed to delete supplier" }
  }
}

export async function reassignOrderToSupplier(orderId: string, supplierId: string) {
  try {
    // First check if the supplier exists
    const supplier = await db.suppliers.getSupplierById(supplierId)
    if (!supplier) {
      return { success: false, error: "Supplier not found" }
    }

    // Then check if the order exists
    const order = await db.orders.getOrderById(orderId)
    if (!order) {
      return { success: false, error: "Order not found" }
    }

    // Update the order with the new supplier ID
    const updatedOrder = await db.orders.updateOrder(orderId, {
      ...order,
      supplierId,
    })

    // Send email notification to the new supplier
    // This would be implemented in a real application
    // await sendOrderNotification(supplier.email, orderId)

    revalidatePath("/admin/orders")
    return { success: true, data: updatedOrder }
  } catch (error) {
    console.error(`Error reassigning order ${orderId} to supplier ${supplierId}:`, error)
    return { success: false, error: "Failed to reassign order" }
  }
}
