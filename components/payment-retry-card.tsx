"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import WompiPaymentForm from "@/components/wompi-payment-form"

interface PaymentRetryCardProps {
  transaction: {
    id: string
    orderId?: string
    amount: number
    status: string
    paymentMethod: string
    createdAt: string
    metadata?: any
  }
  onRetrySuccess?: (transactionId: string) => void
}

export default function PaymentRetryCard({ transaction, onRetrySuccess }: PaymentRetryCardProps) {
  const router = useRouter()
  const [isRetrying, setIsRetrying] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Format the transaction date
  const formattedDate = formatDate(transaction.createdAt)

  // Get status icon based on transaction status
  const getStatusIcon = () => {
    switch (transaction.status) {
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "DECLINED":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  // Get status color based on transaction status
  const getStatusColor = () => {
    switch (transaction.status) {
      case "APPROVED":
        return "text-green-500"
      case "DECLINED":
        return "text-red-500"
      case "PENDING":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  // Handle retry payment
  const handleRetry = async () => {
    setIsRetrying(true)
    setError(null)
    setSuccess(null)

    try {
      // Check if the order still exists and is valid for retry
      const response = await fetch(`/api/payments/retry/validate?orderId=${transaction.orderId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to validate order for retry")
      }

      if (data.canRetry) {
        // Show payment form for retry
        setShowPaymentForm(true)
      } else {
        setError(data.message || "This payment cannot be retried")
      }
    } catch (err: any) {
      console.error("Error validating retry:", err)
      setError(err.message || "An error occurred while validating the retry request")
    } finally {
      setIsRetrying(false)
    }
  }

  // Handle payment form success
  const handlePaymentSuccess = (transactionId: string) => {
    setShowPaymentForm(false)
    setSuccess("Payment successful! Your order has been processed.")

    if (onRetrySuccess) {
      onRetrySuccess(transactionId)
    }

    // Refresh the page after a short delay
    setTimeout(() => {
      router.refresh()
    }, 2000)
  }

  // Handle payment form error
  const handlePaymentError = (err: any) => {
    setShowPaymentForm(false)
    setError(err.message || "Payment failed. Please try again.")
  }

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Payment {transaction.id.substring(0, 8)}</CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </div>
          <div className="flex items-center">
            {getStatusIcon()}
            <span className={`ml-2 font-medium ${getStatusColor()}`}>{transaction.status}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {transaction.orderId && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Order ID:</span>
              <span className="text-sm font-medium">{transaction.orderId}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Amount:</span>
            <span className="text-sm font-medium">${transaction.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Payment Method:</span>
            <span className="text-sm font-medium capitalize">{transaction.paymentMethod.replace("_", " ")}</span>
          </div>

          {transaction.status === "DECLINED" && transaction.metadata?.wompi_response?.mensaje && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Payment Failed</AlertTitle>
              <AlertDescription>{transaction.metadata.wompi_response.mensaje}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {transaction.status === "DECLINED" && (
          <Button onClick={handleRetry} disabled={isRetrying || !!success} className="w-full" variant="outline">
            {isRetrying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Payment
              </>
            )}
          </Button>
        )}

        {transaction.status === "APPROVED" && (
          <Button
            onClick={() => router.push(`/my-print/orders/${transaction.orderId}`)}
            className="w-full"
            variant="outline"
          >
            View Order
          </Button>
        )}
      </CardFooter>

      {/* Payment Form Dialog */}
      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Retry Payment</DialogTitle>
            <DialogDescription>Complete your payment to process your order.</DialogDescription>
          </DialogHeader>
          <WompiPaymentForm
            amount={transaction.amount}
            orderId={transaction.orderId}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            returnUrl={`/my-print/orders/${transaction.orderId}`}
          />
        </DialogContent>
      </Dialog>
    </Card>
  )
}
