import type { Product, ProductRepository } from "../models/product"
import {
  setValue,
  getValue,
  deleteValue,
  getMultipleValues,
  addToSet,
  getSetMembers,
  removeFromSet,
  incrementCounter,
} from "../lib/kv-store"

export class RedisProductRepository implements ProductRepository {
  private readonly productPrefix = "product:"
  private readonly categoryIndex = "index:product:category:"
  private readonly tagIndex = "index:product:tag:"
  private readonly activeProductsSet = "set:products:active"
  private readonly featuredProductsSet = "set:products:featured"
  private readonly productIdCounter = "counter:product:id"
  private readonly productList = "list:products"

  async createProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const id = `product_${await incrementCounter(this.productIdCounter)}`
    const now = new Date().toISOString()

    const product: Product = {
      ...productData,
      id,
      createdAt: now,
      updatedAt: now,
    }

    // Store the product
    await setValue(`${this.productPrefix}${id}`, product)

    // Add to category index
    await addToSet(`${this.categoryIndex}${productData.category.toLowerCase()}`, id)

    // Add to tag indexes
    if (productData.tags && productData.tags.length > 0) {
      for (const tag of productData.tags) {
        await addToSet(`${this.tagIndex}${tag.toLowerCase()}`, id)
      }
    }

    // Add to active products set if applicable
    if (productData.isActive) {
      await addToSet(this.activeProductsSet, id)
    }

    // Add to featured products set if applicable
    if (productData.isFeatured) {
      await addToSet(this.featuredProductsSet, id)
    }

    // Add to product list
    await addToSet(this.productList, id)

    return product
  }

  async getProductById(id: string): Promise<Product | null> {
    return getValue<Product>(`${this.productPrefix}${id}`)
  }

  async updateProduct(id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product | null> {
    const product = await this.getProductById(id)
    if (!product) return null

    // Handle category change
    if (updates.category && updates.category.toLowerCase() !== product.category.toLowerCase()) {
      // Remove from old category index
      await removeFromSet(`${this.categoryIndex}${product.category.toLowerCase()}`, id)

      // Add to new category index
      await addToSet(`${this.categoryIndex}${updates.category.toLowerCase()}`, id)
    }

    // Handle tags change
    if (updates.tags) {
      // Remove old tags
      if (product.tags) {
        for (const tag of product.tags) {
          await removeFromSet(`${this.tagIndex}${tag.toLowerCase()}`, id)
        }
      }

      // Add new tags
      for (const tag of updates.tags) {
        await addToSet(`${this.tagIndex}${tag.toLowerCase()}`, id)
      }
    }

    // Handle active status change
    if (updates.isActive !== undefined && updates.isActive !== product.isActive) {
      if (updates.isActive) {
        await addToSet(this.activeProductsSet, id)
      } else {
        await removeFromSet(this.activeProductsSet, id)
      }
    }

    // Handle featured status change
    if (updates.isFeatured !== undefined && updates.isFeatured !== product.isFeatured) {
      if (updates.isFeatured) {
        await addToSet(this.featuredProductsSet, id)
      } else {
        await removeFromSet(this.featuredProductsSet, id)
      }
    }

    const updatedProduct: Product = {
      ...product,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await setValue(`${this.productPrefix}${id}`, updatedProduct)

    return updatedProduct
  }

  async deleteProduct(id: string): Promise<boolean> {
    const product = await this.getProductById(id)
    if (!product) return false

    // Remove from category index
    await removeFromSet(`${this.categoryIndex}${product.category.toLowerCase()}`, id)

    // Remove from tag indexes
    if (product.tags) {
      for (const tag of product.tags) {
        await removeFromSet(`${this.tagIndex}${tag.toLowerCase()}`, id)
      }
    }

    // Remove from active products set if applicable
    if (product.isActive) {
      await removeFromSet(this.activeProductsSet, id)
    }

    // Remove from featured products set if applicable
    if (product.isFeatured) {
      await removeFromSet(this.featuredProductsSet, id)
    }

    // Remove from product list
    await removeFromSet(this.productList, id)

    // Delete product
    await deleteValue(`${this.productPrefix}${id}`)

    return true
  }

  async listProducts(page = 1, limit = 20): Promise<Product[]> {
    const productIds = await getSetMembers(this.productList)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = productIds.slice(start, end)

    const productKeys = paginatedIds.map((id) => `${this.productPrefix}${id}`)
    const products = await getMultipleValues<Product>(productKeys)

    return products.filter((product): product is Product => product !== null)
  }

  async listProductsByCategory(category: string, page = 1, limit = 20): Promise<Product[]> {
    const productIds = await getSetMembers(`${this.categoryIndex}${category.toLowerCase()}`)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = productIds.slice(start, end)

    const productKeys = paginatedIds.map((id) => `${this.productPrefix}${id}`)
    const products = await getMultipleValues<Product>(productKeys)

    return products.filter((product): product is Product => product !== null)
  }

  async searchProducts(query: string): Promise<Product[]> {
    // Search by tag
    const tagProductIds = await getSetMembers(`${this.tagIndex}${query.toLowerCase()}`)

    // Search by category
    const categoryProductIds = await getSetMembers(`${this.categoryIndex}${query.toLowerCase()}`)

    // Combine results
    const productIds = [...new Set([...tagProductIds, ...categoryProductIds])]

    const productKeys = productIds.map((id) => `${this.productPrefix}${id}`)
    const products = await getMultipleValues<Product>(productKeys)

    return products.filter((product): product is Product => product !== null)
  }

  async setProductActive(id: string, isActive: boolean): Promise<Product | null> {
    const product = await this.getProductById(id)
    if (!product) return null

    if (isActive !== product.isActive) {
      if (isActive) {
        await addToSet(this.activeProductsSet, id)
      } else {
        await removeFromSet(this.activeProductsSet, id)
      }

      product.isActive = isActive
      product.updatedAt = new Date().toISOString()

      await setValue(`${this.productPrefix}${id}`, product)
    }

    return product
  }

  async setProductFeatured(id: string, isFeatured: boolean): Promise<Product | null> {
    const product = await this.getProductById(id)
    if (!product) return null

    if (isFeatured !== product.isFeatured) {
      if (isFeatured) {
        await addToSet(this.featuredProductsSet, id)
      } else {
        await removeFromSet(this.featuredProductsSet, id)
      }

      product.isFeatured = isFeatured
      product.updatedAt = new Date().toISOString()

      await setValue(`${this.productPrefix}${id}`, product)
    }

    return product
  }
}
