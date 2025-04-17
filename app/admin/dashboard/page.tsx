"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { Users, Package, ShoppingCart, FileText } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const { language } = useLanguage()

  const translations = {
    en: {
      title: "Admin Dashboard",
      welcome: "Welcome to your admin dashboard. Manage your print-on-demand business from here.",
      overview: "Overview",
      users: "Users",
      products: "Products",
      orders: "Orders",
      quoteRequests: "Quote Requests",
      payments: "Payments",
      settings: "Settings",
      totalUsers: "Total Users",
      viewAll: "View All",
      manageUsers: "Manage Users",
      totalProducts: "Total Products",
      manageProducts: "Manage Products",
      pendingOrders: "Pending Orders",
      manageOrders: "Manage Orders",
      pendingQuotes: "Pending Quote Requests",
      manageQuotes: "Manage Quote Requests",
      recentPayments: "Recent Payments",
      managePayments: "Manage Payments",
      systemSettings: "System Settings",
      manageSettings: "Manage Settings",
    },
    es: {
      title: "Panel de Administrador",
      welcome: "Bienvenido a tu panel de administrador. Gestiona tu negocio de impresión bajo demanda desde aquí.",
      overview: "Resumen",
      users: "Usuarios",
      products: "Productos",
      orders: "Pedidos",
      quoteRequests: "Solicitudes de Cotización",
      payments: "Pagos",
      settings: "Configuración",
      totalUsers: "Total de Usuarios",
      viewAll: "Ver Todos",
      manageUsers: "Gestionar Usuarios",
      totalProducts: "Total de Productos",
      manageProducts: "Gestionar Productos",
      pendingOrders: "Pedidos Pendientes",
      manageOrders: "Gestionar Pedidos",
      pendingQuotes: "Cotizaciones Pendientes",
      manageQuotes: "Gestionar Solicitudes",
      recentPayments: "Pagos Recientes",
      managePayments: "Gestionar Pagos",
      systemSettings: "Configuración del Sistema",
      manageSettings: "Gestionar Configuración",
    },
  }

  const t = translations[language]

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground mb-8">{t.welcome}</p>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-background border">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="users">{t.users}</TabsTrigger>
            <TabsTrigger value="products">{t.products}</TabsTrigger>
            <TabsTrigger value="orders">{t.orders}</TabsTrigger>
            <TabsTrigger value="quotes">{t.quoteRequests}</TabsTrigger>
            <TabsTrigger value="payments">{t.payments}</TabsTrigger>
            <TabsTrigger value="settings">{t.settings}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.totalUsers}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">120</div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/users">{t.viewAll}</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.totalProducts}</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/products">{t.viewAll}</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.pendingOrders}</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/orders">{t.viewAll}</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.pendingQuotes}</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/quotes">{t.viewAll}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>{t.recentPayments}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-full flex justify-between items-center">
                        <div>Order #1234</div>
                        <div className="font-medium">$129.99</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full flex justify-between items-center">
                        <div>Order #1233</div>
                        <div className="font-medium">$79.99</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full flex justify-between items-center">
                        <div>Order #1232</div>
                        <div className="font-medium">$249.99</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/admin/payments">{t.managePayments}</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>{t.systemSettings}</CardTitle>
                  <CardDescription>Manage your system settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-full flex justify-between items-center">
                        <div>System Status</div>
                        <div className="font-medium text-green-500">Online</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full flex justify-between items-center">
                        <div>Last Backup</div>
                        <div className="font-medium">Today, 09:30 AM</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/admin/settings">{t.manageSettings}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>{t.users}</CardTitle>
                <CardDescription>Manage your users and their permissions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-full flex justify-between items-center">
                      <div>Total Users</div>
                      <div className="font-medium">120</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full flex justify-between items-center">
                      <div>New Users (Last 30 days)</div>
                      <div className="font-medium">24</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/admin/users">{t.manageUsers}</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>{t.products}</CardTitle>
                <CardDescription>Manage your products and inventory.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-full flex justify-between items-center">
                      <div>Total Products</div>
                      <div className="font-medium">45</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full flex justify-between items-center">
                      <div>Categories</div>
                      <div className="font-medium">8</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/admin/products">{t.manageProducts}</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>{t.orders}</CardTitle>
                <CardDescription>Manage customer orders and fulfillment.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-full flex justify-between items-center">
                      <div>Pending Orders</div>
                      <div className="font-medium">8</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full flex justify-between items-center">
                      <div>Completed Orders (Last 30 days)</div>
                      <div className="font-medium">42</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/admin/orders">{t.manageOrders}</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle>{t.quoteRequests}</CardTitle>
                <CardDescription>Manage customer quote requests and responses.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-full flex justify-between items-center">
                      <div>Pending Quote Requests</div>
                      <div className="font-medium">12</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full flex justify-between items-center">
                      <div>Completed Quotes (Last 30 days)</div>
                      <div className="font-medium">18</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/admin/quotes">{t.manageQuotes}</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>{t.payments}</CardTitle>
                <CardDescription>Manage payments and transactions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-full flex justify-between items-center">
                      <div>Total Revenue (Last 30 days)</div>
                      <div className="font-medium">$12,450.00</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full flex justify-between items-center">
                      <div>Pending Payments</div>
                      <div className="font-medium">3</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/admin/payments">{t.managePayments}</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>{t.settings}</CardTitle>
                <CardDescription>Manage system settings and configurations.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-full flex justify-between items-center">
                      <div>System Status</div>
                      <div className="font-medium text-green-500">Online</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full flex justify-between items-center">
                      <div>Last Backup</div>
                      <div className="font-medium">Today, 09:30 AM</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/admin/settings">{t.manageSettings}</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
