"use client"

import { useContext, useState } from "react"
import { LanguageContext } from "@/context/language-context"
import { useOrders } from "@/context/order-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Clock, CheckCircle, AlertCircle, Truck, Store, Search, Filter, RefreshCw } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function MyOrdersPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const { orders } = useOrders()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")

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
      search: "Search orders...",
      filter: "Filter by status",
      sort: "Sort by",
      all: "All Orders",
      active: "Active",
      completed: "Completed",
      cancelled: "Cancelled",
      newest: "Newest first",
      oldest: "Oldest first",
      highestTotal: "Highest total",
      lowestTotal: "Lowest total",
      refresh: "Refresh",
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
      search: "Buscar órdenes...",
      filter: "Filtrar por estado",
      sort: "Ordenar por",
      all: "Todas las Órdenes",
      active: "Activas",
      completed: "Completadas",
      cancelled: "Canceladas",
      newest: "Más recientes",
      oldest: "Más antiguas",
      highestTotal: "Mayor total",
      lowestTotal: "Menor total",
      refresh: "Actualizar",
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

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter((order) => {
    // Search filter
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.billingAddress?.name || "").toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter
    let matchesStatus = true
    if (statusFilter === "active") {
      matchesStatus = !["delivered", "cancelled"].includes(order.status)
    } else if (statusFilter === "completed") {
      matchesStatus = order.status === "delivered"
    } else if (statusFilter === "cancelled") {
      matchesStatus = order.status === "cancelled"
    }

    return matchesSearch && matchesStatus
  })

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortOrder) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "highestTotal":
        return b.total - a.total
      case "lowestTotal":
        return a.total - b.total
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  return (
    <ProtectedRoute>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t.refresh}
            </Button>
          </div>
          <p className="text-muted-foreground mb-6">{t.subtitle}</p>

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
            <>
              {/* Filters and search */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder={t.search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder={t.filter} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.all}</SelectItem>
                      <SelectItem value="active">{t.active}</SelectItem>
                      <SelectItem value="completed">{t.completed}</SelectItem>
                      <SelectItem value="cancelled">{t.cancelled}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder={t.sort} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">{t.newest}</SelectItem>
                      <SelectItem value="oldest">{t.oldest}</SelectItem>
                      <SelectItem value="highestTotal">{t.highestTotal}</SelectItem>
                      <SelectItem value="lowestTotal">{t.lowestTotal}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Orders list */}
              <div className="space-y-4">
                {sortedOrders.length === 0 ? (
                  <Card className="text-center p-6">
                    <CardContent className="pt-4">
                      <p>
                        {language === "en" ? "No orders match your filters" : "Ninguna orden coincide con tus filtros"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  sortedOrders.map((order) => (
                    <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            {t.orderNumber}
                            {order.id}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <Badge
                              variant={
                                order.status === "delivered"
                                  ? "success"
                                  : order.status === "cancelled"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {t.statuses[order.status]}
                            </Badge>
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
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
