import type { Supplier, SupplierRepository } from "../models/supplier"
import {
  setValue,
  getValue,
  getMultipleValues,
  addToSet,
  getSetMembers,
  removeFromSet,
  incrementCounter,
  deleteValue,
} from "../lib/kv-store"

export class RedisSupplierRepository implements SupplierRepository {
  private readonly supplierPrefix = "supplier:"
  private readonly supplierIdCounter = "counter:supplier:id"
  private readonly supplierList = "list:suppliers"

  async createSupplier(supplierData: Omit<Supplier, "id" | "createdAt" | "updatedAt">): Promise<Supplier> {
    const id = `supplier_${await incrementCounter(this.supplierIdCounter)}`
    const now = new Date().toISOString()

    const supplier: Supplier = {
      ...supplierData,
      id,
      createdAt: now,
      updatedAt: now,
    }

    // Store the supplier
    await setValue(`${this.supplierPrefix}${id}`, supplier)

    // Add to supplier list
    await addToSet(this.supplierList, id)

    return supplier
  }

  async getSupplierById(id: string): Promise<Supplier | null> {
    return getValue<Supplier>(`${this.supplierPrefix}${id}`)
  }

  async updateSupplier(id: string, updates: Partial<Omit<Supplier, "id" | "createdAt">>): Promise<Supplier | null> {
    const supplier = await this.getSupplierById(id)
    if (!supplier) return null

    const updatedSupplier: Supplier = {
      ...supplier,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await setValue(`${this.supplierPrefix}${id}`, updatedSupplier)

    return updatedSupplier
  }

  async deleteSupplier(id: string): Promise<boolean> {
    const supplier = await this.getSupplierById(id)
    if (!supplier) return false

    // Remove from supplier list
    await removeFromSet(this.supplierList, id)

    // Delete supplier
    await deleteValue(`${this.supplierPrefix}${id}`)

    return true
  }

  async listSuppliers(page = 1, limit = 20): Promise<Supplier[]> {
    const supplierIds = await getSetMembers(this.supplierList)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = supplierIds.slice(start, end)

    const supplierKeys = paginatedIds.map((id) => `${this.supplierPrefix}${id}`)
    const suppliers = await getMultipleValues<Supplier>(supplierKeys)

    return suppliers.filter((supplier): supplier is Supplier => supplier !== null)
  }

  async searchSuppliers(query: string): Promise<Supplier[]> {
    // This is a simple implementation that searches by supplier ID
    // In a real application, you might want to implement more sophisticated search
    const supplierIds = await getSetMembers(this.supplierList)
    const matchingIds = supplierIds.filter((id) => id.includes(query))

    const supplierKeys = matchingIds.map((id) => `${this.supplierPrefix}${id}`)
    const suppliers = await getMultipleValues<Supplier>(supplierKeys)

    return suppliers.filter((supplier): supplier is Supplier => supplier !== null)
  }
}
