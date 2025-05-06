"use client"

import type React from "react"

import { useState, useContext, useRef, useEffect } from "react"
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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Skeleton } from "@/components/ui/skeleton"

export default function AccountSettingsPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientComponentClient()

  // Avatar resize configuration
  const MAX_AVATAR_SIZE = 200 // Maximum width/height in pixels
  const AVATAR_QUALITY = 0.8 // Image quality (0-1)

  // Update form values when user data is available
  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setIsPageLoading(false)
    }
  }, [user])

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
      fileTooLarge: "File is too large. Maximum size is 5MB.",
      invalidFileType: "Invalid file type. Please upload an image.",
      loading: "Loading your profile...",
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
      fileTooLarge: "El archivo es demasiado grande. El tamaño máximo es 5MB.",
      invalidFileType: "Tipo de archivo inválido. Por favor sube una imagen.",
      loading: "Cargando tu perfil...",
    },
  }

  const t = language === "en" ? content.en : content.es

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      // Update user profile in database
      const { error } = await supabase
        .from("users")
        .update({
          name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id)

      if (error) throw error

      toast({
        title: t.successProfile,
      })

      await refreshUser()
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
      // Update password in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: language === "en" ? "Invalid file" : "Archivo inválido",
        description: t.invalidFileType,
        variant: "destructive",
      })
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: language === "en" ? "File too large" : "Archivo demasiado grande",
        description: t.fileTooLarge,
        variant: "destructive",
      })
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    try {
      setIsUploading(true)

      // Resize the image and convert to base64
      const resizedBase64 = await resizeImage(file, MAX_AVATAR_SIZE, AVATAR_QUALITY)

      // Update the user record with the base64 avatar
      const { error: updateError } = await supabase.from("users").update({ avatar: resizedBase64 }).eq("id", user.id)

      if (updateError) throw updateError

      // Update local state
      refreshUser()

      toast({
        title: language === "en" ? "Avatar updated" : "Avatar actualizado",
        description:
          language === "en" ? "Your profile picture has been updated" : "Tu foto de perfil ha sido actualizada",
      })
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast({
        title: language === "en" ? "Upload failed" : "Error al subir",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Function to resize image using canvas
  const resizeImage = (file: File, maxSize: number, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxSize) {
            height = Math.round(height * (maxSize / width))
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = Math.round(width * (maxSize / height))
            height = maxSize
          }
        }

        // Create canvas and resize
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        // Draw resized image to canvas
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Convert to base64
        const base64 = canvas.toDataURL(file.type, quality)

        // Clean up
        URL.revokeObjectURL(img.src)

        resolve(base64)
      }

      img.onerror = () => {
        reject(new Error("Failed to load image"))
        URL.revokeObjectURL(img.src)
      }
    })
  }

  // Loading skeleton component
  if (isPageLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">{t.title}</h1>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-[200px]" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[300px]" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-[150px]" />
            </CardFooter>
          </Card>
        </div>
      </div>
    )
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
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                      <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "Upload a new profile picture" : "Sube una nueva foto de perfil"}
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleAvatarUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {language === "en" ? "Uploading..." : "Subiendo..."}
                            </>
                          ) : language === "en" ? (
                            "Upload"
                          ) : (
                            "Subir"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (!user) return
                            try {
                              const { error } = await supabase.from("users").update({ avatar: null }).eq("id", user.id)

                              if (error) throw error

                              // Update local state
                              refreshUser()

                              toast({
                                title: language === "en" ? "Avatar removed" : "Avatar eliminado",
                                description:
                                  language === "en"
                                    ? "Your profile picture has been removed"
                                    : "Tu foto de perfil ha sido eliminada",
                              })
                            } catch (error) {
                              console.error("Error removing avatar:", error)
                              toast({
                                title: language === "en" ? "Error" : "Error",
                                description: error instanceof Error ? error.message : "An error occurred",
                                variant: "destructive",
                              })
                            }
                          }}
                        >
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
                        disabled
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
