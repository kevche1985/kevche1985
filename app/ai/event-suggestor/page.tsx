"use client"

import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ShoppingCart } from "lucide-react"
import { LanguageContext } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"

export default function EventSuggestorPage() {
  const router = useRouter()
  const { language } = useContext(LanguageContext) || { language: "es" }
  const { addItem } = useCart()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [eventType, setEventType] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [budget, setBudget] = useState("medium")
  const [suggestions, setSuggestions] = useState<any[] | null>(null)

  const content = {
    en: {
      title: "AI Event Product Suggestor",
      description: "Get personalized product recommendations for your events",
      eventTypeLabel: "Event Type",
      eventTypePlaceholder: "Enter your event type (e.g., Wedding, Corporate Event)",
      eventDescriptionLabel: "Event Description",
      eventDescriptionPlaceholder: "Describe your event, theme, and requirements...",
      budgetLabel: "Budget Range",
      generateButton: "Get Product Suggestions",
      addToCartButton: "Add to Cart",
      addingToCartButton: "Adding to Cart...",
      viewCartButton: "View Cart",
      tryAgainButton: "Try Again",
      errorTitle: "Error",
      loadingMessage: "Generating product suggestions...",
      successMessage: "Product suggestions generated!",
      addedToCartMessage: "Product suggestions added to cart!",
      budgets: [
        { value: "low", label: "Budget-Friendly" },
        { value: "medium", label: "Mid-Range" },
        { value: "high", label: "Premium" },
      ],
      eventDetails: "Event Details",
      provideDetails: "Describe your event to get product recommendations",
      preview: "Recommendations",
      previewDescription: "Your product recommendations will appear here",
      fillDetails: "Fill in the details and click 'Get Product Suggestions'",
      noSuggestions: "No suggestions yet. Fill in the event details to get started.",
      addToCartError: "Failed to add product suggestions to cart. Please try again.",
      productName: "Product",
      productType: "Type",
      description: "Description",
      estimatedPrice: "Est. Price",
    },
    es: {
      title: "Sugeridor de Productos para Eventos con IA",
      description: "Obtén recomendaciones personalizadas de productos para tus eventos",
      eventTypeLabel: "Tipo de Evento",
      eventTypePlaceholder: "Ingresa el tipo de evento (ej., Boda, Evento Corporativo)",
      eventDescriptionLabel: "Descripción del Evento",
      eventDescriptionPlaceholder: "Describe tu evento, tema y requisitos...",
      budgetLabel: "Rango de Presupuesto",
      generateButton: "Obtener Sugerencias de Productos",
      addToCartButton: "Añadir al Carrito",
      addingToCartButton: "Añadiendo al Carrito...",
      viewCartButton: "Ver Carrito",
      tryAgainButton: "Intentar de Nuevo",
      errorTitle: "Error",
      loadingMessage: "Generando sugerencias de productos...",
      successMessage: "¡Sugerencias de productos generadas!",
      addedToCartMessage: "¡Sugerencias de productos añadidas al carrito!",
      budgets: [
        { value: "low", label: "Económico" },
        { value: "medium", label: "Gama Media" },
        { value: "high", label: "Premium" },
      ],
      eventDetails: "Detalles del Evento",
      provideDetails: "Describe tu evento para obtener recomendaciones de productos",
      preview: "Recomendaciones",
      previewDescription: "Tus recomendaciones de productos aparecerán aquí",
      fillDetails: "Completa los detalles y haz clic en 'Obtener Sugerencias de Productos'",
      noSuggestions: "Aún no hay sugerencias. Completa los detalles del evento para comenzar.",
      addToCartError: "Error al añadir las sugerencias de productos al carrito. Por favor intenta de nuevo.",
      productName: "Producto",
      productType: "Tipo",
      description: "Descripción",
      estimatedPrice: "Precio Est.",
    },
  }

  const t = language === "en" ? content.en : content.es

  const handleGenerateEventSuggestions = async () => {
    if (!eventType) {
      toast({
        title: t.errorTitle,
        description: language === "en" ? "Please enter an event type" : "Por favor ingresa un tipo de evento",
        variant: "destructive",
      })
      return
    }

    if (!eventDescription) {
      toast({
        title: t.errorTitle,
        description:
          language === "en" ? "Please enter an event description" : "Por favor ingresa una descripción del evento",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setError(null)
    setSuggestions(null)

    try {
      console.log("Sending request to generate event suggestions")
      // In a real implementation, you would call your API here
      // For now, we'll simulate a delay and return mock data
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock data for demonstration
      const mockSuggestions = [
        {
          productName: "Custom Printed Banners",
          productType: "Signage",
          description: "High-quality vinyl banners with your event branding and information",
          estimatedPrice: budget === "low" ? "$50-100" : budget === "medium" ? "$100-200" : "$200-400",
        },
        {
          productName: "Personalized Event Programs",
          productType: "Print Materials",
          description: "Professional programs with schedule, information, and custom design",
          estimatedPrice:
            budget === "low" ? "$2-5 per unit" : budget === "medium" ? "$5-10 per unit" : "$10-20 per unit",
        },
        {
          productName: "Custom Name Tags",
          productType: "Identification",
          description: "Professional name tags with logo and attendee information",
          estimatedPrice: budget === "low" ? "$1-2 per unit" : budget === "medium" ? "$2-4 per unit" : "$4-8 per unit",
        },
        {
          productName: "Branded Merchandise",
          productType: "Promotional",
          description: "T-shirts, tote bags, or mugs with your event branding",
          estimatedPrice:
            budget === "low" ? "$8-15 per unit" : budget === "medium" ? "$15-25 per unit" : "$25-50 per unit",
        },
      ]

      setSuggestions(mockSuggestions)

      toast({
        title: t.successMessage,
        description:
          language === "en"
            ? "Your product suggestions are ready to add to cart"
            : "Tus sugerencias de productos están listas para añadir al carrito",
      })
    } catch (err) {
      console.error("Error generating event suggestions:", err)
      setError(err instanceof Error ? err.message : String(err))
      toast({
        title: t.errorTitle,
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!suggestions) return

    setAddingToCart(true)

    try {
      // Create a formatted description of the product suggestions
      const suggestionsText = suggestions
        .map(
          (suggestion) =>
            `${suggestion.productName} (${suggestion.productType}): ${suggestion.description}. Price: ${suggestion.estimatedPrice}`,
        )
        .join("\n\n")

      // Add the product suggestions to the cart
      addItem({
        id: `ai-event-${Date.now()}`,
        name: `Event Suggestions: ${eventType}`,
        price: 24.99, // Set your price for AI-generated event suggestions
        quantity: 1,
        image: "/event-planning-essentials.png",
        category: "AI Services",
        customization: {
          text: eventDescription,
          design: `${budget} budget`,
          aiGenerated: true,
          eventSuggestions: suggestionsText,
        },
      })

      toast({
        title: t.addedToCartMessage,
        description:
          language === "en"
            ? "Your product suggestions have been added to the cart. You can download them after checkout."
            : "Tus sugerencias de productos han sido añadidas al carrito. Puedes descargarlas después de completar la compra.",
      })

      // Optional: Redirect to cart
      // router.push('/cart');
    } catch (err) {
      console.error("Error adding event suggestions to cart:", err)
      toast({
        title: t.errorTitle,
        description: t.addToCartError,
        variant: "destructive",
      })
    } finally {
      setAddingToCart(false)
    }
  }

  const handleViewCart = () => {
    router.push("/cart")
  }

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-xl text-muted-foreground">{t.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t.eventDetails}</CardTitle>
              <CardDescription>{t.provideDetails}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventType">{t.eventTypeLabel}</Label>
                <Input
                  id="eventType"
                  placeholder={t.eventTypePlaceholder}
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventDescription">{t.eventDescriptionLabel}</Label>
                <Textarea
                  id="eventDescription"
                  placeholder={t.eventDescriptionPlaceholder}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">{t.budgetLabel}</Label>
                <Select value={budget} onValueChange={setBudget}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {t.budgets.map((b) => (
                      <SelectItem key={b.value} value={b.value}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleGenerateEventSuggestions} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.loadingMessage}
                  </>
                ) : (
                  t.generateButton
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.preview}</CardTitle>
              <CardDescription>{t.previewDescription}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 min-h-[300px] bg-muted/30 rounded-md">
              {loading ? (
                <div className="flex flex-col items-center justify-center text-center h-full">
                  <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
                  <p>{t.loadingMessage}</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center text-center h-full">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={handleGenerateEventSuggestions} variant="outline">
                    {t.tryAgainButton}
                  </Button>
                </div>
              ) : suggestions ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-2 font-semibold text-sm border-b pb-2 hidden md:grid">
                    <div className="col-span-3">{t.productName}</div>
                    <div className="col-span-2">{t.productType}</div>
                    <div className="col-span-5">{t.description}</div>
                    <div className="col-span-2 text-right">{t.estimatedPrice}</div>
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="bg-white p-4 rounded-md shadow-sm">
                      <div className="md:grid md:grid-cols-12 md:gap-2 space-y-2 md:space-y-0">
                        <div className="md:col-span-3 font-semibold">{suggestion.productName}</div>
                        <div className="md:col-span-2 text-sm text-muted-foreground">{suggestion.productType}</div>
                        <div className="md:col-span-5 text-sm">{suggestion.description}</div>
                        <div className="md:col-span-2 md:text-right font-medium">{suggestion.estimatedPrice}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                  {t.noSuggestions}
                </div>
              )}
            </CardContent>
            {suggestions && (
              <CardFooter>
                <div className="flex flex-col w-full gap-2">
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.addingToCartButton}
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {t.addToCartButton}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleViewCart}>
                    {t.viewCartButton}
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
