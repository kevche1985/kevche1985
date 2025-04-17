"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Heart, BarChart2, ShoppingCart, Search, X } from "lucide-react"
import { useContext, useState, useEffect } from "react"
import { LanguageContext } from "@/context/language-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/context/cart-context"

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isNew?: boolean
  isBestseller?: boolean
}

export function ProductCard({
  id,
  name,
  description,
  price,
  image,
  category,
  isNew = false,
  isBestseller = false,
}: ProductCardProps) {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const [isSelected, setIsSelected] = useState(false)
  const router = useRouter()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [isFavorite, setIsFavorite] = useState(false)
  const [showZoom, setShowZoom] = useState(false)

  useEffect(() => {
    // Get favorites from localStorage
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      try {
        const favorites = JSON.parse(storedFavorites)
        // Check if this product is in favorites
        setIsFavorite(favorites.some((fav: any) => fav.id === id))
      } catch (error) {
        console.error("Error parsing favorites:", error)
        setIsFavorite(false)
      }
    }
  }, [id])

  const handleClick = () => {
    setIsSelected(!isSelected)

    // If selecting (not deselecting), increment the selection count
    if (!isSelected) {
      // Get current product stats from localStorage
      const storedStats = localStorage.getItem("product_stats")
      const stats = storedStats ? JSON.parse(storedStats) : {}

      // Get or initialize stats for this product
      if (!stats[id]) {
        stats[id] = { views: 0, selections: 0 }
      }

      // Increment selections count for this product
      stats[id].selections = (stats[id].selections || 0) + 1

      // Save updated stats to localStorage
      localStorage.setItem("product_stats", JSON.stringify(stats))
    }
  }

  const handleDoubleClick = () => {
    router.push(`/products/${category.toLowerCase()}/${id}`)
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click event

    // Get current favorites from localStorage
    const storedFavorites = localStorage.getItem("favorites")
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : []

    if (isFavorite) {
      // Remove from favorites
      favorites = favorites.filter((fav: any) => fav.id !== id)
      toast({
        title: language === "en" ? "Removed from favorites" : "Eliminado de favoritos",
        description:
          language === "en"
            ? `${name} has been removed from your favorites`
            : `${name} ha sido eliminado de tus favoritos`,
      })
    } else {
      // Add to favorites
      favorites.push({
        id,
        name,
        description,
        price,
        image,
        category,
      })
      toast({
        title: language === "en" ? "Added to favorites" : "Añadido a favoritos",
        description:
          language === "en" ? `${name} has been added to your favorites` : `${name} ha sido añadido a tus favoritos`,
      })
    }

    // Save updated favorites to localStorage
    localStorage.setItem("favorites", JSON.stringify(favorites))

    // Update state
    setIsFavorite(!isFavorite)

    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"))
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click event

    addItem({
      id,
      name,
      price,
      quantity: 1,
      image,
      category,
    })

    toast({
      title: language === "en" ? "Added to cart" : "Añadido al carrito",
      description: language === "en" ? `${name} has been added to your cart` : `${name} ha sido añadido a tu carrito`,
    })
  }

  const showProductStats = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click event

    // Get current product stats from localStorage
    const storedStats = localStorage.getItem("product_stats")
    const stats = storedStats ? JSON.parse(storedStats) : {}

    // Get or initialize stats for this product
    if (!stats[id]) {
      stats[id] = { views: 0, selections: 0 }
    }

    // Increment views count for this product
    stats[id].views = (stats[id].views || 0) + 1

    // Save updated stats to localStorage
    localStorage.setItem("product_stats", JSON.stringify(stats))

    // Show toast with product statistics
    toast({
      title: language === "en" ? "Product Statistics" : "Estadísticas del Producto",
      description:
        language === "en"
          ? `${name} has been viewed ${stats[id].views} times and selected ${stats[id].selections || 0} times.`
          : `${name} ha sido visto ${stats[id].views} veces y seleccionado ${stats[id].selections || 0} veces.`,
    })
  }

  const handleZoomClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click event
    setShowZoom(true)
  }

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-200 ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="object-cover transition-transform group-hover:scale-105 z-10"
        />
        {isNew && (
          <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground">
            {language === "en" ? "New" : "Nuevo"}
          </Badge>
        )}
        {isBestseller && (
          <Badge className="absolute left-2 top-2 bg-secondary text-secondary-foreground">
            {language === "en" ? "Bestseller" : "Más Vendido"}
          </Badge>
        )}

        {/* Quick action buttons */}
        <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transform translate-x-full transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
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
            onClick={showProductStats}
          >
            <BarChart2 className="h-4 w-4" />
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
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{category}</div>
        <h3 className="font-semibold text-lg mt-1 line-clamp-1">{name}</h3>
        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{description}</p>
        <div className="mt-2 font-bold text-lg">${price.toFixed(2)}</div>
      </CardContent>
      {showZoom && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            e.stopPropagation()
            setShowZoom(false)
          }}
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
              src={image || "/placeholder.svg"}
              alt={name}
              width={800}
              height={800}
              className="object-contain max-h-[80vh]"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-white">
              <h3 className="font-bold text-xl">{name}</h3>
              <p className="text-sm opacity-90">{description}</p>
              <p className="text-lg font-bold mt-2">${price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
