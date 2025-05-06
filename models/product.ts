export interface ProductImage {
  id: string
  url: string
  alt?: string
  isPrimary: boolean
}

export interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  compareAtPrice?: number
  inventory?: number
  attributes: Record<string, string>
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  images: ProductImage[]
  variants: ProductVariant[]
  tags?: string[]
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  supplierId: string // ADDED: Supplier ID
}

export interface ProductRepository {
  createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product>
  getProductById(id: string): Promise<Product | null>
  updateProduct(id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product | null>
  deleteProduct(id: string): Promise<boolean>
  listProducts(page?: number, limit?: number): Promise<Product[]>
  listProductsByCategory(category: string, page?: number, limit?: number): Promise<Product[]>
  searchProducts(query: string): Promise<Product[]>
  setProductActive(id: string, isActive: boolean): Promise<Product | null>
  setProductFeatured(id: string, isFeatured: boolean): Promise<Product | null>
}
