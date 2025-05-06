"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
  stock?: number
  sku?: string
}

// Define the context type
interface ProductContextType {
  products: Product[]
  addProduct: (product: Product) => void
  updateProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  toggleProductStatus: (id: string) => void
  getProductsByCategory: (category: string) => Product[]
  getProductById: (id: string) => Product | undefined
  categories: string[]
  addCategory: (category: string) => void
  updateCategory: (oldName: string, newName: string) => void
  deleteCategory: (category: string) => void
}

// Create the context with a default value
const ProductContext = createContext<ProductContextType | undefined>(undefined)

// Sample initial product data
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
  {
    id: "bc2",
    name: "Standard Business Cards",
    description: "Professional business cards for everyday use",
    price: 19.99,
    image: "/professional-business-card.png",
    category: "Business Cards",
    isNew: false,
    isActive: true,
    stock: 750,
    sku: "BC-STD-001",
    isBestseller: false,
  },
  {
    id: "bc3",
    name: "Luxury Business Cards",
    description: "Embossed business cards with gold foil accents",
    price: 39.99,
    image: "/elegant-gold-business-card.png",
    category: "Business Cards",
    isNew: false,
    isActive: true,
    stock: 250,
    sku: "BC-LUX-001",
    isBestseller: true,
  },
  {
    id: "ts1",
    name: "Custom Printed T-Shirt",
    description: "100% cotton t-shirt with your custom design",
    price: 24.99,
    image: "/personalized-message-tee.png",
    category: "T-Shirts",
    isNew: true,
    isActive: true,
    stock: 120,
    sku: "TS-CUST-001",
    isBestseller: false,
  },
  {
    id: "ts2",
    name: "Premium Cotton T-Shirt",
    description: "High-quality cotton t-shirt with durable print",
    price: 29.99,
    image: "/luxurious-cotton-tee.png",
    category: "T-Shirts",
    isNew: false,
    isActive: true,
    stock: 85,
    sku: "TS-PREM-001",
    isBestseller: true,
  },
  {
    id: "ts3",
    name: "Performance T-Shirt",
    description: "Moisture-wicking fabric ideal for sports and activities",
    price: 34.99,
    image: "/athletic-woman-running.png",
    category: "T-Shirts",
    isNew: false,
    isActive: true,
    stock: 60,
    sku: "TS-PERF-001",
    isBestseller: false,
  },
  {
    id: "cp1",
    name: "Abstract Botanical Canvas",
    description: "Modern abstract art with vibrant colors featuring stylized plant forms",
    price: 49.99,
    image: "/images/canvas/canvas1-abstract-plant.png",
    category: "Canvas Prints",
    isNew: true,
    isActive: true,
    stock: 25,
    sku: "CP-ABS-001",
    isBestseller: false,
  },
  {
    id: "cp2",
    name: "Stylized Portrait Canvas",
    description: "Elegant stylized portrait of a woman with bold colors on contrasting background",
    price: 59.99,
    image: "/images/canvas/canvas2-stylized-portrait.png",
    category: "Canvas Prints",
    isNew: false,
    isActive: true,
    stock: 15,
    sku: "CP-POR-001",
    isBestseller: false,
  },
  {
    id: "cp3",
    name: "Gatsby Pop Art Canvas",
    description: "Colorful pop art portrait with vibrant abstract background",
    price: 69.99,
    image: "/images/canvas/canvas3-gatsby-portrait.png",
    category: "Canvas Prints",
    isNew: false,
    isActive: true,
    stock: 20,
    sku: "CP-POP-001",
    isBestseller: true,
  },
  {
    id: "cp4",
    name: "Starry Night Multi-Panel Canvas",
    description: "Five-panel reproduction of Van Gogh's Starry Night masterpiece",
    price: 129.99,
    image: "/images/canvas/canvas4-starry-night-panels.png",
    category: "Canvas Prints",
    isNew: true,
    isActive: true,
    stock: 10,
    sku: "CP-STAR-001",
    isBestseller: false,
  },
  {
    id: "nb1",
    name: "Daily Planner A6",
    description: "A6 Daily Planner with 9 pages",
    price: 9.99,
    image: "/images/notebooks/Notebook1.jpg",
    category: "Planners & Notebooks",
    isNew: true,
    isActive: true,
    stock: 75,
    sku: "NB-Daily-001",
    isBestseller: false,
  },
  {
    id: "nb2",
    name: "Floral Design Notebook",
    description: "Spiral notebook with floral design",
    price: 12.99,
    image: "/images/notebooks/Notebook2.jpeg",
    category: "Planners & Notebooks",
    isNew: false,
    isActive: true,
    stock: 50,
    sku: "NB-Floral-002",
    isBestseller: true,
  },
  {
    id: "nb3",
    name: "Minimalist Design Notebook",
    description: "Spiral notebook with minimalist design",
    price: 7.99,
    image: "/images/notebooks/Notebook3.jpg",
    category: "Planners & Notebooks",
    isNew: false,
    isActive: true,
    stock: 40,
    sku: "NB-Min-003",
    isBestseller: false,
  },
  {
    id: "nb4",
    name: "Leather Bound Journal",
    description: "Leather bound journal with clasp",
    price: 24.99,
    image: "/images/notebooks/Notebook4.jpg",
    category: "Planners & Notebooks",
    isNew: false,
    isActive: true,
    stock: 40,
    sku: "NB-Leather-004",
    isBestseller: false,
  },
  {
    id: "nb5",
    name: "Spiral Notebook Set",
    description: "Set of spiral notebooks with various designs",
    price: 19.99,
    image: "/images/notebooks/Notebook5.jpg",
    category: "Planners & Notebooks",
    isNew: false,
    isActive: true,
    stock: 40,
    sku: "NB-Spiral-005",
    isBestseller: false,
  },
]

// Create a provider component
export function ProductProvider({ children }: { children: ReactNode }) {
  // Initialize state with data from localStorage or fall back to sample data
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const savedProducts = localStorage.getItem("products")
      return savedProducts ? JSON.parse(savedProducts) : initialProducts
    }
    return initialProducts
  })

  const [categories, setCategories] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const savedCategories = localStorage.getItem("categories")
      return savedCategories ? JSON.parse(savedCategories) : []
    }
    return []
  })

  // Extract unique categories from products on mount
  useEffect(() => {
    if (categories.length === 0) {
      const uniqueCategories = [...new Set(products.map((product) => product.category))]
      setCategories(uniqueCategories)
    }
  }, [products, categories.length])

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("products", JSON.stringify(products))
    }
  }, [products])

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("categories", JSON.stringify(categories))
    }
  }, [categories])

  // Add a new product
  const addProduct = (product: Product) => {
    // Generate a simple ID if not provided
    const newProduct = {
      ...product,
      id: product.id || `prod-${Date.now()}`,
      isActive: product.isActive !== undefined ? product.isActive : true,
    }
    setProducts((prevProducts) => [...prevProducts, newProduct])

    // Add category if it's new
    if (!categories.includes(product.category)) {
      setCategories((prevCategories) => [...prevCategories, product.category])
    }
  }

  // Update an existing product
  const updateProduct = (product: Product) => {
    setProducts((prevProducts) => prevProducts.map((p) => (p.id === product.id ? { ...p, ...product } : p)))

    // Add category if it's new
    if (!categories.includes(product.category)) {
      setCategories((prevCategories) => [...prevCategories, product.category])
    }
  }

  // Delete a product
  const deleteProduct = (id: string) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id))
  }

  // Toggle product active status
  const toggleProductStatus = (id: string) => {
    setProducts((prevProducts) => prevProducts.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
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
