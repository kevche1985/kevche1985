"use client"

import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { CheckCircle, Truck, Package, Home, ShoppingBag, Clock } from "lucide-react"
import type { OrderStatus } from "@/context/order-context"

interface OrderTrackingBarProps {
  currentStatus: OrderStatus
  shippingMethod: "pickup" | "delivery"
  className?: string
}

export function OrderTrackingBar({ currentStatus, shippingMethod, className = "" }: OrderTrackingBarProps) {
  const { language } = useContext(LanguageContext) || { language: "es" }

  const content = {
    en: {
      checkoutComplete: "Order Placed",
      processing: "Processing",
      readyForShipping: "Ready for Shipping",
      readyForPickup: "Ready for Pickup",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      estimatedTime: "Est. time:",
      days: "days",
      hours: "hours",
    },
    es: {
      checkoutComplete: "Pedido Realizado",
      processing: "Procesando",
      readyForShipping: "Listo para Envío",
      readyForPickup: "Listo para Recoger",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
      estimatedTime: "Tiempo est.:",
      days: "días",
      hours: "horas",
    },
  }

  const t = language === "en" ? content.en : content.es

  // Define the steps based on shipping method with estimated times
  const steps =
    shippingMethod === "pickup"
      ? [
          {
            status: "checkout-complete",
            label: t.checkoutComplete,
            icon: <ShoppingBag className="h-6 w-6" />,
            estimatedTime: `1-2 ${t.hours}`,
          },
          {
            status: "processing",
            label: t.processing,
            icon: <Package className="h-6 w-6" />,
            estimatedTime: `1-2 ${t.days}`,
          },
          {
            status: "ready-for-pickup",
            label: t.readyForPickup,
            icon: <Home className="h-6 w-6" />,
            estimatedTime: `1 ${t.days}`,
          },
          {
            status: "delivered",
            label: t.delivered,
            icon: <CheckCircle className="h-6 w-6" />,
            estimatedTime: null,
          },
        ]
      : [
          {
            status: "checkout-complete",
            label: t.checkoutComplete,
            icon: <ShoppingBag className="h-6 w-6" />,
            estimatedTime: `1-2 ${t.hours}`,
          },
          {
            status: "processing",
            label: t.processing,
            icon: <Package className="h-6 w-6" />,
            estimatedTime: `1-2 ${t.days}`,
          },
          {
            status: "ready-for-shipping",
            label: t.readyForShipping,
            icon: <Package className="h-6 w-6" />,
            estimatedTime: `1 ${t.days}`,
          },
          {
            status: "shipped",
            label: t.shipped,
            icon: <Truck className="h-6 w-6" />,
            estimatedTime: `1-3 ${t.days}`,
          },
          {
            status: "delivered",
            label: t.delivered,
            icon: <CheckCircle className="h-6 w-6" />,
            estimatedTime: null,
          },
        ]

  // Find the current step index
  const currentStepIndex = steps.findIndex((step) => step.status === currentStatus)

  // Handle cancelled orders
  if (currentStatus === "cancelled") {
    return (
      <div className={`w-full py-4 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
          <div className="text-red-600 font-medium flex items-center justify-center">
            <Clock className="mr-2" size={20} />
            {language === "en" ? "Order Cancelled" : "Pedido Cancelado"}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full py-4 ${className}`}>
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
                {step.estimatedTime && isCurrent && (
                  <span className="mt-1 text-xs text-blue-600 flex items-center">
                    <Clock className="mr-1" size={10} />
                    {t.estimatedTime} {step.estimatedTime}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
