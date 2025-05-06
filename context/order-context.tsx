"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define types
export type OrderStatus =
  | "checkout-complete"
  | "processing"
  | "ready-for-shipping"
  | "ready-for-pickup"
  | "shipped"
  | "delivered"
  | "cancelled"

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  customization?: Record<string, any>
  imageUrl?: string
}

export interface OrderAddress {
  name: string
  email?: string
  phone?: string
  address: string
  city: string
}

export interface OrderStatusHistory {
  status: OrderStatus
  timestamp: string
  note?: string
}

export interface Order {
  id: string
  date: string
  items: OrderItem[]
  billingAddress?: OrderAddress
  shippingAddress?: OrderAddress
  shippingMethod: "pickup" | "delivery"
  paymentMethod: string
  total: number
  status: OrderStatus
  statusHistory: OrderStatusHistory[]
  transactionId?: string
}

interface OrderContextType {
  orders: Order[]
  addOrder: (order: Order) => string
  getOrderById: (id: string) => Order | undefined
  updateOrderStatus: (id: string, status: OrderStatus, note?: string) => void
  clearOrders: () => void
}

// Create context
const OrderContext = createContext<OrderContextType | undefined>(undefined)

// Provider component
export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  // Load orders from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOrders = localStorage.getItem("orders")
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders))
        } catch (error) {
          console.error("Failed to parse orders from localStorage:", error)
        }
      }
    }
  }, [])

  // Save orders to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("orders", JSON.stringify(orders))
    }
  }, [orders])

  // Add a new order
  const addOrder = (order: Order): string => {
    // If order doesn't have an ID, generate one
    if (!order.id) {
      const orderNumber = Math.floor(1000 + Math.random() * 9000)
      order.id = `ORD-${orderNumber}`
    }

    // Ensure order has statusHistory
    if (!order.statusHistory) {
      order.statusHistory = [
        {
          status: order.status,
          timestamp: new Date().toISOString(),
        },
      ]
    }

    setOrders((prevOrders) => [...prevOrders, order])
    return order.id
  }

  // Get an order by ID
  const getOrderById = (id: string): Order | undefined => {
    return orders.find((order) => order.id === id)
  }

  // Update order status
  const updateOrderStatus = (id: string, status: OrderStatus, note?: string): void => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === id) {
          // Create a new status history entry
          const statusHistory = [
            ...(order.statusHistory || []),
            {
              status,
              timestamp: new Date().toISOString(),
              note,
            },
          ]

          return { ...order, status, statusHistory }
        }
        return order
      }),
    )
  }

  // Clear all orders (for testing/development)
  const clearOrders = (): void => {
    setOrders([])
    if (typeof window !== "undefined") {
      localStorage.removeItem("orders")
    }
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrderById, updateOrderStatus, clearOrders }}>
      {children}
    </OrderContext.Provider>
  )
}

// Custom hook to use the order context
export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}

export { OrderContext }
