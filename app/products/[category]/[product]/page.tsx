"use client"

import { useContext, useState, useCallback } from "react"
import { LanguageContext } from "@/context/language-context"
import { ProductCustomizer } from "@/components/product-customizer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, Heart, ShoppingCart, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useCart } from "@/context/cart-context"

export default function ProductDetailPage({
  params,
}: {
  params: { category: string; product: string }
}) {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const { toast } = useToast()
  const { addItem } = useCart()
  const [customization, setCustomization] = useState({
    text: "",
    color: "#000000",
  })
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // In a real app, you would fetch this data from an API based on the params
  const product = {
    id: params.product,
    name: language === "en" ? "Custom T-Shirt" : "Camiseta Personalizada",
    description:
      language === "en"
        ? "High-quality cotton t-shirt with your custom design. Perfect for events, promotions, or personal use."
        : "Camiseta de algodón de alta calidad con tu diseño personalizado. Perfecta para eventos, promociones o uso personal.",
    price: 24.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-tshirt-hero.jpg-REJerWrLTRG2rHVGLd8TRvYF5UEPbA.jpeg",
    category: language === "en" ? "Apparel" : "Ropa",
    rating: 4.8,
    reviews: 124,
    details:
      language === "en"
        ? "100% cotton, pre-shrunk, available in multiple colors and sizes. Machine washable."
        : "100% algodón, pre-encogido, disponible en múltiples colores y tallas. Lavable a máquina.",
    shipping:
      language === "en"
        ? "Free shipping on orders over $50. Standard delivery in 3-5 business days."
        : "Envío gratis en pedidos superiores a $50. Entrega estándar en 3-5 días hábiles.",
  }

  const content = {
    en: {
      backToProducts: "Back to Products",
      customize: "Customize",
      details: "Details",
      shipping: "Shipping",
      reviews: "Reviews",
      reviewsCount: "reviews",
      addToCart: "Add to Cart",
      addingToCart: "Adding...",
      addToFavorites: "Add to Favorites",
      removeFromFavorites: "Remove from Favorites",
      confirmDesign: "Confirm Design",
      designConfirmed: "Design Confirmed",
    },
    es: {
      backToProducts: "Volver a Productos",
      customize: "Personalizar",
      details: "Detalles",
      shipping: "Envío",
      reviews: "Reseñas",
      reviewsCount: "reseñas",
      addToCart: "Añadir al Carrito",
      addingToCart: "Añadiendo...",
      addToFavorites: "Añadir a Favoritos",
      removeFromFavorites: "Quitar de Favoritos",
      confirmDesign: "Confirmar Diseño",
      designConfirmed: "Diseño Confirmado",
    },
  }

  const t = language === "en" ? content.en : content.es

  const handleAddToCart = () => {
    setIsAddingToCart(true)

    // Simulate API call or processing time
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        category: product.category,
        customization: customization,
      })

      toast({
        title: language === "en" ? "Added to cart" : "Añadido al carrito",
        description:
          language === "en" ? "Your item has been added to the cart" : "Tu artículo ha sido añadido al carrito",
      })

      setIsAddingToCart(false)
    }, 1000)
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)

    toast({
      title: !isFavorite
        ? language === "en"
          ? "Added to favorites"
          : "Añadido a favoritos"
        : language === "en"
          ? "Removed from favorites"
          : "Eliminado de favoritos",
      description: !isFavorite
        ? language === "en"
          ? "Your item has been added to favorites"
          : "Tu artículo ha sido añadido a favoritos"
        : language === "en"
          ? "Your item has been removed from favorites"
          : "Tu artículo ha sido eliminado de favoritos",
    })
  }

  const handleConfirmDesign = () => {
    toast({
      title: language === "en" ? "Design confirmed" : "Diseño confirmado",
      description: language === "en" ? "Your design has been saved" : "Tu diseño ha sido guardado",
    })
  }

  const handleCustomizationChange = useCallback((newCustomization: any) => {
    setCustomization((prev) => ({ ...prev, ...newCustomization }))
  }, [])

  return (
    <div className="container py-12">
      <div className="mb-6">
        <Link
          href={`/products/${params.category}`}
          className="flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t.backToProducts}
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.reviews} {t.reviewsCount})
          </span>
        </div>
      </div>

      <Tabs defaultValue="customize" className="w-full mb-8">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
          <TabsTrigger value="customize">{t.customize}</TabsTrigger>
          <TabsTrigger value="details">{t.details}</TabsTrigger>
          <TabsTrigger value="shipping">{t.shipping}</TabsTrigger>
        </TabsList>

        <TabsContent value="customize">
          <ProductCustomizer
            productImage={product.image}
            productName={product.name}
            productDescription={product.description}
            price={product.price}
            onCustomizationChange={handleCustomizationChange}
          />

          <div className="flex flex-wrap gap-4 mt-8 justify-end">
            <Button variant="outline" onClick={handleConfirmDesign}>
              <Check className="mr-2 h-4 w-4" />
              {t.confirmDesign}
            </Button>

            <Button
              variant={isFavorite ? "default" : "outline"}
              onClick={handleToggleFavorite}
              className={isFavorite ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? t.removeFromFavorites : t.addToFavorites}
            </Button>

            <Button onClick={handleAddToCart} disabled={isAddingToCart}>
              {isAddingToCart ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span> {t.addingToCart}
                </span>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {t.addToCart}
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="prose dark:prose-invert max-w-none">
            <p>{product.details}</p>
          </div>
        </TabsContent>

        <TabsContent value="shipping">
          <div className="prose dark:prose-invert max-w-none">
            <p>{product.shipping}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
