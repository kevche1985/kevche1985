"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import Link from "next/link"
import { Heart, ShoppingCart, Search, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/context/cart-context"

export default function HeroSection() {
  const { language } = useContext(LanguageContext) || { language: "es" }

  const [isSelected, setIsSelected] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showZoom, setShowZoom] = useState(false)
  const { toast } = useToast()
  const { addItem } = useCart()

  // Check if image is in favorites on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      try {
        const favorites = JSON.parse(storedFavorites)
        setIsFavorite(favorites.some((fav: any) => fav.id === "hero-tshirt"))
      } catch (error) {
        console.error("Error parsing favorites:", error)
      }
    }
  }, [])

  // Handler functions
  const handleImageClick = () => {
    setIsSelected(!isSelected)
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()

    const productData = {
      id: "hero-tshirt",
      name: language === "en" ? "Custom T-Shirt Design" : "Diseño Personalizado de Camiseta",
      description:
        language === "en" ? "Premium quality custom printed t-shirt" : "Camiseta personalizada de calidad premium",
      price: 24.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-tshirt-hero.jpg-REJerWrLTRG2rHVGLd8TRvYF5UEPbA.jpeg",
      category: "Apparel",
    }

    const storedFavorites = localStorage.getItem("favorites")
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : []

    if (isFavorite) {
      favorites = favorites.filter((fav: any) => fav.id !== "hero-tshirt")
      toast({
        title: language === "en" ? "Removed from favorites" : "Eliminado de favoritos",
        description:
          language === "en"
            ? "Custom T-Shirt has been removed from your favorites"
            : "Camiseta personalizada ha sido eliminada de tus favoritos",
      })
    } else {
      favorites.push(productData)
      toast({
        title: language === "en" ? "Added to favorites" : "Añadido a favoritos",
        description:
          language === "en"
            ? "Custom T-Shirt has been added to your favorites"
            : "Camiseta personalizada ha sido añadida a tus favoritos",
      })
    }

    localStorage.setItem("favorites", JSON.stringify(favorites))
    setIsFavorite(!isFavorite)
    window.dispatchEvent(new Event("storage"))
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()

    addItem({
      id: "hero-tshirt",
      name: language === "en" ? "Custom T-Shirt Design" : "Diseño Personalizado de Camiseta",
      price: 24.99,
      quantity: 1,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-tshirt-hero.jpg-REJerWrLTRG2rHVGLd8TRvYF5UEPbA.jpeg",
      category: "Apparel",
    })

    toast({
      title: language === "en" ? "Added to cart" : "Añadido al carrito",
      description:
        language === "en"
          ? "Custom T-Shirt has been added to your cart"
          : "Camiseta personalizada ha sido añadida a tu carrito",
    })
  }

  const handleZoomClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowZoom(true)
  }

  const content = {
    en: {
      title: "Premium Print On Demand Services",
      subtitle: "For Your Business",
      description:
        "High-quality printing, fast delivery, and exceptional customer service. Get started today and bring your designs to life.",
      cta1: "Get Started",
      cta2: "View Products",
      customers: "satisfied customers",
    },
    es: {
      title: "Servicios Premium de Impresión Bajo Demanda",
      subtitle: "Para Tu Negocio",
      description:
        "Impresión de alta calidad, entrega rápida y servicio al cliente excepcional. Comienza hoy y da vida a tus diseños.",
      cta1: "Comenzar",
      cta2: "Ver Productos",
      customers: "clientes satisfechos",
    },
  }

  const t = language === "en" ? content.en : content.es

  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none mt-4">
                {t.title}
                <span className="gradient-text block mb-2">{t.subtitle}</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">{t.description}</p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="h-12" asChild>
                <Link href="/get-started">{t.cta1}</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12" asChild>
                <Link href="/products">{t.cta2}</Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="inline-block h-8 w-8 rounded-full border-2 border-background overflow-hidden bg-muted"
                  >
                    <Image
                      src={`/placeholder-32px.png?height=32&width=32`}
                      alt="User"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">500+</span> {t.customers}
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div
              className={`relative h-[350px] w-full overflow-hidden rounded-xl bg-muted md:h-[450px] cursor-pointer transition-all duration-200 ${isSelected ? "ring-2 ring-primary" : ""}`}
              onClick={handleImageClick}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-tshirt-hero.jpg-REJerWrLTRG2rHVGLd8TRvYF5UEPbA.jpeg"
                alt="Custom T-Shirt Design"
                fill
                className="object-cover"
              />

              {/* Quick action buttons */}
              <div className="absolute right-2 top-2 flex flex-col gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className={`h-8 w-8 rounded-full ${isFavorite ? "bg-primary text-white" : "bg-white text-gray-800"} hover:bg-primary hover:text-white`}
                  onClick={toggleFavorite}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-white text-gray-800 hover:bg-primary hover:text-white"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-white text-gray-800 hover:bg-primary hover:text-white"
                  onClick={handleZoomClick}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 h-24 w-64 rounded-lg card-gradient p-4 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-md bg-muted overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-tshirt-hero.jpg-REJerWrLTRG2rHVGLd8TRvYF5UEPbA.jpeg"
                    alt="Custom T-Shirt"
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {language === "en" ? "Geometric T-Shirt" : "Camiseta Geométrica"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {language === "en" ? "Premium Quality" : "Calidad Premium"}
                  </div>
                  <div className="text-sm font-bold text-primary mt-1">$24.99</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showZoom && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowZoom(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-lg">
            <Button
              className="absolute right-2 top-2 bg-white/20 hover:bg-white/40 rounded-full"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                setShowZoom(false)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-tshirt-hero.jpg-REJerWrLTRG2rHVGLd8TRvYF5UEPbA.jpeg"
              alt="Custom T-Shirt Design"
              width={800}
              height={800}
              className="object-contain max-h-[80vh]"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-white">
              <h3 className="font-bold text-xl">
                {language === "en" ? "Custom T-Shirt Design" : "Diseño Personalizado de Camiseta"}
              </h3>
              <p className="text-sm opacity-90">
                {language === "en"
                  ? "Premium quality custom printed t-shirt"
                  : "Camiseta personalizada de calidad premium"}
              </p>
              <p className="text-lg font-bold mt-2">$24.99</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
