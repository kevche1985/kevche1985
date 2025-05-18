"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

export interface PaymentMethod {
  id: string
  name: string
  processor: "wompi" | "paypal" | "cash" | "other"
  icon?: string
  description?: string
  enabled: boolean
  processingFee?: string
  apiConfig?: Record<string, string>
}

export interface ApiConfig {
  endpoint?: string
  clientId?: string
  secretKey?: string
  webhookSecret?: string
  sandbox?: boolean
  redirectUrl?: string
  webhookUrl?: string
  merchantId?: string
}

interface PaymentMethodsContextType {
  paymentMethods: PaymentMethod[]
  getEnabledPaymentMethods: () => PaymentMethod[]
  togglePaymentMethod: (id: string, enabled: boolean) => void
  updatePaymentMethod: (id: string, data: Partial<PaymentMethod>) => void
  getApiConfig: (processor: string) => Record<string, string> | undefined
  updateApiConfig: (processor: string, config: Record<string, string>) => void
  testApiConnection: (config: ApiConfig) => Promise<{ success: boolean; message: string; details?: string }>
}

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: "credit-card",
    name: "Credit Card",
    processor: "wompi",
    icon: "credit-card",
    description: "Pay with your credit or debit card",
    enabled: true,
    processingFee: "2.9% + $0.30",
  },
  {
    id: "paypal",
    name: "PayPal",
    processor: "paypal",
    icon: "credit-card",
    description: "Pay with PayPal",
    enabled: true,
    processingFee: "2.9% + $0.30",
  },
  {
    id: "cash",
    name: "Cash on Delivery",
    processor: "cash",
    icon: "dollar-sign",
    description: "Pay with cash when your order is delivered",
    enabled: true,
    processingFee: "No fee",
  },
]

const PaymentMethodsContext = createContext<PaymentMethodsContextType | undefined>(undefined)

export function PaymentMethodsProvider({ children }: { children: ReactNode }) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(defaultPaymentMethods)
  const [apiConfigs, setApiConfigs] = useState<Record<string, ApiConfig>>({
    wompi: {
      clientId: process.env.NEXT_PUBLIC_WOMPI_CLIENT_ID || "",
      clientSecret: "",
      endpoint: process.env.NEXT_PUBLIC_WOMPI_ENDPOINT || "https://api.wompi.sv/v1",
      redirectUrl: "/payment-success",
    },
    paypal: {
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
      clientSecret: "",
      sandbox: true,
    },
  })

  const getEnabledPaymentMethods = () => {
    return paymentMethods.filter((method) => method.enabled)
  }

  const togglePaymentMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => (method.id === id ? { ...method, enabled: !method.enabled } : method)),
    )
  }

  const updatePaymentMethod = (id: string, data: Partial<PaymentMethod>) => {
    setPaymentMethods((prev) => prev.map((method) => (method.id === id ? { ...method, ...data } : method)))
  }

  const getApiConfig = (processor: string) => {
    return apiConfigs[processor]
  }

  const updateApiConfig = (processor: string, config: Record<string, string>) => {
    setApiConfigs((prev) => ({
      ...prev,
      [processor]: {
        ...prev[processor],
        ...config,
      },
    }))
  }

  const testApiConnection = async (config: ApiConfig) => {
    try {
      const response = await fetch("/api/payments/wompi/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error testing API connection:", error)
      return { success: false, message: "Connection failed" }
    }
  }

  return (
    <PaymentMethodsContext.Provider
      value={{
        paymentMethods,
        getEnabledPaymentMethods,
        togglePaymentMethod,
        updatePaymentMethod,
        getApiConfig,
        updateApiConfig,
        testApiConnection,
      }}
    >
      {children}
    </PaymentMethodsContext.Provider>
  )
}

export function usePaymentMethods() {
  const context = useContext(PaymentMethodsContext)
  if (context === undefined) {
    throw new Error("usePaymentMethods must be used within a PaymentMethodsProvider")
  }
  return context
}

export { PaymentMethodsContext }
