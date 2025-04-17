"use client"

import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { useOrders } from "@/context/order-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Clock, CheckCircle, AlertCircle, Truck, Store } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"

export default function MyOrdersPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const { orders } = useOrders()

  const content = {
    en: {
      title: "My Orders",
      subtitle: "Track and manage your print orders",
      noOrders: "You don't have any orders yet.",
      browse: "Browse Products",
      statuses: {
        "checkout-complete": "Order Placed",
        processing: "Processing",
        "ready-for-shipping": "Ready for Shipping",
        "ready-for-pickup": "Ready for Pickup",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
      },
      orderNumber: "Order #",
      date: "Date",
      total: "Total",
      status: "Status",
      viewDetails: "View Details",
      items: "items",
    },
    es: {
      title: "Mis Órdenes",
      subtitle: "Rastrea y administra tus órdenes de impresión",
      noOrders: "Aún no tienes ninguna orden.",
      browse: "Explorar Productos",
      statuses: {
        "checkout-complete": "Pedido Realizado",
        processing: "Procesando",
        "ready-for-shipping": "Listo para Envío",
        "ready-for-pickup": "Listo para Recoger",
        shipped: "Enviado",
        delivered: "Entregado",
        cancelled: "Cancelado",
      },
      orderNumber: "Orden #",
      date: "Fecha",
      total: "Total",
      status: "Estado",
      viewDetails: "Ver Detalles",
      items: "artículos",
    },
  }

  const t = language === "en" ? content.en : content.es

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "checkout-complete":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "processing":
        return <Package className="h-5 w-5 text-yellow-500" />
      case "ready-for-shipping":
      case "ready-for-pickup":
        return <Package className="h-5 w-5 text-orange-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-muted-foreground mb-8">{t.subtitle}</p>

          {orders.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <p className="mb-4">{t.noOrders}</p>
                <Button asChild>
                  <Link href="/products">{t.browse}</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        {t.orderNumber}
                        {order.id}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-medium">{t.statuses[order.status]}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {t.date}: {new Date(order.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t.total}: ${order.total.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} {t.items}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.shippingMethod === "pickup" ? (
                          <Store className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Truck className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/my-print/orders/${order.id}`}>{t.viewDetails}</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
