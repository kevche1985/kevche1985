"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { usePaymentMethods } from "@/context/payment-method-context"
import { useLanguage } from "@/context/language-context"
import { Loader2, CreditCard } from "lucide-react"

interface WompiPaymentButtonProps {
  amount: number
  currency?: string
  orderId: string
  customerEmail: string
  customerName: string
  description?: string
  onSuccess?: (transactionId: string) => void
  onError?: (error: any) => void
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export default function WompiPaymentButton({
  amount,
  currency = "USD",
  orderId,
  customerEmail,
  customerName,
  description = "Payment for order",
  onSuccess,
  onError,
  className = "",
  variant = "default",
}: WompiPaymentButtonProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const { getApiConfig } = usePaymentMethods()

  const [isLoading, setIsLoading] = useState(false)

  // Get Wompi configuration
  const wompiConfig = getApiConfig("wompi")

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      // Create transaction
      const response = await fetch("/api/payments/wompi/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount.toFixed(2),
          currency,
          orderId,
          customerEmail,
          customerName,
          description,
          redirectUrl: wompiConfig?.redirectUrl || "/payment-success",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || t.checkout.paymentError || "Payment processing failed")
      }

      // Handle successful transaction creation
      if (data.success) {
        // If there's a redirect URL, redirect to it
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl
          return
        }

        // If no redirect needed, handle success
        if (onSuccess) {
          onSuccess(data.transactionId)
        }

        // Redirect to success page if no callback
        if (!onSuccess && wompiConfig?.redirectUrl) {
          router.push(wompiConfig.redirectUrl)
        }
      } else {
        throw new Error(data.message || t.checkout.paymentError || "Payment processing failed")
      }
    } catch (err: any) {
      console.error("Payment error:", err)

      if (onError) {
        onError(err)
      } else {
        alert(err.message || t.checkout.paymentError || "An error occurred during payment processing")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={isLoading} className={className} variant={variant}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t.checkout.processing || "Processing..."}
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {t.checkout.payWithCard || "Pay with Card"}
        </>
      )}
    </Button>
  )
}
