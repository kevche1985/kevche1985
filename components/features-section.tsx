"use client"

import { Printer, Truck, Clock, CreditCard, Palette, Users } from "lucide-react"
import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import Link from "next/link"

export default function FeaturesSection() {
  const { language } = useContext(LanguageContext) || { language: "es" }

  const featuresContent = {
    en: {
      tagline: "Why Choose Us",
      title: "Premium Print On Demand",
      titleHighlight: "Features",
      description: "We offer a comprehensive range of services to meet all your printing needs",
      features: [
        {
          icon: <Printer className="h-10 w-10 text-primary" />,
          title: "High-Quality Printing",
          description: "State-of-the-art printing technology for vibrant, long-lasting results on all products.",
        },
        {
          icon: <Truck className="h-10 w-10 text-primary" />,
          title: "Fast Delivery",
          description: "Quick turnaround times with reliable shipping options to meet your deadlines.",
        },
        {
          icon: <Clock className="h-10 w-10 text-primary" />,
          title: "On-Demand Service",
          description: "Print exactly what you need, when you need it, with no minimum order requirements.",
        },
        {
          icon: <CreditCard className="h-10 w-10 text-primary" />,
          title: "Competitive Pricing",
          description: "Affordable rates without compromising on quality, with volume discounts available.",
        },
        {
          icon: <Palette className="h-10 w-10 text-primary" />,
          title: "Custom Designs",
          description: "Upload your own designs or work with our team to create something unique.",
        },
        {
          icon: <Users className="h-10 w-10 text-primary" />,
          title: "Dedicated Support",
          description: "Our customer service team is available to assist you throughout the entire process.",
        },
      ],
    },
    es: {
      tagline: "Por Qué Elegirnos",
      title: "Impresión Bajo Demanda",
      titleHighlight: "Premium",
      description: "Ofrecemos una amplia gama de servicios para satisfacer todas tus necesidades de impresión",
      features: [
        {
          icon: <Printer className="h-10 w-10 text-primary" />,
          title: "Impresión de Alta Calidad",
          description:
            "Tecnología de impresión de vanguardia para resultados vibrantes y duraderos en todos los productos.",
        },
        {
          icon: <Truck className="h-10 w-10 text-primary" />,
          title: "Entrega Rápida",
          description: "Tiempos de entrega rápidos con opciones de envío confiables para cumplir con tus plazos.",
        },
        {
          icon: <Clock className="h-10 w-10 text-primary" />,
          title: "Servicio Bajo Demanda",
          description: "Imprime exactamente lo que necesitas, cuando lo necesitas, sin pedidos mínimos.",
        },
        {
          icon: <CreditCard className="h-10 w-10 text-primary" />,
          title: "Precios Competitivos",
          description: "Tarifas asequibles sin comprometer la calidad, con descuentos por volumen disponibles.",
        },
        {
          icon: <Palette className="h-10 w-10 text-primary" />,
          title: "Diseños Personalizados",
          description: "Sube tus propios diseños o trabaja con nuestro equipo para crear algo único.",
        },
        {
          icon: <Users className="h-10 w-10 text-primary" />,
          title: "Soporte Dedicado",
          description: "Nuestro equipo de servicio al cliente está disponible para ayudarte durante todo el proceso.",
        },
      ],
    },
  }

  const t = language === "en" ? featuresContent.en : featuresContent.es

  // Helper function to map feature titles to service URLs
  const getServiceUrl = (title: string, index: number) => {
    const titleLower = title.toLowerCase()

    // Map of feature titles to service URLs
    const urlMap: Record<string, string> = {
      "high-quality printing": "digital-printing",
      "impresión de alta calidad": "digital-printing",
      "fast delivery": "delivery",
      "entrega rápida": "delivery",
      "on-demand service": "rush",
      "servicio bajo demanda": "rush",
      "competitive pricing": "consultation",
      "precios competitivos": "consultation",
      "custom designs": "design",
      "diseños personalizados": "design",
      "dedicated support": "consultation",
      "soporte dedicado": "consultation",
    }

    // Return the mapped URL or a fallback based on index
    return urlMap[titleLower] || `${titleLower.replace(/\s+/g, "-")}`
  }

  return (
    <section className="py-20 bg-brand-dark">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">
              <span className="gradient-text">{t.tagline}</span>
            </h3>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              {t.title} <span className="gradient-text">{t.titleHighlight}</span>
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t.description}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {t.features.map((feature, index) => (
            <Link
              href={`/services/${getServiceUrl(feature.title, index)}`}
              key={index}
              className="block transition-transform hover:scale-105"
            >
              <div className="relative overflow-hidden rounded-lg border bg-card p-6">
                <div className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <div className="flex h-full flex-col justify-between">
                  <div className="space-y-4">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
