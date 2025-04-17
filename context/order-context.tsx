"use client"

import { createContext, useState, useContext, type ReactNode } from "react"
import type { CartItem } from "@/context/cart-context"

export type OrderStatus =
  | "checkout-complete"
  | "processing"
  | "ready-for-shipping"
  | "ready-for-pickup"
  | "shipped"
  | "delivered"

export interface Order {
  id: string
  date: string
  items: CartItem[]
  billingAddress: {
    name: string
    address: string
    city: string
  }
  shippingMethod: "pickup" | "delivery"
  paymentMethod: string
  total: number
  status: OrderStatus
  statusHistory: {
    status: OrderStatus
    date: string
  }[]
}

interface OrderContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "statusHistory">) => string
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  getOrder: (orderId: string) => Order | undefined
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  const addOrder = (orderData: Omit<Order, "id" | "statusHistory">) => {
    const orderId = `ORD-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      statusHistory: [
        {
          status: "checkout-complete",
          date: new Date().toISOString(),
        },
      ],
    }

    setOrders((prev) => [newOrder, ...prev])
    return orderId
  }

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status,
            statusHistory: [
              ...order.statusHistory,
              {
                status,
                date: new Date().toISOString(),
              },
            ],
          }
        }
        return order
      }),
    )
  }

  const getOrder = (orderId: string) => {
    return orders.find((order) => order.id === orderId)
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}
