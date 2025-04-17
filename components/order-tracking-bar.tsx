"use client"

import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { CheckCircle, Truck, Package, Home, ShoppingBag } from "lucide-react"
import type { OrderStatus } from "@/context/order-context"

interface OrderTrackingBarProps {
  currentStatus: OrderStatus
  shippingMethod: "pickup" | "delivery"
}

export function OrderTrackingBar({ currentStatus, shippingMethod }: OrderTrackingBarProps) {
  const { language } = useContext(LanguageContext) || { language: "es" }

  const content = {
    en: {
      checkoutComplete: "Order Placed",
      processing: "Processing",
      readyForShipping: "Ready for Shipping",
      readyForPickup: "Ready for Pickup",
      shipped: "Shipped",
      delivered: "Delivered",
    },
    es: {
      checkoutComplete: "Pedido Realizado",
      processing: "Procesando",
      readyForShipping: "Listo para Envío",
      readyForPickup: "Listo para Recoger",
      shipped: "Enviado",
      delivered: "Entregado",
    },
  }

  const t = language === "en" ? content.en : content.es

  // Define the steps based on shipping method
  const steps =
    shippingMethod === "pickup"
      ? [
          { status: "checkout-complete", label: t.checkoutComplete, icon: <ShoppingBag className="h-6 w-6" /> },
          { status: "processing", label: t.processing, icon: <Package className="h-6 w-6" /> },
          { status: "ready-for-pickup", label: t.readyForPickup, icon: <Home className="h-6 w-6" /> },
          { status: "delivered", label: t.delivered, icon: <CheckCircle className="h-6 w-6" /> },
        ]
      : [
          { status: "checkout-complete", label: t.checkoutComplete, icon: <ShoppingBag className="h-6 w-6" /> },
          { status: "processing", label: t.processing, icon: <Package className="h-6 w-6" /> },
          { status: "ready-for-shipping", label: t.readyForShipping, icon: <Package className="h-6 w-6" /> },
          { status: "shipped", label: t.shipped, icon: <Truck className="h-6 w-6" /> },
          { status: "delivered", label: t.delivered, icon: <CheckCircle className="h-6 w-6" /> },
        ]

  // Find the current step index
  const currentStepIndex = steps.findIndex((step) => step.status === currentStatus)

  return (
    <div className="w-full py-4">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted transform -translate-y-1/2"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-primary transform -translate-y-1/2 transition-all duration-500"
          style={{
            width: `${currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%`,
          }}
        ></div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex
            const isCurrent = index === currentStepIndex

            return (
              <div key={step.status} className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full 
                    ${isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                    ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}
                    transition-all duration-200
                  `}
                >
                  {step.icon}
                </div>
                <span
                  className={`
                  mt-2 text-xs font-medium text-center
                  ${isCompleted ? "text-foreground" : "text-muted-foreground"}
                `}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
