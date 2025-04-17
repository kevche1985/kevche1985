"use client"

import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { JourneyRoadmap } from "@/components/journey-roadmap"
import { CategoryShowcase } from "@/components/category-showcase"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function GetStartedPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }

  const content = {
    en: {
      title: "Welcome to PrintOnDemand",
      subtitle: "Your journey to custom printing starts here",
      description:
        "Explore our platform to discover all the features and services we offer. Follow the roadmap below to learn about each section and get started with your printing projects.",
      backToHome: "Back to Home",
    },
    es: {
      title: "Bienvenido a PrintOnDemand",
      subtitle: "Tu viaje de impresión personalizada comienza aquí",
      description:
        "Explora nuestra plataforma para descubrir todas las características y servicios que ofrecemos. Sigue la hoja de ruta a continuación para conocer cada sección y comenzar con tus proyectos de impresión.",
      backToHome: "Volver al Inicio",
    },
  }

  const t = language === "en" ? content.en : content.es

  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.backToHome}
        </Link>
      </div>

      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <h2 className="text-2xl font-medium mb-4 gradient-text">{t.subtitle}</h2>
        <p className="text-muted-foreground text-lg">{t.description}</p>
      </div>

      <div className="bg-brand-dark py-12 px-4 rounded-xl">
        <JourneyRoadmap />
      </div>

      <CategoryShowcase />
    </div>
  )
}
