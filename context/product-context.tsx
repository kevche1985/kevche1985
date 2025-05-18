"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { productOperations } from "@/lib/supabase-products"
import { useToast } from "@/hooks/use-toast"

// Define the Product type
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isNew?: boolean
  isBestseller?: boolean
  isActive?: boolean
  isFeatured?: boolean
  stock?: number
  sku?: string
  supplierId?: string
  createdAt?: string
  updatedAt?: string
}

// Define the context type
interface ProductContextType {
  products: Product[]
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<Product | null>
  updateProduct: (product: Product) => Promise<Product | null>
  deleteProduct: (id: string) => Promise<boolean>
  toggleProductStatus: (id: string) => Promise<void>
  getProductsByCategory: (category: string) => Product[]
  getProductById: (id: string) => Product | undefined
  categories: string[]
  addCategory: (category: string) => void
  updateCategory: (oldName: string, newName: string) => void
  deleteCategory: (category: string) => void
  loading: boolean
  refreshProducts: () => Promise<void>
  useSupabase: boolean
}

// Create the context with a default value
const ProductContext = createContext<ProductContextType | undefined>(undefined)

// Sample initial product data for fallback
const initialProducts: Product[] = [
  {
    id: "bc1",
    name: "Premium Business Cards",
    description: "High-quality business cards with premium finish",
    price: 29.99,
    image: "/modern-minimalist-business-card.png",
    category: "Business Cards",
    isNew: true,
    isActive: true,
    stock: 500,
    sku: "BC-PREM-001",
    isBestseller: false,
  },
  // ... other initial products
]

