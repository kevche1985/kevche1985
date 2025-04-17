"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useOrders } from "@/context/order-context"
import { useLanguage } from "@/context/language-context"
import {
  MapPin,
  Truck,
  CreditCard,
  DollarSign,
  Clock,
  AlertCircle,
  ShoppingCartIcon as PayPalIcon,
  Download,
} from "lucide-react"
import PayPalButton from "@/components/paypal-button"
import { useToast } from "@/components/ui/use-toast"

export default function CheckoutPage() {
  const { t, language } = useLanguage()
  const { items, getCartTotal, clearCart } = useCart()
  const { addOrder } = useOrders()
  const router = useRouter()
  const { toast } = useToast()

  // Form state
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [shippingMethod, setShippingMethod] = useState<"pickup" | "urgent" | "priority" | "regular">("pickup")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null)
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null)

  // Calculate shipping cost based on method
  const getShippingCost = () => {
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
  }

  // Calculate total amount
  const totalAmount = getCartTotal() + getShippingCost()
  const shippingCost = getShippingCost()

  // Check if address is in San Salvador metropolitan area
  const isMetropolitanArea = () => {
    // Simple check - in a real app, this would be more sophisticated
    return city.toLowerCase().includes("san salvador")
  }

  // Validate form
  const validateForm = () => {
    if (!name || !address || !city) {
      setError("Please fill out all required fields")
      return false
    }
    return true
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
  const completeOrder = (paymentMethodUsed: string, transactionId?: string) => {
    try {
      // Create order
      const orderId = addOrder({
        date: new Date().toISOString(),
        items: items,
        billingAddress: {
          name,
          address,
          city,
        },
        shippingMethod: shippingMethod === "pickup" ? "pickup" : "delivery",
        paymentMethod: paymentMethodUsed,
        total: totalAmount,
        status: "checkout-complete",
        transactionId: transactionId,
      })

      setCompletedOrderId(orderId)

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
            <div>
              <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="mr-2"
                />
                <CreditCard className="mr-2" size={20} />
                <div>{t.checkout.creditCard}</div>
              </label>
            </div>
            <div>
              <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                  className="mr-2"
                />
                <PayPalIcon className="mr-2" size={20} />
                <div>PayPal</div>
              </label>
            </div>
            <div>
              <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="mr-2"
                />
                <DollarSign className="mr-2" size={20} />
                <div>{t.checkout.cash}</div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t.checkout.orderSummary}</h2>
          <div className="bg-gray-50 p-4 rounded">
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
              disabled={isSubmitting}
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
