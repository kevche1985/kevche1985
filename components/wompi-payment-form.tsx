"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CreditCard, Lock, CheckCircle, ShieldCheck } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Define the form schema with Zod
const paymentFormSchema = z
  .object({
    cardNumber: z
      .string()
      .min(13, { message: "Card number must be at least 13 digits" })
      .max(19, { message: "Card number must be at most 19 digits" })
      .regex(/^[0-9\s]+$/, { message: "Card number must contain only digits" }),
    cardholderName: z.string().min(3, { message: "Cardholder name is required" }),
    expirationMonth: z.string().min(1, { message: "Expiration month is required" }),
    expirationYear: z.string().min(1, { message: "Expiration year is required" }),
    cvv: z
      .string()
      .min(3, { message: "CVV must be at least 3 digits" })
      .max(4, { message: "CVV must be at most 4 digits" })
      .regex(/^[0-9]+$/, { message: "CVV must contain only digits" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    name: z.string().min(2, { message: "Name is required" }),
    lastName: z.string().min(2, { message: "Last name is required" }),
    address: z.string().min(5, { message: "Address is required" }),
    city: z.string().min(2, { message: "City is required" }),
    country: z.string().min(2, { message: "Country is required" }),
    region: z.string().min(2, { message: "Region/State is required" }),
    zipCode: z.string().min(3, { message: "Zip code is required" }),
    phone: z.string().min(7, { message: "Phone number is required" }),
    sameBillingAddress: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // Check if card is expired
      const currentYear = new Date().getFullYear() % 100 // Get last 2 digits of year
      const currentMonth = new Date().getMonth() + 1 // Get current month (1-12)

      const expYear = Number.parseInt(data.expirationYear, 10)
      const expMonth = Number.parseInt(data.expirationMonth, 10)

      if (expYear < currentYear) return false
      if (expYear === currentYear && expMonth < currentMonth) return false

      return true
    },
    {
      message: "Card is expired",
      path: ["expirationYear"],
    },
  )

type PaymentFormValues = z.infer<typeof paymentFormSchema>

interface WompiPaymentFormProps {
  amount: number
  orderId?: string
  onSuccess?: (transactionId: string) => void
  onError?: (error: any) => void
  onSubmit?: (formData: any) => void
  returnUrl?: string
  showBillingDetails?: boolean
}

export default function WompiPaymentForm({
  amount,
  orderId,
  onSuccess,
  onError,
  onSubmit: onSubmitProp,
  returnUrl = "/payment-success",
  showBillingDetails = true,
}: WompiPaymentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardType, setCardType] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successData, setSuccessData] = useState<{
    transactionId: string
    amount: number
    orderId?: string
  } | null>(null)
  const [processingStep, setProcessingStep] = useState<string | null>(null)

  // Generate years for expiration date dropdown
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString().slice(-2))

  // Generate months for expiration date dropdown
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    return month < 10 ? `0${month}` : `${month}`
  })

  // Initialize form
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expirationMonth: "",
      expirationYear: "",
      cvv: "",
      email: "",
      name: "",
      lastName: "",
      address: "",
      city: "",
      country: "SV", // Default to El Salvador
      region: "",
      zipCode: "",
      phone: "",
      sameBillingAddress: false,
    },
  })

  // Detect card type based on card number
  const detectCardType = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s+/g, "")

    // Visa
    if (/^4/.test(cleanNumber)) return "Visa"

    // Mastercard
    if (/^5[1-5]/.test(cleanNumber)) return "Mastercard"

    // American Express
    if (/^3[47]/.test(cleanNumber)) return "American Express"

    // Discover
    if (/^6(?:011|5)/.test(cleanNumber)) return "Discover"

    // JCB
    if (/^35/.test(cleanNumber)) return "JCB"

    // Diners Club
    if (/^3(?:0[0-5]|[68])/.test(cleanNumber)) return "Diners Club"

    return null
  }

  const onSubmit = async (data: PaymentFormValues) => {
    console.log("Payment submission started", data)
    setIsSubmitting(true)
    setError(null)
    setProcessingStep("Initializing payment")

    try {
      // Format card number by removing spaces
      const formattedCardNumber = data.cardNumber.replace(/\s+/g, "")

      // Use customer info for billing if checkbox is checked
      const customerInfo = {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        address: data.address,
        city: data.city,
        country: data.country,
        region: data.region,
        zipCode: data.zipCode,
        phone: data.phone,
      }

      // Prepare payment data
      const paymentData = {
        cardNumber: formattedCardNumber,
        cvv: data.cvv,
        expirationMonth: data.expirationMonth,
        expirationYear: data.expirationYear,
        amount: Math.round(amount * 100), // Convert to cents and ensure it's an integer
        orderId,
        returnUrl,
        customerInfo,
        sameBillingAddress: data.sameBillingAddress,
      }

      console.log("Step 2: Submitting payment data to Wompi:", { ...paymentData, cvv: "***" })
      setProcessingStep("Processing payment")

      // Call the API to create a transaction
      const response = await axios.post("/api/payments/wompi/create-transaction", paymentData)

      console.log("Transaction created:", response.data)
      setProcessingStep("Verifying transaction")

      // If successful, redirect to 3DS page or handle success
      if (response.data.urlCompletarPago3Ds) {
        setProcessingStep("Redirecting to secure verification")

        // Store transaction ID in session storage for retrieval after redirect
        if (response.data.idTransaccion) {
          sessionStorage.setItem("wompiTransactionId", response.data.idTransaccion)
          sessionStorage.setItem("wompiOrderId", orderId || "")

          // Store additional payment data for order generation after 3DS
          sessionStorage.setItem(
            "wompiPaymentData",
            JSON.stringify({
              amount: amount,
              customerInfo: customerInfo,
              transactionId: response.data.idTransaccion,
            }),
          )
        }

        // Add a small delay to show the "Redirecting" message
        setTimeout(() => {
          // Redirect to 3DS page
          window.location.href = response.data.urlCompletarPago3Ds
        }, 1500)
      } else if (response.data.idTransaccion) {
        // For non-3DS payments, generate order immediately
        setProcessingStep("Creating order")

        try {
          // Create or update the order with payment information
          const orderResponse = await axios.post("/api/orders/complete", {
            orderId: orderId,
            transactionId: response.data.idTransaccion,
            paymentMethod: "credit-card",
            amount: amount,
            status: "payment-completed",
            customerInfo: customerInfo,
          })

          console.log("Order created/updated:", orderResponse.data)
          setProcessingStep("Payment completed")

          // Show success dialog instead of immediate redirect
          setSuccessData({
            transactionId: response.data.idTransaccion,
            amount: amount,
            orderId: orderId,
          })
          setShowSuccessDialog(true)

          // The redirect will happen after user confirms in the dialog
        } catch (orderError) {
          console.error("Error creating order:", orderError)
          setError("Payment was processed but there was an issue creating your order. Please contact support.")
        }
      }
    } catch (err: any) {
      console.error("Payment error:", err)
      const errorMessage =
        err.response?.data?.error || "An error occurred while processing your payment. Please try again."
      setError(errorMessage)
      if (onError) onError(err)
    } finally {
      setIsSubmitting(false)
      setProcessingStep(null)
    }
  }

  // Format card number with spaces for better readability
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Payment Details
        </CardTitle>
        <CardDescription>Enter your card information to complete the payment.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="4111 1111 1111 1111"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value)
                            field.onChange(formatted)
                            setCardType(detectCardType(formatted))
                          }}
                          maxLength={19}
                          className="pr-12"
                        />
                        {cardType && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500">
                            {cardType}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardholderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="expirationMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiration Month</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="expirationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiration Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} maxLength={4} type="password" className="max-w-[100px]" />
                    </FormControl>
                    <FormDescription>The 3 or 4 digit security code on your card</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sameBillingAddress"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Use customer information for billing</FormLabel>
                      <FormDescription>Check this box to use the same information for billing</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {showBillingDetails && !form.watch("sameBillingAddress") && (
                <>
                  <h3 className="text-lg font-medium pt-2">Billing Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="San Salvador" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="01101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SV">El Salvador</SelectItem>
                              <SelectItem value="GT">Guatemala</SelectItem>
                              <SelectItem value="HN">Honduras</SelectItem>
                              <SelectItem value="NI">Nicaragua</SelectItem>
                              <SelectItem value="CR">Costa Rica</SelectItem>
                              <SelectItem value="PA">Panama</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Region</FormLabel>
                          <FormControl>
                            <Input placeholder="San Salvador" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+503 2222 3333" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <CardFooter className="flex justify-between px-0 pt-4 pb-8">
              <div className="text-lg font-semibold">Total: ${amount.toFixed(2)}</div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md"
                onClick={(e) => {
                  // Prevent default to handle submission manually
                  e.preventDefault()

                  // Log the payment initiation
                  console.log("Payment initiation started")

                  // Call the onSubmit prop if provided
                  if (onSubmitProp) {
                    onSubmitProp(form.getValues())
                  }

                  // Submit the form manually to ensure it triggers the Credit Card Payment Flow
                  form.handleSubmit(onSubmit)(e)
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  "Complete Payment"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>

      {/* Payment Processing Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-gray-200 flex items-center justify-center">
                  <ShieldCheck className="h-10 w-10 text-green-500" />
                </div>
                <div className="absolute top-0 right-0 -mr-2 -mt-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-solid border-green-500 border-t-transparent"></div>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2">Processing Your Payment</h3>
              <p className="text-gray-600 mb-6">Please do not close this window or refresh the page.</p>

              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div className="bg-green-500 h-2.5 rounded-full animate-pulse w-full"></div>
              </div>

              <div className="text-sm font-medium text-gray-700">{processingStep || "Initializing payment"}...</div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success Confirmation Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <CheckCircle className="mr-2 h-5 w-5" />
              Payment Successful
            </DialogTitle>
            <DialogDescription>Your payment has been processed successfully.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3">
              {successData?.transactionId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Transaction ID:</span>
                  <span className="text-sm">{successData.transactionId}</span>
                </div>
              )}
              {successData?.orderId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Order ID:</span>
                  <span className="text-sm">{successData.orderId}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Amount:</span>
                <span className="text-sm">${successData?.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false)
                router.push("/")
              }}
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                if (successData?.orderId) {
                  router.push(`/my-print/orders/${successData.orderId}`)
                } else if (onSuccess && successData?.transactionId) {
                  onSuccess(successData.transactionId)
                } else {
                  router.push(returnUrl)
                }
              }}
            >
              View Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
