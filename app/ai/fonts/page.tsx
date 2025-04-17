"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import Link from "next/link"

export default function FontGenerator() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const { addToCart } = useCart()

  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [style, setStyle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fontRecommendations, setFontRecommendations] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("form")
  const [addedToCart, setAddedToCart] = useState(false)

  const t = {
    title: language === "en" ? "Font Recommender" : "Recomendador de Fuentes",
    subtitle:
      language === "en"
        ? "Get AI-powered font recommendations for your project"
        : "Obtenga recomendaciones de fuentes potenciadas por IA para su proyecto",
    generateTitle: language === "en" ? "Generate Your Custom Font" : "Genere Su Fuente Personalizada",
    generateDesc:
      language === "en"
        ? "Please provide the following details to create a unique font for your project:"
        : "Por favor proporcione los siguientes detalles para crear una fuente única para su proyecto:",
    projectName: language === "en" ? "Project Name" : "Nombre del Proyecto",
    projectNamePlaceholder: language === "en" ? "My Brand" : "Mi Marca",
    description: language === "en" ? "Description" : "Descripción",
    descriptionPlaceholder:
      language === "en"
        ? "Modern, sleek font for a tech startup"
        : "Fuente moderna y elegante para una startup tecnológica",
    style: language === "en" ? "Style" : "Estilo",
    generate: language === "en" ? "Generate Recommendations" : "Generar Recomendaciones",
    generating: language === "en" ? "Generating..." : "Generando...",
    recommendations: language === "en" ? "Recommendations" : "Recomendaciones",
    form: language === "en" ? "Font Details" : "Detalles de Fuente",
    addToCart: language === "en" ? "Add to Cart" : "Añadir al Carrito",
    viewCart: language === "en" ? "View Cart" : "Ver Carrito",
    errorTitle: language === "en" ? "Error" : "Error",
    errorMessage: language === "en" ? "Please fill in all fields" : "Por favor complete todos los campos",
    successTitle: language === "en" ? "Success" : "Éxito",
    successMessage:
      language === "en" ? "Font recommendations added to cart" : "Recomendaciones de fuentes añadidas al carrito",
    noRecommendations:
      language === "en"
        ? "No recommendations yet. Fill out the form and click Generate."
        : "Aún no hay recomendaciones. Complete el formulario y haga clic en Generar.",
    checkoutInfo:
      language === "en"
        ? "Images will be available for download after checkout is completed."
        : "Las imágenes estarán disponibles para descargar después de completar el pago.",
  }

  const styleOptions = [
    { value: "serif", label: language === "en" ? "Serif" : "Serif" },
    { value: "sans-serif", label: language === "en" ? "Sans-serif" : "Sans-serif" },
    { value: "handwritten", label: language === "en" ? "Handwritten" : "Manuscrita" },
    { value: "bold", label: language === "en" ? "Bold" : "Negrita" },
    { value: "elegant", label: language === "en" ? "Elegant" : "Elegante" },
    { value: "playful", label: language === "en" ? "Playful" : "Juguetona" },
    { value: "vintage", label: language === "en" ? "Vintage" : "Vintage" },
    { value: "futuristic", label: language === "en" ? "Futuristic" : "Futurista" },
  ]

  const handleGenerateRecommendations = async () => {
    if (!projectName || !description || !style) {
      toast({
        title: t.errorTitle,
        description: t.errorMessage,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // For demonstration, we'll use mock data instead of an actual API call
      // In a real implementation, you would call your API endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockRecommendations = [
        {
          name: "Moderna Sans",
          description: "A clean, modern sans-serif font with balanced proportions and excellent readability.",
          pairsWith: "Serif fonts like Georgia or Playfair Display for headings.",
          bestUsedFor: "Body text, UI elements, and digital interfaces.",
        },
        {
          name: "TechSerif Pro",
          description: "A contemporary serif with technological influences, featuring precise geometric forms.",
          pairsWith: "Sans-serif fonts like Roboto or Open Sans for body text.",
          bestUsedFor: "Headlines, logos, and brand identity elements.",
        },
        {
          name: "Innovate Display",
          description: "A distinctive display font with unique character forms that convey innovation and creativity.",
          pairsWith: "Neutral sans-serif fonts for supporting text.",
          bestUsedFor: "Large headlines, feature text, and attention-grabbing elements.",
        },
      ]

      setFontRecommendations(mockRecommendations)
      setActiveTab("recommendations")
    } catch (error) {
      console.error("Error generating font recommendations:", error)
      toast({
        title: t.errorTitle,
        description:
          language === "en"
            ? "Error generating font recommendations. Please try again."
            : "Error al generar recomendaciones de fuentes. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (fontRecommendations.length === 0) {
      toast({
        title: t.errorTitle,
        description:
          language === "en"
            ? "No font recommendations to add to cart"
            : "No hay recomendaciones de fuentes para añadir al carrito",
        variant: "destructive",
      })
      return
    }

    const fontRecommendationsText = fontRecommendations.map((font) => `${font.name}: ${font.description}`).join("\n\n")

    addToCart({
      id: `font-${Date.now()}`,
      name: `${t.title}: ${projectName}`,
      description: description,
      price: 14.99,
      quantity: 1,
      image: "/typographic-harmony.png",
      options: {
        projectName,
        style,
        fontRecommendations: fontRecommendationsText,
      },
      type: "ai-font",
    })

    setAddedToCart(true)
    toast({
      title: t.successTitle,
      description: t.successMessage,
    })
  }

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{t.generateTitle}</CardTitle>
          <CardDescription>{t.generateDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form">{t.form}</TabsTrigger>
              <TabsTrigger value="recommendations">{t.recommendations}</TabsTrigger>
            </TabsList>
            <TabsContent value="form" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">{t.projectName}</Label>
                <Input
                  id="projectName"
                  placeholder={t.projectNamePlaceholder}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t.description}</Label>
                <Textarea
                  id="description"
                  placeholder={t.descriptionPlaceholder}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="style">{t.style}</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger id="style">
                    <SelectValue placeholder={t.style} />
                  </SelectTrigger>
                  <SelectContent>
                    {styleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerateRecommendations} disabled={isLoading} className="w-full mt-6">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.generating}
                  </>
                ) : (
                  t.generate
                )}
              </Button>
            </TabsContent>
            <TabsContent value="recommendations" className="pt-4">
              {fontRecommendations.length > 0 ? (
                <div className="space-y-6">
                  {fontRecommendations.map((font, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{font.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>
                          <strong>{language === "en" ? "Description:" : "Descripción:"}</strong> {font.description}
                        </p>
                        <p>
                          <strong>{language === "en" ? "Pairs well with:" : "Combina bien con:"}</strong>{" "}
                          {font.pairsWith}
                        </p>
                        <p>
                          <strong>{language === "en" ? "Best used for:" : "Mejor usado para:"}</strong>{" "}
                          {font.bestUsedFor}
                        </p>
                      </CardContent>
                    </Card>
                  ))}

                  {addedToCart ? (
                    <Link href="/cart">
                      <Button className="w-full mt-6">{t.viewCart}</Button>
                    </Link>
                  ) : (
                    <Button onClick={handleAddToCart} className="w-full mt-6 bg-red-600 hover:bg-red-700">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {t.addToCart}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">{t.noRecommendations}</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
