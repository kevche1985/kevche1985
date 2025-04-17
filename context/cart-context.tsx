"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  category: string
  customization?: {
    text?: string
    color?: string
    design?: string
    aiGenerated?: boolean
    originalUrl?: string
    eventSuggestions?: string
  }
  details?: {
    type: string
    projectName: string
    description: string
    style: string
    fontRecommendations: string
  }
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (i) => i.id === item.id && JSON.stringify(i.customization) === JSON.stringify(item.customization),
      )

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity
        return updatedItems
      } else {
        // Add new item if it doesn't exist
        return [...prevItems, item]
      }
    })
  }

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item)),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export { CartContext }
