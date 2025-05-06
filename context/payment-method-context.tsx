"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define the payment method type
export type PaymentMethod = {
  id: string
  name: string
  enabled: boolean
  icon?: string
  processingFee?: string
}

export type ApiConfig = {
  apiKey?: string
  secretKey?: string
  clientId?: string
  merchantId?: string
  endpoint?: string
  sandbox?: boolean
}

// Define the context type
type PaymentMethodContextType = {
  paymentMethods: PaymentMethod[]
  togglePaymentMethod: (id: string) => void
  getEnabledPaymentMethods: () => PaymentMethod[]
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => void
  updatePaymentMethod: (id: string, method: PaymentMethod) => void
  deletePaymentMethod: (id: string) => void
  testApiConnection: (apiConfig: ApiConfig) => Promise<{ success: boolean; message: string }>
}

// Create the context
const PaymentMethodContext = createContext<PaymentMethodContextType | undefined>(undefined)

// Default payment methods
const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: "cash",
    name: "Cash on Delivery",
    enabled: true,
    icon: "dollar-sign",
  },
  {
    id: "credit-card",
    name: "Credit Card",
    enabled: true,
    icon: "credit-card",
    processingFee: "3% processing fee",
  },
  {
    id: "paypal",
    name: "PayPal",
    enabled: true,
    icon: "credit-card",
    processingFee: "2.9% + $0.30 processing fee",
  },
]

// Provider component
export function PaymentMethodProvider({ children }: { children: React.ReactNode }) {
  // State for payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(defaultPaymentMethods)

  // Load payment methods from localStorage on mount
  useEffect(() => {
    const savedPaymentMethods = localStorage.getItem("paymentMethods")
    if (savedPaymentMethods) {
      try {
        setPaymentMethods(JSON.parse(savedPaymentMethods))
      } catch (e) {
        console.error("Failed to parse payment methods from localStorage", e)
      }
    }
  }, [])

  // Save payment methods to localStorage when they change
  useEffect(() => {
    localStorage.setItem("paymentMethods", JSON.stringify(paymentMethods))
  }, [paymentMethods])

  // Toggle a payment method's enabled status
  const togglePaymentMethod = (id: string) => {
    setPaymentMethods((prevMethods) =>
      prevMethods.map((method) => (method.id === id ? { ...method, enabled: !method.enabled } : method)),
    )
  }

  // Get only enabled payment methods
  const getEnabledPaymentMethods = () => {
    return paymentMethods.filter((method) => method.enabled)
  }

  const addPaymentMethod = (method: Omit<PaymentMethod, "id">) => {
    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      ...method,
    }
    setPaymentMethods((prev) => [...prev, newMethod])
  }

  const updatePaymentMethod = (id: string, method: PaymentMethod) => {
    setPaymentMethods((prev) => prev.map((pm) => (pm.id === id ? method : pm)))
  }

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id))
  }

  const testApiConnection = async (apiConfig: ApiConfig): Promise<{ success: boolean; message: string }> => {
    // Simulate API connection test
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (apiConfig.apiKey === "valid_api_key") {
      return { success: true, message: "Connection successful!" }
    } else {
      return { success: false, message: "Invalid API key" }
    }
  }

  return (
    <PaymentMethodContext.Provider
      value={{
        paymentMethods,
        togglePaymentMethod,
        getEnabledPaymentMethods,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        testApiConnection,
      }}
    >
      {children}
    </PaymentMethodContext.Provider>
  )
}

// Custom hook to use the payment method context
export function usePaymentMethods() {
  const context = useContext(PaymentMethodContext)
  if (context === undefined) {
    throw new Error("usePaymentMethods must be used within a PaymentMethodProvider")
  }
  return context
}

export { PaymentMethodContext }
