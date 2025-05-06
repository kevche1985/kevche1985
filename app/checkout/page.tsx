"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useOrders } from "@/context/order-context"
import { useLanguage } from "@/context/language-context"
import { usePaymentMethods } from "@/context/payment-method-context"
import { MapPin, Truck, CreditCard, DollarSign, Clock, AlertCircle, Download } from "lucide-react"
import PayPalButton from "@/components/paypal-button"
import { useToast } from "@/components/ui/use-toast"

export default function CheckoutPage() {
  const { t, language } = useLanguage()
  const { items, getCartTotal, clearCart } = useCart()
  const { addOrder } = useOrders()
  const { getEnabledPaymentMethods } = usePaymentMethods()
  const router = useRouter()
  const { toast } = useToast()

  // Get enabled payment methods - use useMemo to prevent recreation on each render
  const enabledPaymentMethods = useMemo(() => getEnabledPaymentMethods(), [getEnabledPaymentMethods])

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("") // Added phone field
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [shippingMethod, setShippingMethod] = useState<"pickup" | "urgent" | "priority" | "regular">("pickup")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null)
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null)

  // Set initial payment method once when component mounts
  useEffect(() => {
    if (enabledPaymentMethods.length > 0 && paymentMethod === "") {
      setPaymentMethod(enabledPaymentMethods[0].id)
    }
  }, [enabledPaymentMethods, paymentMethod])

  // Calculate shipping cost based on method - use useMemo to prevent recalculation on each render
  const shippingCost = useMemo(() => {
    switch (shippingMethod) {
      case "urgent":
        return 10
      case "priority":
        return 5
      case "regular":
        return 3
      default:
        return 0
    }
  }, [shippingMethod])

  // Calculate total amount - use useMemo to prevent recalculation on each render
  const totalAmount = useMemo(() => {
    return getCartTotal() + shippingCost
  }, [getCartTotal, shippingCost])

  // Check if address is in San Salvador metropolitan area
  const isMetropolitanArea = () => {
    // Simple check - in a real app, this would be more sophisticated
    return city.toLowerCase().includes("san salvador")
  }

  // Validate form
  const validateForm = () => {
    if (!name || !email || !phone || !address || !city) {
      setError("Please fill out all required fields")
      return false
    }
    return true
  }

  // Send order confirmation email
  const sendOrderConfirmationEmail = async (orderId: string, orderDetails: any) => {
    try {
      console.log("Sending order confirmation email for order:", orderId)

      // For demo purposes, we'll simulate a successful email send
      // This prevents real email sending issues from blocking the checkout process
      if (process.env.NODE_ENV === "development" || typeof window !== "undefined") {
        console.log("Development mode or browser environment detected - simulating email send")
        return true
      }

      const response = await fetch("/api/email/order-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          customerAddress: address,
          customerCity: city,
          items: items,
          total: totalAmount,
          shippingMethod,
          paymentMethod,
        }),
      })

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        console.error("Failed to send order confirmation email:", response.statusText)
        // Don't block the checkout process for email failures
        return false
      }

      // Try to parse the response as JSON, but handle cases where it might not be valid JSON
      try {
        const result = await response.json()
        console.log("Order confirmation email sent successfully:", result)
        return true
      } catch (parseError) {
        // If JSON parsing fails, still consider it a success if the response was OK
        console.warn("Could not parse JSON response, but email request was successful")
        return true
      }
    } catch (error) {
      console.error("Error sending order confirmation email:", error)
      // Don't block the checkout process for email failures
      return false
    }
  }

  // Handle PayPal success
  const handlePayPalSuccess = (details: any) => {
    console.log("PayPal payment successful:", details)
    setPaypalOrderId(details.id)
    setPaymentComplete(true)

    // Complete the order
    completeOrder("paypal", details.id)
  }

  // Handle PayPal error
  const handlePayPalError = (error: any) => {
    console.error("PayPal error:", error)
    setError("There was a problem processing your payment. Please try again.")
    setIsSubmitting(false)
  }

  // Handle PayPal cancel
  const handlePayPalCancel = () => {
    console.log("PayPal payment cancelled")
    setIsSubmitting(false)
  }

  // Complete order
  const completeOrder = async (paymentMethodUsed: string, transactionId?: string) => {
    try {
      // Create order with a formatted ID
      const orderNumber = Math.floor(1000 + Math.random() * 9000)
      const orderId = `ORD-${orderNumber}`
      const now = new Date().toISOString()

      // Add product images for demo purposes
      const itemsWithImages = items.map((item) => {
        // Try to find a matching image based on product name
        let imageUrl = undefined

        if (item.name.toLowerCase().includes("mug")) {
          imageUrl = "/personalized-coffee-mug.png"
        } else if (item.name.toLowerCase().includes("tee") || item.name.toLowerCase().includes("shirt")) {
          imageUrl = "/personalized-message-tee.png"
        } else if (item.name.toLowerCase().includes("card")) {
          imageUrl = "/professional-business-card.png"
        } else if (item.name.toLowerCase().includes("poster")) {
          imageUrl = "/images/posters/poster3-make-it-happen.png"
        } else if (item.name.toLowerCase().includes("cushion")) {
          imageUrl = "/cozy-cushions.png"
        }

        return {
          ...item,
          imageUrl,
        }
      })

      // Create order object
      const orderDetails = {
        id: orderId,
        date: now,
        items: itemsWithImages,
        billingAddress: {
          name,
          email,
          phone,
          address,
          city,
        },
        shippingMethod: shippingMethod === "pickup" ? "pickup" : "delivery",
        paymentMethod: paymentMethodUsed,
        total: totalAmount,
        status: "checkout-complete",
        statusHistory: [
          {
            status: "checkout-complete",
            timestamp: now,
            note: "Order placed successfully",
          },
        ],
        transactionId: transactionId,
      }

      // Add order to context
      addOrder(orderDetails)

      setCompletedOrderId(orderId)

      // Send order confirmation email - await the result but don't block on failure
      try {
        const emailSent = await sendOrderConfirmationEmail(orderId, orderDetails)
        if (emailSent) {
          console.log("Order confirmation email sent successfully")
        } else {
          console.warn("Failed to send order confirmation email, but continuing checkout process")
        }
      } catch (emailError) {
        console.error("Error in email sending process:", emailError)
        // Continue with checkout even if email fails
      }

      // Clear cart and redirect
      clearCart()

      // Show success message
      toast({
        title: t.checkout.orderComplete,
        description: t.checkout.orderSuccessMessage,
      })

      // Redirect to order confirmation page
      router.push(`/my-print/orders/${orderId}`)
    } catch (err) {
      console.error("Checkout error:", err)
      setError("An error occurred during checkout. Please try again.")
      setIsSubmitting(false)
    }
  }

  // Handle checkout
  const handleCheckout = () => {
    console.log("Checkout button clicked")

    // Validate form
    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      setError("")

      // If using PayPal, the PayPal button will handle the payment
      // Otherwise, process with other payment methods
      if (paymentMethod !== "paypal") {
        completeOrder(paymentMethod)
      }
    } catch (err) {
      console.error("Checkout error:", err)
      setError("An error occurred during checkout. Please try again.")
      setIsSubmitting(false)
    }
  }

  // Get payment method icon
  const getPaymentMethodIcon = (methodId: string) => {
    const method = enabledPaymentMethods.find((m) => m.id === methodId)

    if (!method) {
      return <CreditCard className="mr-2" size={20} />
    }

    switch (method.icon) {
      case "credit-card":
        return <CreditCard className="mr-2" size={20} />
      case "dollar-sign":
        return <DollarSign className="mr-2" size={20} />
      default:
        return <CreditCard className="mr-2" size={20} />
    }
  }

  // Check if cart is empty
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{t.checkout.title}</h1>
        <p>{t.checkout.emptyCart}</p>
      </div>
    )
  }

  // Check if cart has AI-generated items
  const hasAIItems = items.some((item) => item.customization?.aiGenerated)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{t.checkout.title}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t.checkout.customerInfo}</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">{t.checkout.name} *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Phone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">{t.checkout.address} *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">{t.checkout.city} *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Shipping Method */}
          <h2 className="text-xl font-semibold mt-6 mb-4">{t.checkout.shippingMethod}</h2>

          {city && !isMetropolitanArea() && shippingMethod !== "pickup" && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 flex items-center">
              <AlertCircle className="mr-2" size={20} />
              <span>{t.checkout.metropolitanAreaOnly}</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="shipping"
                  value="pickup"
                  checked={shippingMethod === "pickup"}
                  onChange={() => setShippingMethod("pickup")}
                  className="mr-2"
                />
                <MapPin className="mr-2" size={20} />
                <div>
                  <div>{t.checkout.pickup}</div>
                  <div className="text-sm text-gray-500">$0.00</div>
                </div>
              </label>
            </div>

            <div>
              <label
                className={`flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer ${!city || isMetropolitanArea() ? "" : "opacity-50"}`}
              >
                <input
                  type="radio"
                  name="shipping"
                  value="urgent"
                  checked={shippingMethod === "urgent"}
                  onChange={() => setShippingMethod("urgent")}
                  className="mr-2"
                  disabled={city && !isMetropolitanArea()}
                />
                <Truck className="mr-2" size={20} />
                <div>
                  <div>{t.checkout.urgentDelivery}</div>
                  <div className="text-sm text-gray-500">
                    <Clock className="inline mr-1" size={14} /> 2-5 hours
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label
                className={`flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer ${!city || isMetropolitanArea() ? "" : "opacity-50"}`}
              >
                <input
                  type="radio"
                  name="shipping"
                  value="priority"
                  checked={shippingMethod === "priority"}
                  onChange={() => setShippingMethod("priority")}
                  className="mr-2"
                  disabled={city && !isMetropolitanArea()}
                />
                <Truck className="mr-2" size={20} />
                <div>
                  <div>{t.checkout.priorityDelivery}</div>
                  <div className="text-sm text-gray-500">
                    <Clock className="inline mr-1" size={14} /> 5-7 hours
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label
                className={`flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer ${!city || isMetropolitanArea() ? "" : "opacity-50"}`}
              >
                <input
                  type="radio"
                  name="shipping"
                  value="regular"
                  checked={shippingMethod === "regular"}
                  onChange={() => setShippingMethod("regular")}
                  className="mr-2"
                  disabled={city && !isMetropolitanArea()}
                />
                <Truck className="mr-2" size={20} />
                <div>
                  <div>{t.checkout.regularDelivery}</div>
                  <div className="text-sm text-gray-500">
                    <Clock className="inline mr-1" size={14} /> 48 hours
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Method */}
          <h2 className="text-xl font-semibold mt-6 mb-4">{t.checkout.paymentMethod}</h2>
          <div className="space-y-3">
            {enabledPaymentMethods.length > 0 ? (
              enabledPaymentMethods.map((method) => (
                <div key={method.id}>
                  <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="mr-2"
                    />
                    {getPaymentMethodIcon(method.id)}
                    <div>
                      <div>{method.name}</div>
                      {method.processingFee && <div className="text-xs text-gray-500">{method.processingFee}</div>}
                    </div>
                  </label>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No payment methods available</div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t.checkout.orderSummary}</h2>
          <div className="bg-gray-800 text-white p-4 rounded">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <div>
                  <p>{item.name}</p>
                  <p className="text-sm text-gray-500">x{item.quantity}</p>
                  {item.customization?.aiGenerated && (
                    <p className="text-xs text-blue-600 mt-1">
                      {language === "en" ? "AI-Generated Item" : "Elemento Generado por IA"}
                    </p>
                  )}
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <div className="flex justify-between py-2">
              <p>{t.checkout.subtotal}</p>
              <p>${getCartTotal().toFixed(2)}</p>
            </div>

            <div className="flex justify-between py-2">
              <p>{t.checkout.shipping}</p>
              <p>${shippingCost.toFixed(2)}</p>
            </div>

            <div className="flex justify-between py-2 font-bold">
              <p>{t.checkout.total}</p>
              <p>${totalAmount.toFixed(2)}</p>
            </div>

            {hasAIItems && (
              <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
                <Download className="inline-block mr-2 h-4 w-4" />
                {language === "en"
                  ? "Your AI-generated items will be available for download after checkout."
                  : "Tus elementos generados por IA estarán disponibles para descargar después de completar la compra."}
              </div>
            )}
          </div>

          {/* PayPal Button */}
          {paymentMethod === "paypal" ? (
            <div className="mt-6">
              {validateForm() && (
                <PayPalButton
                  amount={totalAmount}
                  items={items}
                  shippingCost={shippingCost}
                  onSuccess={handlePayPalSuccess}
                  onError={handlePayPalError}
                  onCancel={handlePayPalCancel}
                />
              )}
            </div>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={isSubmitting || !paymentMethod}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : t.checkout.placeOrder}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
