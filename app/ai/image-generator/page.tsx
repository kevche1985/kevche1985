"use client"

import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { LanguageContext } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"

export default function ImageGeneratorPage() {
  const router = useRouter()
  const { language } = useContext(LanguageContext) || { language: "es" }
  const { addItem } = useCart()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("realistic")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isExternalUrl, setIsExternalUrl] = useState(false)

  const content = {
    en: {
      title: "AI Image Generator",
      description: "Create custom images for your projects using AI",
      promptLabel: "Describe the image you want",
      promptPlaceholder: "A serene mountain landscape with a lake at sunset...",
      styleLabel: "Style",
      generateButton: "Generate Image",
      addToCartButton: "Add to Cart",
      addingToCartButton: "Adding to Cart...",
      viewCartButton: "View Cart",
      tryAgainButton: "Try Again",
      errorTitle: "Error",
      loadingMessage: "Generating your image...",
      successMessage: "Image generated successfully!",
      addedToCartMessage: "Image added to cart!",
      styles: [
        { value: "realistic", label: "Realistic" },
        { value: "vivid", label: "Vivid" },
        { value: "minimalist", label: "Minimalist" },
        { value: "abstract", label: "Abstract" },
        { value: "3d", label: "3D Render" },
        { value: "sketch", label: "Sketch" },
      ],
      imageDetails: "Image Details",
      provideDetails: "Describe the image you want to generate",
      preview: "Preview",
      previewDescription: "Your generated image will appear here",
      fillDetails: "Fill in the details and click 'Generate Image' to create your image",
      demoMode: "Using Demo Mode",
      demoDescription: "We're showing you a preview image. In production, a real AI-generated image would be created.",
      addToCartError: "Failed to add image to cart. Please try again.",
    },
    es: {
      title: "Generador de Imágenes con IA",
      description: "Crea imágenes personalizadas para tus proyectos usando IA",
      promptLabel: "Describe la imagen que deseas",
      promptPlaceholder: "Un paisaje sereno de montaña con un lago al atardecer...",
      styleLabel: "Estilo",
      generateButton: "Generar Imagen",
      addToCartButton: "Añadir al Carrito",
      addingToCartButton: "Añadiendo al Carrito...",
      viewCartButton: "Ver Carrito",
      tryAgainButton: "Intentar de Nuevo",
      errorTitle: "Error",
      loadingMessage: "Generando tu imagen...",
      successMessage: "¡Imagen generada exitosamente!",
      addedToCartMessage: "¡Imagen añadida al carrito!",
      styles: [
        { value: "realistic", label: "Realista" },
        { value: "vivid", label: "Vívido" },
        { value: "minimalist", label: "Minimalista" },
        { value: "abstract", label: "Abstracto" },
        { value: "3d", label: "Render 3D" },
        { value: "sketch", label: "Boceto" },
      ],
      imageDetails: "Detalles de la Imagen",
      provideDetails: "Describe la imagen que quieres generar",
      preview: "Vista Previa",
      previewDescription: "Tu imagen generada aparecerá aquí",
      fillDetails: "Completa los detalles y haz clic en 'Generar Imagen' para crear tu imagen",
      demoMode: "Usando Modo de Demostración",
      demoDescription:
        "Te estamos mostrando una imagen de vista previa. En producción, se crearía una imagen generada por IA real.",
      addToCartError: "Error al añadir la imagen al carrito. Por favor intenta de nuevo.",
    },
  }

  const t = language === "en" ? content.en : content.es

  const handleGenerateImage = async () => {
    if (!prompt) {
      toast({
        title: t.errorTitle,
        description: language === "en" ? "Please enter a description" : "Por favor ingresa una descripción",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setError(null)
    setImageUrl(null)
    setIsExternalUrl(false)

    try {
      console.log("Sending request to generate image API")
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style,
          useAI: true,
        }),
      })

      console.log("Response received:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image")
      }

      if (data.imageUrl) {
        setImageUrl(data.imageUrl)
        // Check if the URL is external (starts with http or https)
        setIsExternalUrl(data.imageUrl.startsWith("http") && !data.imageUrl.startsWith(window.location.origin))

        toast({
          title: t.successMessage,
          description:
            language === "en"
              ? "Your AI-generated image is ready to add to cart"
              : "Tu imagen generada por IA está lista para añadir al carrito",
        })
      } else {
        throw new Error("No image URL returned")
      }
    } catch (err) {
      console.error("Error generating image:", err)
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
    if (!imageUrl || !prompt) return

    setAddingToCart(true)

    try {
      // Add the image to the cart
      addItem({
        id: `ai-image-${Date.now()}`,
        name: `AI Image: ${prompt.substring(0, 30)}${prompt.length > 30 ? "..." : ""}`,
        price: 19.99, // Set your price for AI-generated images
        quantity: 1,
        image: imageUrl,
        category: "AI Services",
        customization: {
          text: prompt,
          design: `${style} style`,
          aiGenerated: true,
          originalUrl: imageUrl,
        },
      })

      toast({
        title: t.addedToCartMessage,
        description:
          language === "en"
            ? "Your image has been added to the cart. You can download it after checkout."
            : "Tu imagen ha sido añadida al carrito. Puedes descargarla después de completar la compra.",
      })

      // Optional: Redirect to cart
      // router.push('/cart');
    } catch (err) {
      console.error("Error adding image to cart:", err)
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
              <CardTitle>{t.imageDetails}</CardTitle>
              <CardDescription>{t.provideDetails}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">{t.promptLabel}</Label>
                <Textarea
                  id="prompt"
                  placeholder={t.promptPlaceholder}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
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
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleGenerateImage} disabled={loading}>
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
                  <Button onClick={handleGenerateImage} variant="outline">
                    {t.tryAgainButton}
                  </Button>
                </div>
              ) : imageUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt="Generated Image"
                    width={400}
                    height={400}
                    className="max-w-full max-h-[400px] object-contain rounded-md"
                    priority
                    unoptimized={isExternalUrl}
                  />
                </div>
              ) : (
                <div className="text-center text-muted-foreground">{t.fillDetails}</div>
              )}
            </CardContent>
            {imageUrl && (
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
