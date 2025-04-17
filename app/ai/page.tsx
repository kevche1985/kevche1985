"use client"

import { useContext } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LanguageContext } from "@/context/language-context"
import { Sparkles, ImageIcon, Type, CalendarIcon, ArrowRight } from "lucide-react"

export default function AIToolsPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }

  const t =
    language === "en"
      ? {
          title: "AI Tools",
          subtitle: "Enhance your print projects with our AI-powered tools",
          logoGenerator: "AI Logo Generator",
          logoDescription: "Create unique logos for your business with our AI-powered logo generator",
          imageGenerator: "AI Image Generator",
          imageDescription: "Generate custom images for your print projects with our AI-powered image generator",
          fontGenerator: "AI Font Suggestions",
          fontDescription: "Get font recommendations based on your project's style and tone",
          eventSuggestor: "Event Product Suggestor",
          eventDescription: "Get personalized product recommendations for your upcoming events",
          tryIt: "Try It",
          comingSoon: "Coming Soon",
          inDevelopment: "This feature is currently in development and will be available soon.",
        }
      : {
          title: "Herramientas de IA",
          subtitle: "Mejora tus proyectos de impresión con nuestras herramientas potenciadas por IA",
          logoGenerator: "Generador de Logos IA",
          logoDescription: "Crea logos únicos para tu negocio con nuestro generador de logos potenciado por IA",
          imageGenerator: "Generador de Imágenes IA",
          imageDescription:
            "Genera imágenes personalizadas para tus proyectos de impresión con nuestro generador de imágenes IA",
          fontGenerator: "Sugerencias de Fuentes IA",
          fontDescription: "Obtén recomendaciones de fuentes basadas en el estilo y tono de tu proyecto",
          eventSuggestor: "Sugeridor de Productos para Eventos",
          eventDescription: "Obtén recomendaciones personalizadas de productos para tus próximos eventos",
          tryIt: "Probar",
          comingSoon: "Próximamente",
          inDevelopment: "Esta función está actualmente en desarrollo y estará disponible pronto.",
        }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {t.logoGenerator}
            </CardTitle>
            <CardDescription>{t.logoDescription}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-video bg-muted/20 flex items-center justify-center">
              <img src="/fluid-connection.png" alt="AI Logo Generator" className="h-full w-full object-cover" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center p-4">
            <Button asChild>
              <Link href="/ai/logo" className="flex items-center gap-2">
                {t.tryIt}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              {t.imageGenerator}
            </CardTitle>
            <CardDescription>{t.imageDescription}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-video bg-muted/20 flex items-center justify-center">
              <img src="/chromatic-explosion.png" alt="AI Image Generator" className="h-full w-full object-cover" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center p-4">
            <Button asChild>
              <Link href="/ai/image-generator" className="flex items-center gap-2">
                {t.tryIt}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5 text-primary" />
              {t.fontGenerator}
            </CardTitle>
            <CardDescription>{t.fontDescription}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-video bg-muted/20 flex items-center justify-center">
              <img
                src="/typographic-exploration.png"
                alt="AI Font Suggestions"
                className="h-full w-full object-cover"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center p-4">
            <Button asChild>
              <Link href="/ai/fonts" className="flex items-center gap-2">
                {t.tryIt}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden relative">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <Badge variant="outline" className="mb-2 text-lg font-semibold border-2">
              {t.comingSoon}
            </Badge>
            <p className="text-center px-6 text-muted-foreground">{t.inDevelopment}</p>
          </div>
          <CardHeader className="bg-primary/5 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                {t.eventSuggestor}
              </CardTitle>
              <Badge variant="outline">{t.comingSoon}</Badge>
            </div>
            <CardDescription>{t.eventDescription}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-video bg-muted/20 flex items-center justify-center">
              <img
                src="/event-planning-essentials.png"
                alt="Event Product Suggestor"
                className="h-full w-full object-cover opacity-50"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center p-4">
            <Button disabled className="opacity-70">
              {t.comingSoon}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
