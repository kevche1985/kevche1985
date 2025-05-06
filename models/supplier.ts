export interface Supplier {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  contactName?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface SupplierRepository {
  createSupplier(supplier: Omit<Supplier, "id" | "createdAt" | "updatedAt">): Promise<Supplier>
  getSupplierById(id: string): Promise<Supplier | null>
  updateSupplier(id: string, updates: Partial<Omit<Supplier, "id" | "createdAt">>): Promise<Supplier | null>
  deleteSupplier(id: string): Promise<boolean>
  listSuppliers(page?: number, limit?: number): Promise<Supplier[]>
  searchSuppliers(query: string): Promise<Supplier[]>
}
