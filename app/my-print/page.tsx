"use client"

import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Heart, FileImage, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useOrders } from "@/context/order-context"
import { ProtectedRoute } from "@/components/protected-route"

export default function MyPrintDashboard() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const { orders } = useOrders()

  const content = {
    en: {
      title: "My Print Dashboard",
      subtitle: "Manage your orders, designs, and favorites",
      orders: {
        title: "My Orders",
        subtitle: "Track and manage your print orders",
        viewAll: "View All Orders",
        noOrders: "You don't have any orders yet.",
        orderNumber: "Order #",
        date: "Date",
        total: "Total",
        status: "Status",
      },
      designs: {
        title: "My Designs",
        subtitle: "Your saved designs and templates",
        viewAll: "View All Designs",
        noDesigns: "You don't have any saved designs yet.",
        lastEdited: "Last edited",
      },
      favorites: {
        title: "My Favorites",
        subtitle: "Products and designs you've saved",
        viewAll: "View All Favorites",
        noFavorites: "You don't have any favorites yet.",
      },
    },
    es: {
      title: "Mi Panel de Impresión",
      subtitle: "Administra tus órdenes, diseños y favoritos",
      orders: {
        title: "Mis Órdenes",
        subtitle: "Rastrea y administra tus órdenes de impresión",
        viewAll: "Ver Todas las Órdenes",
        noOrders: "Aún no tienes ninguna orden.",
        orderNumber: "Orden #",
        date: "Fecha",
        total: "Total",
        status: "Estado",
      },
      designs: {
        title: "Mis Diseños",
        subtitle: "Tus diseños y plantillas guardados",
        viewAll: "Ver Todos los Diseños",
        noDesigns: "Aún no tienes diseños guardados.",
        lastEdited: "Última edición",
      },
      favorites: {
        title: "Mis Favoritos",
        subtitle: "Productos y diseños que has guardado",
        viewAll: "Ver Todos los Favoritos",
        noFavorites: "Aún no tienes favoritos.",
      },
    },
  }

  const t = language === "en" ? content.en : content.es

  // Mock designs data - in a real app, this would come from an API
  const designs = [
    {
      id: "design-1",
      name: "Business Card Design",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Business+Card",
      lastEdited: "2025-03-01",
    },
    {
      id: "design-2",
      name: "Logo Design",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Logo",
      lastEdited: "2025-03-05",
    },
  ]

  // Mock favorites data - in a real app, this would come from an API
  const favorites = [
    {
      id: "prod-1",
      name: "Premium Business Cards",
      image: "/placeholder.svg?height=200&width=300&text=Business+Cards",
      price: 24.99,
    },
    {
      id: "prod-2",
      name: "Custom T-Shirt",
      image: "/placeholder.svg?height=200&width=300&text=T-Shirt",
      price: 29.99,
    },
  ]

  return (
    <ProtectedRoute>
      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-muted-foreground mb-8">{t.subtitle}</p>

          <div className="grid grid-cols-1 gap-8">
            {/* Orders Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{t.orders.title}</h2>
                  <p className="text-muted-foreground">{t.orders.subtitle}</p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/my-print/orders">
                    {t.orders.viewAll}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {orders.length === 0 ? (
                <Card className="p-6 text-center">
                  <CardContent>
                    <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p>{t.orders.noOrders}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 2).map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            {t.orders.orderNumber}
                            {order.id}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              {t.orders.date}: {new Date(order.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t.orders.total}: ${order.total.toFixed(2)}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/my-print/orders/${order.id}`}>
                              {language === "en" ? "View Details" : "Ver Detalles"}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Designs Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{t.designs.title}</h2>
                  <p className="text-muted-foreground">{t.designs.subtitle}</p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/my-print/designs">
                    {t.designs.viewAll}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {designs.length === 0 ? (
                <Card className="p-6 text-center">
                  <CardContent>
                    <FileImage className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p>{t.designs.noDesigns}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {designs.slice(0, 2).map((design) => (
                    <Card key={design.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <Image
                          src={design.thumbnail || "/placeholder.svg"}
                          alt={design.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-medium">{design.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t.designs.lastEdited}: {new Date(design.lastEdited).toLocaleDateString()}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button size="sm" asChild>
                          <Link href={`/my-print/designs/${design.id}`}>
                            {language === "en" ? "Edit Design" : "Editar Diseño"}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Favorites Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{t.favorites.title}</h2>
                  <p className="text-muted-foreground">{t.favorites.subtitle}</p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/my-print/favorites">
                    {t.favorites.viewAll}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {favorites.length === 0 ? (
                <Card className="p-6 text-center">
                  <CardContent>
                    <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p>{t.favorites.noFavorites}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.slice(0, 2).map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 text-primary hover:bg-background/90"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                      <CardContent className="pt-4">
                        <Link href={`/products/${item.id}`}>
                          <h3 className="font-medium hover:text-primary transition-colors">{item.name}</h3>
                        </Link>
                        <p className="font-bold mt-1">${item.price.toFixed(2)}</p>
                      </CardContent>
                      <CardFooter>
                        <Button size="sm">{language === "en" ? "Add to Cart" : "Añadir al Carrito"}</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
