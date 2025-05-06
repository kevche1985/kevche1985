"use client"

import { useContext, useState, useCallback } from "react"
import { LanguageContext } from "@/context/language-context"
import { ProductCustomizer } from "@/components/product-customizer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, Heart, ShoppingCart, Check, MapPin, Truck, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useCart } from "@/context/cart-context"
import { useProducts } from "@/context/product-context"
import Image from "next/image"

export default function ProductDetailPage({
  params,
}: {
  params: { category: string; product: string }
}) {
  const { language } = useContext(LanguageContext) || { language: "es", t: {} }
  const { toast } = useToast()
  const { addItem } = useCart()
  const { getProductById } = useProducts()
  const [customization, setCustomization] = useState({
    text: "",
    color: "#000000",
  })
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Get the product from the context
  const productData = getProductById(params.product)

  // Use the product data or fallback to a default product
  const product = productData || {
    id: params.product,
    name: language === "en" ? "Product Not Found" : "Producto No Encontrado",
    description:
      language === "en"
        ? "The requested product could not be found."
        : "El producto solicitado no pudo ser encontrado.",
    price: 0,
    image: "/placeholder.svg?height=400&width=400",
    category: language === "en" ? "Unknown" : "Desconocido",
    rating: 0,
    reviews: 0,
    details: language === "en" ? "No details available." : "No hay detalles disponibles.",
    shipping: language === "en" ? "No shipping information available." : "No hay información de envío disponible.",
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
          href={`/products`}
          className="flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t.backToProducts}
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <Image src={product.image || "/placeholder.svg"} alt={product.name} width={300} height={300} />
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
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
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
            <h3>{language === "en" ? "Product Description" : "Descripción del Producto"}</h3>
            <p className="text-lg font-medium mb-4">{product.description}</p>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4>{language === "en" ? "Features" : "Características"}</h4>
                <ul className="mt-2">
                  <li>{language === "en" ? "High-quality materials" : "Materiales de alta calidad"}</li>
                  <li>{language === "en" ? "Durable construction" : "Construcción duradera"}</li>
                  <li>{language === "en" ? "Custom printing options" : "Opciones de impresión personalizadas"}</li>
                  <li>{language === "en" ? "Multiple color options" : "Múltiples opciones de color"}</li>
                </ul>
              </div>

              <div>
                <h4>{language === "en" ? "Specifications" : "Especificaciones"}</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-medium">{language === "en" ? "Material" : "Material"}</span>
                    <span>{language === "en" ? "Premium quality" : "Calidad premium"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-medium">{language === "en" ? "Dimensions" : "Dimensiones"}</span>
                    <span>{language === "en" ? "Standard size" : "Tamaño estándar"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-medium">{language === "en" ? "Weight" : "Peso"}</span>
                    <span>{language === "en" ? "Lightweight" : "Ligero"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-medium">{language === "en" ? "Care" : "Cuidado"}</span>
                    <span>{language === "en" ? "Easy to clean" : "Fácil de limpiar"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4>{language === "en" ? "Additional Information" : "Información Adicional"}</h4>
              <p>{product.details}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shipping">
          <div className="prose dark:prose-invert max-w-none">
            <h3>{language === "en" ? "Shipping Options" : "Opciones de Envío"}</h3>
            <div className="space-y-4 mt-4">
              <div className="flex items-center p-3 border rounded">
                <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{language === "en" ? "Pickup" : "Recoger en Tienda"}</div>
                  <div className="text-sm text-muted-foreground">$0.00</div>
                </div>
              </div>

              <div className="flex items-center p-3 border rounded">
                <Truck className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{language === "en" ? "Urgent Delivery" : "Entrega Urgente"}</div>
                  <div className="text-sm text-muted-foreground">
                    <Clock className="inline mr-1" size={14} />
                    {language === "en" ? "2-5 hours" : "2-5 horas"} - $10.00
                  </div>
                </div>
              </div>

              <div className="flex items-center p-3 border rounded">
                <Truck className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{language === "en" ? "Priority Delivery" : "Entrega Prioritaria"}</div>
                  <div className="text-sm text-muted-foreground">
                    <Clock className="inline mr-1" size={14} />
                    {language === "en" ? "5-7 hours" : "5-7 horas"} - $5.00
                  </div>
                </div>
              </div>

              <div className="flex items-center p-3 border rounded">
                <Truck className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{language === "en" ? "Regular Delivery" : "Entrega Regular"}</div>
                  <div className="text-sm text-muted-foreground">
                    <Clock className="inline mr-1" size={14} />
                    {language === "en" ? "48 hours" : "48 horas"} - $3.00
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                {language === "en"
                  ? "Note: Delivery is only available within the San Salvador metropolitan area."
                  : "Nota: La entrega solo está disponible dentro del área metropolitana de San Salvador."}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
