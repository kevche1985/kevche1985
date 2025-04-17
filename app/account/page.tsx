"use client"

import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, CreditCard, Heart, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AccountPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const { user } = useAuth()
  const router = useRouter()

  const content = {
    en: {
      title: "My Account",
      profile: "Profile",
      orders: "Orders",
      payments: "Payments",
      favorites: "Favorites",
      settings: "Settings",
      name: "Name",
      email: "Email",
      role: "Account Type",
      viewOrders: "View Orders",
      viewPayments: "View Payment History",
      viewFavorites: "View Favorites",
      editProfile: "Edit Profile",
      dashboard: "Go to Dashboard",
      roles: {
        user: "Customer",
        operator: "Operator",
        admin: "Administrator",
      },
    },
    es: {
      title: "Mi Cuenta",
      profile: "Perfil",
      orders: "Pedidos",
      payments: "Pagos",
      favorites: "Favoritos",
      settings: "Configuración",
      name: "Nombre",
      email: "Correo Electrónico",
      role: "Tipo de Cuenta",
      viewOrders: "Ver Pedidos",
      viewPayments: "Ver Historial de Pagos",
      viewFavorites: "Ver Favoritos",
      editProfile: "Editar Perfil",
      dashboard: "Ir al Panel",
      roles: {
        user: "Cliente",
        operator: "Operador",
        admin: "Administrador",
      },
    },
  }

  const t = language === "en" ? content.en : content.es

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin/dashboard"
    if (user?.role === "operator") return "/operator/dashboard"
    return "/my-print/orders"
  }

  return (
    <ProtectedRoute>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">{t.title}</h1>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">{t.profile}</TabsTrigger>
            <TabsTrigger value="orders">{t.orders}</TabsTrigger>
            <TabsTrigger value="payments">{t.payments}</TabsTrigger>
            <TabsTrigger value="favorites">{t.favorites}</TabsTrigger>
            <TabsTrigger value="settings">{t.settings}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t.profile}</CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "View and manage your account information"
                    : "Ver y gestionar la información de tu cuenta"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-2xl">{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold">{user?.name}</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-muted-foreground mr-2">{t.role}:</span>
                      <span className="text-sm font-medium">{t.roles[user?.role as keyof typeof t.roles]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button asChild variant="outline">
                    <Link href="/account/settings">{t.editProfile}</Link>
                  </Button>

                  {(user?.role === "admin" || user?.role === "operator") && (
                    <Button asChild>
                      <Link href={getDashboardLink()}>{t.dashboard}</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>{t.orders}</CardTitle>
                <CardDescription>
                  {language === "en" ? "View and track your orders" : "Ver y rastrear tus pedidos"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Package className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">{language === "en" ? "Your Orders" : "Tus Pedidos"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "Track and manage your orders" : "Rastrea y gestiona tus pedidos"}
                      </p>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href="/my-print/orders">{t.viewOrders}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>{t.payments}</CardTitle>
                <CardDescription>
                  {language === "en" ? "View your payment history" : "Ver tu historial de pagos"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">{language === "en" ? "Payment History" : "Historial de Pagos"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "View your past transactions" : "Ver tus transacciones pasadas"}
                      </p>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href="/account/payments">{t.viewPayments}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>{t.favorites}</CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "View your saved designs and favorite products"
                    : "Ver tus diseños guardados y productos favoritos"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Heart className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">{language === "en" ? "Your Favorites" : "Tus Favoritos"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "Access your saved items" : "Accede a tus elementos guardados"}
                      </p>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href="/my-print/favorites">{t.viewFavorites}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>{t.settings}</CardTitle>
                <CardDescription>
                  {language === "en" ? "Manage your account settings" : "Gestiona la configuración de tu cuenta"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Settings className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">
                        {language === "en" ? "Account Settings" : "Configuración de Cuenta"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "en"
                          ? "Update your profile and preferences"
                          : "Actualiza tu perfil y preferencias"}
                      </p>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href="/account/settings">{t.settings}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
