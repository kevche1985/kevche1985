"use client"

import type React from "react"

import { useState, useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function AccountSettingsPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const { user } = useAuth()
  const { toast } = useToast()

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const content = {
    en: {
      title: "Account Settings",
      profile: "Profile",
      password: "Password",
      notifications: "Notifications",
      profileInfo: "Update your profile information",
      name: "Name",
      email: "Email",
      save: "Save Changes",
      saving: "Saving...",
      changePassword: "Change your password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      updatePassword: "Update Password",
      updating: "Updating...",
      notificationPreferences: "Notification Preferences",
      orderUpdates: "Order Updates",
      orderUpdatesDesc: "Receive notifications about your order status",
      promotions: "Promotions and Offers",
      promotionsDesc: "Receive notifications about promotions and special offers",
      newsletter: "Newsletter",
      newsletterDesc: "Receive our monthly newsletter",
      successProfile: "Profile updated successfully",
      successPassword: "Password updated successfully",
      errorPasswordMatch: "Passwords do not match",
    },
    es: {
      title: "Configuración de Cuenta",
      profile: "Perfil",
      password: "Contraseña",
      notifications: "Notificaciones",
      profileInfo: "Actualiza la información de tu perfil",
      name: "Nombre",
      email: "Correo Electrónico",
      save: "Guardar Cambios",
      saving: "Guardando...",
      changePassword: "Cambia tu contraseña",
      currentPassword: "Contraseña Actual",
      newPassword: "Nueva Contraseña",
      confirmPassword: "Confirmar Nueva Contraseña",
      updatePassword: "Actualizar Contraseña",
      updating: "Actualizando...",
      notificationPreferences: "Preferencias de Notificación",
      orderUpdates: "Actualizaciones de Pedidos",
      orderUpdatesDesc: "Recibir notificaciones sobre el estado de tu pedido",
      promotions: "Promociones y Ofertas",
      promotionsDesc: "Recibir notificaciones sobre promociones y ofertas especiales",
      newsletter: "Boletín Informativo",
      newsletterDesc: "Recibir nuestro boletín mensual",
      successProfile: "Perfil actualizado con éxito",
      successPassword: "Contraseña actualizada con éxito",
      errorPasswordMatch: "Las contraseñas no coinciden",
    },
  }

  const t = language === "en" ? content.en : content.es

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would update the user profile here

      toast({
        title: t.successProfile,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: t.errorPasswordMatch,
        variant: "destructive",
      })
      return
    }

    setIsChangingPassword(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would update the password here

      toast({
        title: t.successPassword,
      })

      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">{t.title}</h1>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">{t.profile}</TabsTrigger>
            <TabsTrigger value="password">{t.password}</TabsTrigger>
            <TabsTrigger value="notifications">{t.notifications}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <form onSubmit={handleProfileUpdate}>
                <CardHeader>
                  <CardTitle>{t.profile}</CardTitle>
                  <CardDescription>{t.profileInfo}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="text-2xl">{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "Upload a new profile picture" : "Sube una nueva foto de perfil"}
                      </p>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm">
                          {language === "en" ? "Upload" : "Subir"}
                        </Button>
                        <Button type="button" variant="outline" size="sm">
                          {language === "en" ? "Remove" : "Eliminar"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">{t.name}</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">{t.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.saving}
                      </>
                    ) : (
                      t.save
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <form onSubmit={handlePasswordUpdate}>
                <CardHeader>
                  <CardTitle>{t.password}</CardTitle>
                  <CardDescription>{t.changePassword}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">{t.currentPassword}</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      require
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="new-password">{t.newPassword}</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">{t.confirmPassword}</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.updating}
                      </>
                    ) : (
                      t.updatePassword
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>{t.notifications}</CardTitle>
                <CardDescription>{t.notificationPreferences}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{t.orderUpdates}</h3>
                    <p className="text-sm text-muted-foreground">{t.orderUpdatesDesc}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="order-updates" className="sr-only">
                      {t.orderUpdates}
                    </Label>
                    <input
                      type="checkbox"
                      id="order-updates"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{t.promotions}</h3>
                    <p className="text-sm text-muted-foreground">{t.promotionsDesc}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="promotions" className="sr-only">
                      {t.promotions}
                    </Label>
                    <input
                      type="checkbox"
                      id="promotions"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{t.newsletter}</h3>
                    <p className="text-sm text-muted-foreground">{t.newsletterDesc}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="newsletter" className="sr-only">
                      {t.newsletter}
                    </Label>
                    <input
                      type="checkbox"
                      id="newsletter"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="button">{t.save}</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
