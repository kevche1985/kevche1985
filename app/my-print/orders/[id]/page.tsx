"use client"

import { useEffect, useState } from "react"
import { useOrders, type OrderStatus } from "@/context/order-context"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { OrderTrackingBar } from "@/components/order-tracking-bar"
import { Package, Truck, CreditCard, Calendar, MapPin, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ProtectedRoute } from "@/components/protected-route"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { getOrderById, updateOrderStatus } = useOrders()
  const { language } = useLanguage()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const content = {
    en: {
      orderDetails: "Order Details",
      orderNotFound: "Order Not Found",
      orderNotFoundDesc: "Sorry, we couldn't find the order you're looking for.",
      orderItems: "Order Items",
      orderInformation: "Order Information",
      shippingInformation: "Shipping Information",
      paymentInformation: "Payment Information",
      orderId: "Order ID",
      date: "Date",
      status: "Status",
      name: "Name",
      address: "Address",
      city: "City",
      phone: "Phone",
      email: "Email",
      shippingMethod: "Shipping Method",
      pickup: "Pickup",
      delivery: "Delivery",
      paymentMethod: "Payment Method",
      transactionId: "Transaction ID",
      quantity: "Quantity",
      total: "Total",
      backToOrders: "Back to Orders",
      simulateProgress: "Simulate Progress",
      orderStatus: {
        "checkout-complete": "Order Placed",
        processing: "Processing",
        "ready-for-shipping": "Ready for Shipping",
        "ready-for-pickup": "Ready for Pickup",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
      },
    },
    es: {
      orderDetails: "Detalles del Pedido",
      orderNotFound: "Pedido No Encontrado",
      orderNotFoundDesc: "Lo sentimos, no pudimos encontrar el pedido que estás buscando.",
      orderItems: "Artículos del Pedido",
      orderInformation: "Información del Pedido",
      shippingInformation: "Información de Envío",
      paymentInformation: "Información de Pago",
      orderId: "ID del Pedido",
      date: "Fecha",
      status: "Estado",
      name: "Nombre",
      address: "Dirección",
      city: "Ciudad",
      phone: "Teléfono",
      email: "Correo Electrónico",
      shippingMethod: "Método de Envío",
      pickup: "Recoger",
      delivery: "Entrega",
      paymentMethod: "Método de Pago",
      transactionId: "ID de Transacción",
      quantity: "Cantidad",
      total: "Total",
      backToOrders: "Volver a Pedidos",
      simulateProgress: "Simular Progreso",
      orderStatus: {
        "checkout-complete": "Pedido Realizado",
        processing: "Procesando",
        "ready-for-shipping": "Listo para Envío",
        "ready-for-pickup": "Listo para Recoger",
        shipped: "Enviado",
        delivered: "Entregado",
        cancelled: "Cancelado",
      },
    },
  }

  const t = language === "en" ? content.en : content.es

  useEffect(() => {
    // Fetch the order
    const fetchOrder = () => {
      try {
        const foundOrder = getOrderById(params.id)
        setOrder(foundOrder)
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, getOrderById])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  // Function to simulate order progress for demo purposes
  const simulateProgress = () => {
    if (!order) return

    setUpdating(true)

    const statusOrder: OrderStatus[] = [
      "checkout-complete",
      "processing",
      order.shippingMethod === "pickup" ? "ready-for-pickup" : "ready-for-shipping",
      order.shippingMethod === "pickup" ? "delivered" : "shipped",
      "delivered",
    ]

    const currentIndex = statusOrder.indexOf(order.status as OrderStatus)
    if (currentIndex < statusOrder.length - 1) {
      const nextStatus = statusOrder[currentIndex + 1]
      updateOrderStatus(order.id, nextStatus, "Status updated for demonstration")

      // Update local state
      setOrder({
        ...order,
        status: nextStatus,
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status: nextStatus,
            timestamp: new Date().toISOString(),
            note: "Status updated for demonstration",
          },
        ],
      })
    }

    setUpdating(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">{t.orderNotFound}</h1>
        <p>{t.orderNotFoundDesc}</p>
        <Button asChild className="mt-4">
          <Link href="/my-print/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToOrders}
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {t.orderDetails}: <span className="text-gray-600">{order.id}</span>
          </h1>
          <Button variant="outline" asChild>
            <Link href="/my-print/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backToOrders}
            </Link>
          </Button>
        </div>

        {/* Order Tracking */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <OrderTrackingBar currentStatus={order.status} shippingMethod={order.shippingMethod} />

            {/* Demo button for simulating progress */}
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={simulateProgress}
                disabled={updating || order.status === "delivered" || order.status === "cancelled"}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${updating ? "animate-spin" : ""}`} />
                {t.simulateProgress}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2" size={20} />
                  {t.orderItems}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center pb-4 border-b last:border-0">
                      <div className="flex items-center">
                        {/* Product image */}
                        <div className="w-16 h-16 relative mr-4 bg-gray-100 rounded overflow-hidden">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package size={24} />
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {t.quantity}: {item.quantity}
                          </p>
                          {item.customization && (
                            <p className="text-xs text-blue-600 mt-1">
                              {item.customization.aiGenerated ? "AI-Generated" : "Custom"} Design
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center">
                    <p className="font-medium">{t.total}</p>
                    <p className="font-bold">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2" size={20} />
                  {t.orderInformation}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">{t.orderId}</p>
                    <p>{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t.date}</p>
                    <p>{formatDate(order.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t.status}</p>
                    <p className="capitalize">{t.orderStatus[order.status] || order.status.replace(/-/g, " ")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2" size={20} />
                  {t.shippingInformation}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.billingAddress && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">{t.name}</p>
                        <p>{order.billingAddress.name}</p>
                      </div>
                      {order.billingAddress.email && (
                        <div>
                          <p className="text-sm text-gray-500">{t.email}</p>
                          <p>{order.billingAddress.email}</p>
                        </div>
                      )}
                      {order.billingAddress.phone && (
                        <div>
                          <p className="text-sm text-gray-500">{t.phone}</p>
                          <p>{order.billingAddress.phone}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500">{t.address}</p>
                        <p>{order.billingAddress.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t.city}</p>
                        <p>{order.billingAddress.city}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">{t.shippingMethod}</p>
                    <p className="flex items-center">
                      <Truck className="mr-2" size={16} />
                      {order.shippingMethod === "pickup" ? t.pickup : t.delivery}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2" size={20} />
                  {t.paymentInformation}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">{t.paymentMethod}</p>
                    <p className="capitalize">{order.paymentMethod}</p>
                  </div>
                  {order.transactionId && (
                    <div>
                      <p className="text-sm text-gray-500">{t.transactionId}</p>
                      <p className="text-xs">{order.transactionId}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
