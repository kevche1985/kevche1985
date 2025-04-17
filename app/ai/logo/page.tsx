"use client"

import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { LanguageContext } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"

export default function LogoGeneratorPage() {
  const router = useRouter()
  // Get language from context, default to Spanish if not available
  const languageContext = useContext(LanguageContext)
  const currentLanguage = languageContext ? languageContext.language : "es"
  const { addItem } = useCart()

  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState("")
  const [industry, setIndustry] = useState("")
  const [style, setStyle] = useState("modern")
  const [colors, setColors] = useState("")
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [isExternalUrl, setIsExternalUrl] = useState(false)
  const [slogan, setSlogan] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")

  // Define content for both languages
  const translations = {
    en: {
      title: "AI Logo Generator",
      description: "Create a professional logo for your business using AI",
      businessNameLabel: "Business Name",
      businessNamePlaceholder: "Enter your business name",
      industryLabel: "Industry",
      industryPlaceholder: "Select your industry",
      styleLabel: "Style",
      colorsLabel: "Colors",
      colorsPlaceholder: "e.g., blue and gold, earthy tones, etc.",
      generateButton: "Generate Logo",
      addToCartButton: "Add to Cart",
      addingToCartButton: "Adding to Cart...",
      viewCartButton: "View Cart",
      tryAgainButton: "Try Again",
      errorTitle: "Error",
      loadingMessage: "Generating your logo...",
      successMessage: "Logo generated successfully!",
      addedToCartMessage: "Logo added to cart!",
      industries: [
        "Technology",
        "Food & Restaurant",
        "Health & Wellness",
        "Education",
        "Finance",
        "Real Estate",
        "Retail",
        "Entertainment",
        "Travel",
        "Construction",
        "Manufacturing",
        "Professional Services",
        "Other",
      ],
      styles: [
        { value: "modern", label: "Modern" },
        { value: "minimalist", label: "Minimalist" },
        { value: "vintage", label: "Vintage" },
        { value: "playful", label: "Playful" },
        { value: "luxury", label: "Luxury" },
        { value: "tech", label: "Tech" },
        { value: "handcrafted", label: "Handcrafted" },
        { value: "futuristic", label: "Futuristic" },
      ],
      logoDetails: "Logo Details",
      provideDetails: "Provide details about your business to generate a logo",
      preview: "Preview",
      previewDescription: "Your generated logo will appear here",
      fillDetails: "Fill in the details and click 'Generate Logo' to create your logo",
      demoMode: "Using Demo Mode",
      demoDescription: "We're showing you a preview logo. In production, a real AI-generated logo would be created.",
      addToCartError: "Failed to add logo to cart. Please try again.",
      sloganLabel: "Slogan",
      sloganPlaceholder: "Enter your company slogan",
      additionalInfoLabel: "Additional Information",
      additionalInfoPlaceholder: "Any specific elements or themes you'd like to include",
    },
    es: {
      title: "Generador de Logos con IA",
      description: "Crea un logo profesional para tu negocio usando IA",
      businessNameLabel: "Nombre del Negocio",
      businessNamePlaceholder: "Ingresa el nombre de tu negocio",
      industryLabel: "Industria",
      industryPlaceholder: "Selecciona tu industria",
      styleLabel: "Estilo",
      colorsLabel: "Colores",
      colorsPlaceholder: "ej., azul y dorado, tonos tierra, etc.",
      generateButton: "Generar Logo",
      addToCartButton: "Añadir al Carrito",
      addingToCartButton: "Añadiendo al Carrito...",
      viewCartButton: "Ver Carrito",
      tryAgainButton: "Intentar de Nuevo",
      errorTitle: "Error",
      loadingMessage: "Generando tu logo...",
      successMessage: "¡Logo generado exitosamente!",
      addedToCartMessage: "¡Logo añadido al carrito!",
      industries: [
        "Tecnología",
        "Alimentos y Restaurantes",
        "Salud y Bienestar",
        "Educación",
        "Finanzas",
        "Bienes Raíces",
        "Comercio Minorista",
        "Entretenimiento",
        "Viajes",
        "Construcción",
        "Manufactura",
        "Servicios Profesionales",
        "Otro",
      ],
      styles: [
        { value: "modern", label: "Moderno" },
        { value: "minimalist", label: "Minimalista" },
        { value: "vintage", label: "Vintage" },
        { value: "playful", label: "Juguetón" },
        { value: "luxury", label: "Lujo" },
        { value: "tech", label: "Tecnológico" },
        { value: "handcrafted", label: "Artesanal" },
        { value: "futuristic", label: "Futurista" },
      ],
      logoDetails: "Detalles del Logo",
      provideDetails: "Proporciona detalles sobre tu negocio para generar un logo",
      preview: "Vista Previa",
      previewDescription: "Tu logo generado aparecerá aquí",
      fillDetails: "Completa los detalles y haz clic en 'Generar Logo' para crear tu logo",
      demoMode: "Usando Modo de Demostración",
      demoDescription:
        "Te estamos mostrando un logo de vista previa. En producción, se crearía un logo generado por IA real.",
      addToCartError: "Error al añadir el logo al carrito. Por favor intenta de nuevo.",
      sloganLabel: "Eslogan",
      sloganPlaceholder: "Ingresa el eslogan de tu empresa",
      additionalInfoLabel: "Información Adicional",
      additionalInfoPlaceholder: "Elementos o temas específicos que te gustaría incluir",
    },
  }

  // Get the appropriate translations based on the current language
  const t = translations[currentLanguage as keyof typeof translations]

  const handleGenerateLogo = async () => {
    if (!businessName) {
      toast({
        title: t.errorTitle,
        description:
          currentLanguage === "en" ? "Please enter a business name" : "Por favor ingresa un nombre de negocio",
        variant: "destructive",
      })
      return
    }

    if (!industry) {
      toast({
        title: t.errorTitle,
        description: currentLanguage === "en" ? "Please select an industry" : "Por favor selecciona una industria",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setError(null)
    setLogoUrl(null)
    setIsExternalUrl(false)

    try {
      console.log("Sending request to generate logo API with DALL-E")
      const response = await fetch("/api/generate-logo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName,
          industry,
          style,
          colors,
          slogan,
          additionalInfo,
          useAI: true, // Explicitly request AI generation
        }),
      })

      console.log("Response received:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate logo")
      }

      if (data.logoUrl) {
        setLogoUrl(data.logoUrl)
        // Check if the URL is external (starts with http or https)
        setIsExternalUrl(data.logoUrl.startsWith("http") && !data.logoUrl.startsWith(window.location.origin))

        toast({
          title: t.successMessage,
          description:
            currentLanguage === "en"
              ? "Your AI-generated logo is ready to add to cart"
              : "Tu logo generado por IA está listo para añadir al carrito",
        })
      } else {
        throw new Error("No logo URL returned")
      }
    } catch (err) {
      console.error("Error generating logo:", err)
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
    if (!logoUrl || !businessName) return

    setAddingToCart(true)

    try {
      // Add the logo to the cart
      addItem({
        id: `ai-logo-${Date.now()}`,
        name: `AI Logo: ${businessName}`,
        price: 29.99, // Set your price for AI-generated logos
        quantity: 1,
        image: logoUrl,
        category: "AI Services",
        customization: {
          text: businessName,
          design: `${style} style for ${industry} industry`,
          aiGenerated: true,
          originalUrl: logoUrl,
        },
      })

      toast({
        title: t.addedToCartMessage,
        description:
          currentLanguage === "en"
            ? "Your logo has been added to the cart. You can download it after checkout."
            : "Tu logo ha sido añadido al carrito. Puedes descargarlo después de completar la compra.",
      })

      // Optional: Redirect to cart
      // router.push('/cart');
    } catch (err) {
      console.error("Error adding logo to cart:", err)
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
              <CardTitle>{t.logoDetails}</CardTitle>
              <CardDescription>{t.provideDetails}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">{t.businessNameLabel}</Label>
                <Input
                  id="businessName"
                  placeholder={t.businessNamePlaceholder}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">{t.industryLabel}</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.industryPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {t.industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">{t.styleLabel}</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {t.styles.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="colors">{t.colorsLabel}</Label>
                <Input
                  id="colors"
                  placeholder={t.colorsPlaceholder}
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slogan">{t.sloganLabel}</Label>
                <Input
                  id="slogan"
                  placeholder={t.sloganPlaceholder}
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">{t.additionalInfoLabel}</Label>
                <Input
                  id="additionalInfo"
                  placeholder={t.additionalInfoPlaceholder}
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleGenerateLogo} disabled={loading}>
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
            <CardContent className="flex items-center justify-center p-6 min-h-[300px] bg-muted/30 rounded-md">
              {loading ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
                  <p>{t.loadingMessage}</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={handleGenerateLogo} variant="outline">
                    {t.tryAgainButton}
                  </Button>
                </div>
              ) : logoUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* For external URLs, use next/image with unoptimized to avoid issues */}
                  <Image
                    src={logoUrl || "/placeholder.svg"}
                    alt="Generated Logo"
                    width={300}
                    height={300}
                    className="max-w-full max-h-[300px] object-contain"
                    priority
                    unoptimized={isExternalUrl}
                  />
                </div>
              ) : (
                <div className="text-center text-muted-foreground">{t.fillDetails}</div>
              )}
            </CardContent>
            {logoUrl && (
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
