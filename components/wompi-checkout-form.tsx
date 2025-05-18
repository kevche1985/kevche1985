"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePaymentMethods } from "@/context/payment-method-context"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CreditCard } from "lucide-react"

interface WompiCheckoutFormProps {
  amount: number
  currency?: string
  orderId: string
  customerEmail: string
  customerName: string
  description?: string
  onSuccess?: (transactionId: string) => void
  onError?: (error: any) => void
}

export default function WompiCheckoutForm({
  amount,
  currency = "USD",
  orderId,
  customerEmail,
  customerName,
  description = "Payment for order",
  onSuccess,
  onError,
}: WompiCheckoutFormProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const { getApiConfig } = usePaymentMethods()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  // Form state - Basic info
  const [cardholderName, setCardholderName] = useState(customerName || "")
  const [cardholderLastName, setCardholderLastName] = useState("")

  // Form state - Card details
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")

  // Form state - Additional customer info
  const [city, setCity] = useState("San Salvador")
  const [address, setAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  // Get Wompi configuration
  const wompiConfig = getApiConfig("wompi")

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format card expiry as MM/YY
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return value
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      // Validate form
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim() || !cardholderName.trim()) {
        throw new Error(t.checkout?.allFieldsRequired || "All fields are required")
      }

      // Format card data
      const expiryParts = cardExpiry.split("/")
      if (expiryParts.length !== 2) {
        throw new Error("Invalid expiry date format. Use MM/YY")
      }

      const expiryMonth = expiryParts[0]
      const expiryYear = `20${expiryParts[1]}`

      // Create transaction
      console.log("Sending payment request to API")
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
          customerName: cardholderName,
          customerLastName: cardholderLastName || ".",
          description,
          cardNumber: cardNumber.replace(/\s+/g, ""),
          cardExpMonth: expiryMonth,
          cardExpYear: expiryYear,
          cardCvc,
          city,
          address: address || "Address not provided",
          countryCode: "SV",
          region: "San Salvador",
          zipCode: "00000",
          phoneNumber: phoneNumber || "00000000",
        }),
      })

      console.log("Payment API response status:", response.status)
      const responseText = await response.text()
      console.log("Payment API response length:", responseText.length)

      let data
      try {
        // Only try to parse if there's actual content
        if (responseText && responseText.trim()) {
          data = JSON.parse(responseText)
        } else {
          throw new Error("Empty response from payment API")
        }
      } catch (parseError) {
        console.error("Error parsing payment response:", parseError)
        setDebugInfo(`Failed to parse API response: ${responseText}`)
        throw new Error("Invalid response from payment API")
      }

      if (!response.ok) {
        console.error("Payment API error:", data)

        // Display detailed error information for debugging
        if (data.responseText) {
          setDebugInfo(`API Error: ${data.responseText}`)
        }

        throw new Error(data.message || t.checkout?.paymentError || "Payment processing failed")
      }

      // Handle successful transaction creation
      if (data.success) {
        setTransactionId(data.transactionId)

        // Check if the transaction was approved
        if (data.status === "APPROVED" || data.esAprobada) {
          // If there's a redirect URL, store it
          if (data.redirectUrl) {
            setRedirectUrl(data.redirectUrl)
          }

          // If no redirect needed, handle success
          if (onSuccess) {
            onSuccess(data.transactionId)
          }

          // Redirect to success page if no callback
          if (!onSuccess && data.redirectUrl) {
            router.push(data.redirectUrl)
          }
        } else {
          // Transaction was declined
          throw new Error(data.mensaje || "Payment was declined. Please try again with a different card.")
        }
      } else {
        throw new Error(data.message || t.checkout?.paymentError || "Payment processing failed")
      }
    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err.message || t.checkout?.paymentError || "An error occurred during payment processing")

      if (onError) {
        onError(err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Check if Wompi is properly configured
  const isWompiConfigured = wompiConfig && wompiConfig.clientId && wompiConfig.endpoint

  // Check if we're in preview/development mode using only NEXT_PUBLIC variables
  const isPreviewMode =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" || process.env.NEXT_PUBLIC_VERCEL_ENV === "development"

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          {t.checkout?.payWithCard || "Pay with Card"}
        </CardTitle>
        <CardDescription>{t.checkout?.securePayment || "Your payment information is secure"}</CardDescription>
      </CardHeader>

      <CardContent>
        {!isWompiConfigured && !isPreviewMode ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t.checkout?.configError || "Configuration Error"}</AlertTitle>
            <AlertDescription>
              {t.checkout?.paymentNotConfigured ||
                "Payment processor is not properly configured. Please contact support."}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t.checkout?.paymentError || "Payment Error"}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {debugInfo && (
              <Alert variant="default" className="mb-4 bg-yellow-50 border-yellow-200 text-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Debug Information</AlertTitle>
                <AlertDescription className="max-h-32 overflow-auto text-xs">
                  <pre>{debugInfo}</pre>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">{t.checkout?.firstName || "First Name"}</Label>
                  <Input
                    id="cardholderName"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="John"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardholderLastName">{t.checkout?.lastName || "Last Name"}</Label>
                  <Input
                    id="cardholderLastName"
                    value={cardholderLastName}
                    onChange={(e) => setCardholderLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{t.checkout?.address || "Address"}</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">{t.checkout?.city || "City"}</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="San Salvador"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t.checkout?.phoneNumber || "Phone Number"}</Label>
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="12345678"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">{t.checkout?.cardNumber || "Card Number"}</Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">{t.checkout?.expiry || "Expiry (MM/YY)"}</Label>
                  <Input
                    id="cardExpiry"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardCvc">{t.checkout?.cvc || "CVC"}</Label>
                  <Input
                    id="cardCvc"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                    placeholder="123"
                    maxLength={4}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {isPreviewMode && (
                <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t.checkout?.testMode || "Test Mode"}</AlertTitle>
                  <AlertDescription>
                    {t.checkout?.testModeDescription ||
                      "This is a test environment. Use test card number 4242 4242 4242 4242, any future expiry date, and any 3-digit CVC."}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isLoading || (!isWompiConfigured && !isPreviewMode)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.checkout?.processing || "Processing..."}
            </>
          ) : (
            <>
              {t.checkout?.payAmount || "Pay"}{" "}
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: currency,
              }).format(amount)}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