// Create a provider component
export function ProductProvider({ children }: { children: ReactNode }) {
  // Initialize state with empty arrays
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [useSupabase, setUseSupabase] = useState(true)
  const { toast } = useToast()

  // Load products on mount
  useEffect(() => {
    loadProducts()
  }, [])

  // Extract unique categories from products
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map((product) => product.category))]
      setCategories(uniqueCategories)
    }
  }, [products])

  // Load all products
  const loadProducts = async () => {
    try {
      setLoading(true)

      // Try to load from Supabase
      if (useSupabase) {
        try {
          const productsData = await productOperations.getAllProducts()

          if (productsData.length > 0) {
            setProducts(productsData)
            const uniqueCategories = [...new Set(productsData.map((product) => product.category))]
            setCategories(uniqueCategories)
            return
          }
        } catch (err) {
          console.error("Supabase connection failed:", err)
          setUseSupabase(false)
          toast({
            title: "Database Connection Error",
            description: "Falling back to local storage. Changes won't be saved to the database.",
            variant: "destructive",
          })
        }
      }

      // Fallback to localStorage
      if (typeof window !== "undefined") {
        const savedProducts = localStorage.getItem("products")
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts)
          setProducts(parsedProducts)
          const uniqueCategories = [...new Set(parsedProducts.map((product) => product.category))]
          setCategories(uniqueCategories)
        } else {
          // Use initial data if nothing in localStorage
          setProducts(initialProducts)
          const uniqueCategories = [...new Set(initialProducts.map((product) => product.category))]
          setCategories(uniqueCategories)
        }
      } else {
        // Use initial data if not in browser
        setProducts(initialProducts)
        const uniqueCategories = [...new Set(initialProducts.map((product) => product.category))]
        setCategories(uniqueCategories)
      }
    } catch (err) {
      console.error("Error loading products:", err)
      // Use initial data as last resort
      setProducts(initialProducts)
      const uniqueCategories = [...new Set(initialProducts.map((product) => product.category))]
      setCategories(uniqueCategories)
    } finally {
      setLoading(false)
    }
  }

  // Refresh products
  const refreshProducts = async () => {
    await loadProducts()
  }

  // Add a new product
  const addProduct = async (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    try {
      // Set a connection timeout
      const connectionTimeout = 5000 // 5 seconds

      if (useSupabase) {
        try {
          // Create an AbortController for the fetch operation
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), connectionTimeout)

          // Optimize by only sending required fields to Supabase
          const essentialProductData = {
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
            isActive: product.isActive,
            supplierId: product.supplierId,
            // Only include other fields if they have values
            ...(product.stock !== undefined && { stock: product.stock }),
            ...(product.sku && { sku: product.sku }),
            ...(product.isNew !== undefined && { isNew: product.isNew }),
            ...(product.isBestseller !== undefined && { isBestseller: product.isBestseller }),
            ...(product.isFeatured !== undefined && { isFeatured: product.isFeatured }),
          }

          const newProduct = await productOperations.createProduct(essentialProductData)
          clearTimeout(timeoutId)

          if (newProduct) {
            // Update state optimistically
            setProducts((prevProducts) => [...prevProducts, newProduct])

            // Update localStorage as backup (do this in background)
            if (typeof window !== "undefined") {
              setTimeout(() => {
                localStorage.setItem("products", JSON.stringify([...products, newProduct]))
              }, 0)
            }
            return newProduct
          }
        } catch (err) {
          console.error("Supabase operation failed:", err)
          // Continue to fallback
        }
      }

      // Fallback to local storage only
      const id = `prod-${Date.now()}`
      const localProduct = {
        ...product,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Update state optimistically
      setProducts((prevProducts) => [...prevProducts, localProduct])

      // Update localStorage in the background
      if (typeof window !== "undefined") {
        setTimeout(() => {
          localStorage.setItem("products", JSON.stringify([...products, localProduct]))
        }, 0)
      }

      return localProduct
    } catch (err) {
      console.error("Error adding product:", err)
      toast({
        title: "Error",
        description: "Failed to add product.",
        variant: "destructive",
      })
      return null
    }
  }

  // Update an existing product
  const updateProduct = async (product: Product) => {
    try {
      if (useSupabase) {
        try {
          const updatedProduct = await productOperations.updateProduct(product.id, product)
          if (updatedProduct) {
            setProducts((prevProducts) => prevProducts.map((p) => (p.id === product.id ? updatedProduct : p)))
            // Update localStorage as backup
            if (typeof window !== "undefined") {
              localStorage.setItem(
                "products",
                JSON.stringify(products.map((p) => (p.id === product.id ? updatedProduct : p))),
              )
            }
            return updatedProduct
          }
        } catch (err) {
          console.error("Supabase operation failed:", err)
          // Continue to fallback
        }
      }

      // Fallback to local storage only
      const localUpdatedProduct = { ...product, updatedAt: new Date().toISOString() }
      setProducts((prevProducts) => prevProducts.map((p) => (p.id === product.id ? localUpdatedProduct : p)))

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "products",
          JSON.stringify(products.map((p) => (p.id === product.id ? localUpdatedProduct : p))),
        )
      }

      return localUpdatedProduct
    } catch (err) {
      console.error("Error updating product:", err)
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      })
      return null
    }
  }

  // Delete a product
  const deleteProduct = async (id: string) => {
    try {
      if (useSupabase) {
        try {
          const success = await productOperations.deleteProduct(id)
          if (success) {
            setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id))
            // Update localStorage as backup
            if (typeof window !== "undefined") {
              localStorage.setItem("products", JSON.stringify(products.filter((p) => p.id !== id)))
            }
            return true
          }
        } catch (err) {
          console.error("Supabase operation failed:", err)
          // Continue to fallback
        }
      }

      // Fallback to local storage only
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id))
      if (typeof window !== "undefined") {
        localStorage.setItem("products", JSON.stringify(products.filter((p) => p.id !== id)))
      }
      return true
    } catch (err) {
      console.error("Error deleting product:", err)
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      })
      return false
    }
  }

  // Toggle product active status
  const toggleProductStatus = async (id: string) => {
    const product = products.find((p) => p.id === id)
    if (!product) return

    const updatedProduct = { ...product, isActive: !product.isActive }
    await updateProduct(updatedProduct)
  }

  // Get products by category
  const getProductsByCategory = (category: string) => {
    // Convert category to lowercase and remove hyphens for comparison
    const normalizedCategory = category.toLowerCase().replace(/-/g, "")

    // Create a mapping of normalized categories to actual categories
    const categoryMapping: Record<string, string> = {}
    categories.forEach((cat) => {
      categoryMapping[cat.toLowerCase().replace(/-/g, "")] = cat
      categoryMapping[cat.toLowerCase().replace(/\s+/g, "")] = cat
      categoryMapping[cat.toLowerCase().replace(/\s+/g, "-")] = cat
    })

    // Find the actual category
    const actualCategory = categoryMapping[normalizedCategory]

    if (!actualCategory) {
      console.warn(`Category not found: ${category}`)
      return []
    }

    // Return only active products in the category
    return products.filter((product) => product.category === actualCategory && product.isActive !== false)
  }

  // Get a product by ID
  const getProductById = (id: string) => {
    return products.find((p) => p.id === id && p.isActive !== false)
  }

  // Add a new category
  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories((prevCategories) => [...prevCategories, category])
    }
  }

  // Update a category name
  const updateCategory = (oldName: string, newName: string) => {
    // Update category in the categories list
    setCategories((prevCategories) => prevCategories.map((c) => (c === oldName ? newName : c)))

    // Update category in all products
    setProducts((prevProducts) => prevProducts.map((p) => (p.category === oldName ? { ...p, category: newName } : p)))
  }

  // Delete a category
  const deleteCategory = (category: string) => {
    // Remove category from the categories list
    setCategories((prevCategories) => prevCategories.filter((c) => c !== category))

    // Set products in this category to inactive
    setProducts((prevProducts) => prevProducts.map((p) => (p.category === category ? { ...p, isActive: false } : p)))
  }

  // Create the context value
  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    getProductsByCategory,
    getProductById,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    loading,
    refreshProducts,
    useSupabase,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

// Create a hook to use the product context
export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
