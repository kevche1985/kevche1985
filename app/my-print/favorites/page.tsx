"use client"

import { useContext, useEffect, useState } from "react"
import { LanguageContext } from "@/context/language-context"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"

interface FavoriteItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export default function MyFavoritesPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const { addItem } = useCart()
  const { toast } = useToast()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])

  const content = {
    en: {
      title: "My Favorites",
      subtitle: "Products and designs you've saved",
      noFavorites: "You don't have any favorites yet.",
      browse: "Browse Products",
      actions: {
        addToCart: "Add to Cart",
        remove: "Remove",
      },
    },
    es: {
      title: "Mis Favoritos",
      subtitle: "Productos y diseños que has guardado",
      noFavorites: "Aún no tienes favoritos.",
      browse: "Explorar Productos",
      actions: {
        addToCart: "Añadir al Carrito",
        remove: "Eliminar",
      },
    },
  }

  const t = language === "en" ? content.en : content.es

  useEffect(() => {
    // Load favorites from localStorage
    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem("favorites")
      if (storedFavorites) {
        try {
          const parsedFavorites = JSON.parse(storedFavorites)
          setFavorites(parsedFavorites)
        } catch (error) {
          console.error("Error parsing favorites:", error)
          setFavorites([])
        }
      }
    }

    loadFavorites()

    // Add event listener to update favorites if they change in another tab/component
    window.addEventListener("storage", loadFavorites)

    return () => {
      window.removeEventListener("storage", loadFavorites)
    }
  }, [])

  const handleAddToCart = (item: FavoriteItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      category: item.category,
    })

    toast({
      title: language === "en" ? "Added to cart" : "Añadido al carrito",
      description:
        language === "en" ? `${item.name} has been added to your cart` : `${item.name} ha sido añadido a tu carrito`,
    })
  }

  const handleRemoveFavorite = (itemId: string, itemName: string) => {
    // Remove from state
    const updatedFavorites = favorites.filter((item) => item.id !== itemId)
    setFavorites(updatedFavorites)

    // Update localStorage
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))

    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"))

    toast({
      title: language === "en" ? "Removed from favorites" : "Eliminado de favoritos",
      description:
        language === "en"
          ? `${itemName} has been removed from your favorites`
          : `${itemName} ha sido eliminado de tus favoritos`,
    })
  }

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground mb-8">{t.subtitle}</p>

        {favorites.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <p className="mb-4">{t.noFavorites}</p>
              <Link href="/products">
                <Button>{t.browse}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 text-primary hover:bg-background/90"
                    onClick={() => handleRemoveFavorite(item.id, item.name)}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
                <CardContent className="pt-4">
                  <Link href={`/products/${item.category.toLowerCase()}/${item.id}`}>
                    <h3 className="font-medium hover:text-primary transition-colors">{item.name}</h3>
                  </Link>
                  <p className="font-bold mt-1">${item.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button size="sm" onClick={() => handleAddToCart(item)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {t.actions.addToCart}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground"
                    onClick={() => handleRemoveFavorite(item.id, item.name)}
                  >
                    {t.actions.remove}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
