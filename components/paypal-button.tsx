"use client"

import { useRef, useState } from "react"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { Loader2 } from "lucide-react"
import { useLanguage } from "@/context/language-context"

interface PayPalButtonProps {
  amount: number
  currency?: string
  items?: Array<{
    name: string
    quantity: number
    price: number
  }>
  shippingCost?: number
  onSuccess: (details: any) => void
  onError?: (error: any) => void
  onCancel?: () => void
}

export default function PayPalButton({
  amount,
  currency = "USD",
  items = [],
  shippingCost = 0,
  onSuccess,
  onError,
  onCancel,
}: PayPalButtonProps) {
  const { t } = useLanguage()
  const [error, setError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const paypalRef = useRef(null)

  // Calculate item total (sum of all items without shipping)
  const calculateItemTotal = () => {
    return items.reduce((total, item) => {
      return total + Number.parseFloat(item.price.toString()) * item.quantity
    }, 0)
  }

  const itemTotal = calculateItemTotal()

  // Format items for PayPal with exact precision
  const itemsFormatted = items.map((item) => ({
    name: item.name,
    quantity: item.quantity.toString(),
    unit_amount: {
      currency_code: currency,
      value: item.price.toFixed(2),
    },
  }))

  return (
    <div className="w-full">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <PayPalScriptProvider
        options={{
          "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
          currency,
          intent: "capture",
        }}
      >
        {!loaded && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        )}

        <div className={!loaded ? "invisible h-0" : ""}>
          <PayPalButtons
            ref={paypalRef}
            style={{
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "pay",
            }}
            forceReRender={[amount, currency, items]}
            onInit={() => setLoaded(true)}
            createOrder={async (data, actions) => {
              try {
                // Create the order with proper breakdown
                const order = {
                  purchase_units: [
                    {
                      amount: {
                        currency_code: currency,
                        value: amount.toFixed(2),
                        breakdown: {
                          item_total: {
                            currency_code: currency,
                            value: itemTotal.toFixed(2),
                          },
                        },
                      },
                    },
                  ],
                  application_context: {
                    shipping_preference: "NO_SHIPPING",
                  },
                }

                // Add shipping if present
                if (shippingCost > 0) {
                  order.purchase_units[0].amount.breakdown.shipping = {
                    currency_code: currency,
                    value: shippingCost.toFixed(2),
                  }
                }

                // Add items if present
                if (itemsFormatted.length > 0) {
                  order.purchase_units[0].items = itemsFormatted
                }

                console.log("Creating PayPal order:", JSON.stringify(order, null, 2))
                return await actions.order.create(order)
              } catch (err: any) {
                console.error("PayPal create order error:", err)
                setError(err.message || t.checkout?.paymentError || "Payment error occurred")
                if (onError) onError(err)
                throw err
              }
            }}
            onApprove={async (data, actions) => {
              try {
                if (!actions.order) {
                  throw new Error("Order object is undefined")
                }

                const details = await actions.order.capture()
                console.log("Payment captured:", details)

                // Call the success callback
                onSuccess(details)
              } catch (err: any) {
                console.error("PayPal capture error:", err)
                setError(err.message || t.checkout?.paymentProcessingError || "Payment processing error occurred")
                if (onError) onError(err)
              }
            }}
            onCancel={() => {
              console.log("Payment cancelled")
              if (onCancel) onCancel()
            }}
            onError={(err) => {
              console.error("PayPal error:", err)
              setError(err.message || t.checkout?.paymentError || "Payment error occurred")
              if (onError) onError(err)
            }}
          />
        </div>
      </PayPalScriptProvider>
    </div>
  )
}
