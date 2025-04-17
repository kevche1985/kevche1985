"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState, useContext } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingCart, User, Globe, ChevronDown, Sparkles, LogOut, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { LanguageContext } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { LoginModal } from "@/components/login-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navbar() {
  const { language, setLanguage } = useContext(LanguageContext) || { language: "es", setLanguage: () => {} }
  const { getItemCount } = useCart()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false)
  const [isAIMenuOpen, setIsAIMenuOpen] = useState(false)
  const [isMyPrintMenuOpen, setIsMyPrintMenuOpen] = useState(false)
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [aiTimeoutId, setAITimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [myPrintTimeoutId, setMyPrintTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [servicesTimeoutId, setServicesTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false)
  const [adminTimeoutId, setAdminTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const cartItemCount = getItemCount()

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId)
    setIsProductsMenuOpen(true)
  }

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsProductsMenuOpen(false)
    }, 300) // 300ms delay before closing
    setTimeoutId(id)
  }

  const handleAIMouseEnter = () => {
    if (aiTimeoutId) clearTimeout(aiTimeoutId)
    setIsAIMenuOpen(true)
  }

  const handleAIMouseLeave = () => {
    const id = setTimeout(() => {
      setIsAIMenuOpen(false)
    }, 300) // 300ms delay before closing
    setAITimeoutId(id)
  }

  const handleMyPrintEnter = () => {
    if (myPrintTimeoutId) clearTimeout(myPrintTimeoutId)
    setIsMyPrintMenuOpen(true)
  }

  const handleMyPrintLeave = () => {
    const id = setTimeout(() => {
      setIsMyPrintMenuOpen(false)
    }, 300)
    setMyPrintTimeoutId(id)
  }

  const handleServicesMouseEnter = () => {
    if (servicesTimeoutId) clearTimeout(servicesTimeoutId)
    setIsServicesMenuOpen(true)
  }

  const handleServicesMouseLeave = () => {
    const id = setTimeout(() => {
      setIsServicesMenuOpen(false)
    }, 300)
    setServicesTimeoutId(id)
  }

  const toggleLanguage = (lang: string) => {
    setLanguage(lang)
  }

  const handleLoginClick = () => {
    setIsLoginModalOpen(true)
  }

  const handleLogout = () => {
    logout()
  }

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin/dashboard"
    if (user?.role === "operator") return "/operator/dashboard"
    return "/my-print/orders"
  }

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo-print.png" alt="PrintOnDemand Logo" className="h-8 w-8" />
            <span className="text-xl font-bold gradient-text">PrintOnDemand</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <Link
                href="/products"
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {language === "en" ? "Products" : "Productos"}
                <ChevronDown className="h-4 w-4" />
              </Link>

              {isProductsMenuOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-64 bg-background border rounded-lg shadow-lg p-4 z-[1000]"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {language === "en" ? (
                      <>
                        <Link
                          href="/products/business-cards"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Business Cards
                        </Link>
                        <Link
                          href="/products/flyers"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Flyers
                        </Link>
                        <Link
                          href="/products/posters"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Posters
                        </Link>
                        <Link
                          href="/products/stickers"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Stickers
                        </Link>
                        <Link
                          href="/products/t-shirts"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          T-Shirts
                        </Link>
                        <Link
                          href="/products/mugs"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Mugs
                        </Link>
                        <Link
                          href="/products/canvas"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Canvas Prints
                        </Link>
                        <Link
                          href="/products/agendas-y-cuadernos"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Planners & Notebooks
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/products/tarjetas"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Tarjetas
                        </Link>
                        <Link
                          href="/products/flyers"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Flyers
                        </Link>
                        <Link
                          href="/products/posters"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Posters
                        </Link>
                        <Link
                          href="/products/stickers"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Stickers
                        </Link>
                        <Link
                          href="/products/camisetas"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Camisetas
                        </Link>
                        <Link
                          href="/products/tazas"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Tazas
                        </Link>
                        <Link
                          href="/products/lienzos"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Lienzos
                        </Link>
                        <Link
                          href="/products/agendas-y-cuadernos"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Agendas y Cuadernos
                        </Link>
                      </>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <Link href="/products" className="text-sm font-medium text-primary hover:underline">
                      {language === "en" ? "View all products" : "Ver todos los productos"}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* AI Section Menu */}
            <div className="relative" onMouseEnter={handleAIMouseEnter} onMouseLeave={handleAIMouseLeave}>
              <Link
                href="/ai"
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Sparkles className="h-4 w-4 mr-1 text-primary" />
                {language === "en" ? "AI Tools" : "Herramientas IA"}
                <ChevronDown className="h-4 w-4" />
              </Link>

              {isAIMenuOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-64 bg-background border rounded-lg shadow-lg p-4 z-[1000]"
                  onMouseEnter={handleAIMouseEnter}
                  onMouseLeave={handleAIMouseLeave}
                >
                  <div className="space-y-2">
                    <Link
                      href="/ai/logo"
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {language === "en" ? "AI Logo Generator" : "Generador de Logos IA"}
                    </Link>
                    <Link
                      href="/ai/image-generator"
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {language === "en" ? "AI Image Generator" : "Generador de Imágenes IA"}
                    </Link>
                    <Link
                      href="/ai/fonts"
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {language === "en" ? "AI Fonts" : "Fuentes IA"}
                    </Link>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <Link href="/ai" className="text-sm font-medium text-primary hover:underline">
                      {language === "en" ? "Explore all AI tools" : "Explorar todas las herramientas IA"}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" onMouseEnter={handleServicesMouseEnter} onMouseLeave={handleServicesMouseLeave}>
              <Link
                href="/services"
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {language === "en" ? "Services" : "Servicios"}
                <ChevronDown className="h-4 w-4" />
              </Link>

              {isServicesMenuOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-64 bg-background border rounded-lg shadow-lg p-4 z-[1000]"
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  <div className="space-y-2">
                    {language === "en" ? (
                      <>
                        <Link
                          href="/services/digital-printing"
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Digital Printing
                        </Link>
                        <Link
                          href="/services/large-format"
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Large Format Printing
                        </Link>
                        <Link
                          href="/services/design"
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Design Services
                        </Link>
                        <Link
                          href="/services/delivery"
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Delivery & Shipping
                        </Link>
                        <Link
                          href="/services/consultation"
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Consultation
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/services/digital-printing"
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Impresión Digital
                        </Link>
                        <Link
                          href="/services/large-format"
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Impresión de Gran Formato
                        </Link>
                        <Link
                          href="/services/design"
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Servicios de Diseño
                        </Link>
                        <Link
                          href="/services/delivery"
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Entrega y Envío
                        </Link>
                        <Link
                          href="/services/consultation"
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Consultoría
                        </Link>
                      </>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <Link href="/services" className="text-sm font-medium text-primary hover:underline">
                      {language === "en" ? "View all services" : "Ver todos los servicios"}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mi Print Menu */}
            <div className="relative" onMouseEnter={handleMyPrintEnter} onMouseLeave={handleMyPrintLeave}>
              <Link
                href="/my-print"
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {language === "en" ? "My Print" : "Mi Print"}
                <ChevronDown className="h-4 w-4" />
              </Link>

              {isMyPrintMenuOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-48 bg-background border rounded-lg shadow-lg p-4 z-[1000]"
                  onMouseEnter={handleMyPrintEnter}
                  onMouseLeave={handleMyPrintLeave}
                >
                  <div className="space-y-2">
                    <Link
                      href="/my-print/orders"
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {language === "en" ? "My Orders" : "Mis Órdenes"}
                    </Link>
                    <Link
                      href="/my-print/designs"
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {language === "en" ? "My Designs" : "Mis Diseños"}
                    </Link>
                    <Link
                      href="/my-print/favorites"
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {language === "en" ? "Favorites" : "Favoritos"}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {language === "en" ? "About" : "Nosotros"}
            </Link>
            {user?.role === "admin" && (
              <div
                className="relative"
                onMouseEnter={() => {
                  if (adminTimeoutId) clearTimeout(adminTimeoutId)
                  setIsAdminMenuOpen(true)
                }}
                onMouseLeave={() => {
                  const id = setTimeout(() => {
                    setIsAdminMenuOpen(false)
                  }, 300)
                  setAdminTimeoutId(id)
                }}
              >
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:text-foreground transition-colors"
                >
                  {language === "en" ? "Admin" : "Administrador"}
                  <ChevronDown className="h-4 w-4" />
                </Link>

                {isAdminMenuOpen && (
                  <div
                    className="absolute left-0 top-full mt-2 w-64 bg-background border rounded-lg shadow-lg p-4 z-[1000]"
                    onMouseEnter={() => {
                      if (adminTimeoutId) clearTimeout(adminTimeoutId)
                      setIsAdminMenuOpen(true)
                    }}
                    onMouseLeave={() => {
                      const id = setTimeout(() => {
                        setIsAdminMenuOpen(false)
                      }, 300)
                      setAdminTimeoutId(id)
                    }}
                  >
                    <div className="space-y-2">
                      <Link
                        href="/admin/dashboard"
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {language === "en" ? "Dashboard" : "Panel Principal"}
                      </Link>
                      <Link
                        href="/admin/users"
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {language === "en" ? "User Management" : "Gestión de Usuarios"}
                      </Link>
                      <Link
                        href="/admin/products"
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {language === "en" ? "Product Management" : "Gestión de Productos"}
                      </Link>
                      <Link
                        href="/admin/orders"
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {language === "en" ? "Order Management" : "Gestión de Pedidos"}
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {language === "en" ? "System Settings" : "Configuración del Sistema"}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Globe className="h-5 w-5 text-primary" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toggleLanguage("en")} className={language === "en" ? "bg-accent" : ""}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleLanguage("es")} className={language === "es" ? "bg-accent" : ""}>
                Español
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-accent transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-red-600 font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()}>
                    {user.role === "admin"
                      ? "Admin Dashboard"
                      : user.role === "operator"
                        ? "Operator Dashboard"
                        : language === "en"
                          ? "My Account"
                          : "Mi Cuenta"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-print/orders">{language === "en" ? "My Orders" : "Mis Órdenes"}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-print/favorites">{language === "en" ? "Favorites" : "Favoritos"}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    {language === "en" ? "Settings" : "Configuración"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {language === "en" ? "Logout" : "Cerrar Sesión"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleLoginClick}>
              <User className="h-5 w-5" />
            </Button>
          )}

          <Button asChild className="hidden md:flex">
            <Link href="/get-started">{language === "en" ? "Get Started" : "Comenzar"}</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/logo-print.png" alt="PrintOnDemand Logo" className="h-8 w-8" />
              <span className="text-xl font-bold gradient-text">PrintOnDemand</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="container grid gap-6 py-6">
            <Link
              href="/products"
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === "en" ? "Products" : "Productos"}
            </Link>
            <Link
              href="/ai"
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Sparkles className="h-4 w-4 mr-1 inline text-primary" />
              {language === "en" ? "AI Tools" : "Herramientas IA"}
            </Link>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">{language === "en" ? "Services" : "Servicios"}</p>
              <div className="grid grid-cols-1 gap-1 pl-4">
                <Link
                  href="/services/digital-printing"
                  className="text-base text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === "en" ? "Digital Printing" : "Impresión Digital"}
                </Link>
                <Link
                  href="/services/large-format"
                  className="text-base text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === "en" ? "Large Format Printing" : "Impresión de Gran Formato"}
                </Link>
                <Link
                  href="/services/design"
                  className="text-base text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === "en" ? "Design Services" : "Servicios de Diseño"}
                </Link>
                <Link
                  href="/services/delivery"
                  className="text-base text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === "en" ? "Delivery & Shipping" : "Entrega y Envío"}
                </Link>
                <Link
                  href="/services"
                  className="text-base text-primary hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === "en" ? "View All Services" : "Ver Todos los Servicios"}
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">{language === "en" ? "My Print" : "Mi Print"}</p>
              <div className="grid grid-cols-1 gap-1 pl-4">
                <Link
                  href="/my-print/orders"
                  className="text-base text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === "en" ? "My Orders" : "Mis Órdenes"}
                </Link>
                <Link
                  href="/my-print/designs"
                  className="text-base text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === "en" ? "My Designs" : "Mis Diseños"}
                </Link>
                <Link
                  href="/my-print/favorites"
                  className="text-base text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === "en" ? "Favorites" : "Favoritos"}
                </Link>
              </div>
            </div>
            <Link
              href="/about"
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === "en" ? "About" : "Nosotros"}
            </Link>
            {user?.role === "admin" && (
              <div className="space-y-2">
                <p className="text-lg font-medium text-primary">{language === "en" ? "Admin" : "Administrador"}</p>
                <div className="grid grid-cols-1 gap-1 pl-4">
                  <Link
                    href="/admin/dashboard"
                    className="text-base text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === "en" ? "Dashboard" : "Panel Principal"}
                  </Link>
                  <Link
                    href="/admin/users"
                    className="text-base text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === "en" ? "Dashboard" : "Panel Principal"}
                  </Link>
                  <Link
                    href="/admin/users"
                    className="text-base text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === "en" ? "User Management" : "Gestión de Usuarios"}
                  </Link>
                  <Link
                    href="/admin/products"
                    className="text-base text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === "en" ? "Product Management" : "Gestión de Productos"}
                  </Link>
                  <Link
                    href="/admin/orders"
                    className="text-base text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === "en" ? "Order Management" : "Gestión de Pedidos"}
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="text-base text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === "en" ? "System Settings" : "Configuración del Sistema"}
                  </Link>
                </div>
              </div>
            )}
            {user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {user.role === "admin"
                    ? "Admin Dashboard"
                    : user.role === "operator"
                      ? "Operator Dashboard"
                      : language === "en"
                        ? "My Account"
                        : "Mi Cuenta"}
                </Link>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {language === "en" ? "Logout" : "Cerrar Sesión"}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsLoginModalOpen(true)
                }}
              >
                <User className="mr-2 h-4 w-4" />
                {language === "en" ? "Login / Register" : "Iniciar Sesión / Registrarse"}
              </Button>
            )}
            <div className="flex gap-4 items-center">
              <Button
                onClick={() => toggleLanguage("en")}
                variant={language === "en" ? "default" : "outline"}
                size="sm"
              >
                English
              </Button>
              <Button
                onClick={() => toggleLanguage("es")}
                variant={language === "es" ? "default" : "outline"}
                size="sm"
              >
                Español
              </Button>
            </div>
            <Button className="w-full" onClick={() => setIsMenuOpen(false)} asChild>
              <Link href="/get-started">{language === "en" ? "Get Started" : "Comenzar"}</Link>
            </Button>
          </nav>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  )
}
