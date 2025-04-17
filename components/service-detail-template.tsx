"use client"

import type React from "react"

import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ServiceDetailTemplateProps {
  serviceId: string
  children?: React.ReactNode
}

export function ServiceDetailTemplate({ serviceId, children }: ServiceDetailTemplateProps) {
  const { language } = useContext(LanguageContext) || { language: "es" }

  // Service data - in a real app, this would come from an API or database
  const services = {
    "digital-printing": {
      en: {
        title: "Digital Printing",
        description: "High-quality digital printing for small to medium runs with quick turnaround times.",
        features: [
          "High-resolution printing up to 1200 dpi",
          "Full color CMYK printing",
          "Various paper types and finishes",
          "Fast turnaround times",
          "No minimum order quantity",
        ],
        image: "/placeholder.svg?height=400&width=600&text=Digital+Printing",
      },
      es: {
        title: "Impresión Digital",
        description:
          "Impresión digital de alta calidad para tiradas pequeñas y medianas con tiempos de entrega rápidos.",
        features: [
          "Impresión de alta resolución hasta 1200 dpi",
          "Impresión a todo color CMYK",
          "Varios tipos de papel y acabados",
          "Tiempos de entrega rápidos",
          "Sin cantidad mínima de pedido",
        ],
        image: "/placeholder.svg?height=400&width=600&text=Impresión+Digital",
      },
    },
    "custom-designs": {
      en: {
        title: "Custom Designs",
        description: "Professional design services to bring your ideas to life with unique, custom artwork.",
        features: [
          "Professional graphic designers",
          "Unlimited revisions",
          "Brand identity development",
          "Custom illustrations and graphics",
          "Print-ready file preparation",
        ],
        image: "/placeholder.svg?height=400&width=600&text=Custom+Designs",
      },
      es: {
        title: "Diseños Personalizados",
        description:
          "Servicios de diseño profesional para dar vida a tus ideas con obras de arte únicas y personalizadas.",
        features: [
          "Diseñadores gráficos profesionales",
          "Revisiones ilimitadas",
          "Desarrollo de identidad de marca",
          "Ilustraciones y gráficos personalizados",
          "Preparación de archivos listos para imprimir",
        ],
        image: "/placeholder.svg?height=400&width=600&text=Diseños+Personalizados",
      },
    },
    "large-format": {
      en: {
        title: "Large Format Printing",
        description: "Banners, posters, and signage printed in high resolution for maximum impact.",
        features: [
          "High-quality large format printing",
          "Indoor and outdoor options",
          "Various materials available",
          "Custom sizes and shapes",
          "Durable finishes for long-lasting results",
        ],
        image: "/placeholder.svg?height=400&width=600&text=Large+Format+Printing",
      },
      es: {
        title: "Impresión de Gran Formato",
        description: "Banners, pósters y señalización impresos en alta resolución para un impacto máximo.",
        features: [
          "Impresión de gran formato de alta calidad",
          "Opciones para interiores y exteriores",
          "Varios materiales disponibles",
          "Tamaños y formas personalizados",
          "Acabados duraderos para resultados de larga duración",
        ],
        image: "/placeholder.svg?height=400&width=600&text=Impresión+Gran+Formato",
      },
    },
    packaging: {
      en: {
        title: "Packaging Solutions",
        description: "Custom packaging design and printing for products of all shapes and sizes.",
        features: [
          "Custom box and package design",
          "Product packaging prototypes",
          "Eco-friendly packaging options",
          "Brand-consistent packaging",
          "Small to large production runs",
        ],
        image: "/placeholder.svg?height=400&width=600&text=Packaging+Solutions",
      },
      es: {
        title: "Soluciones de Empaque",
        description: "Diseño e impresión de empaques personalizados para productos de todas las formas y tamaños.",
        features: [
          "Diseño personalizado de cajas y empaques",
          "Prototipos de empaques de productos",
          "Opciones de empaque ecológicas",
          "Empaques consistentes con la marca",
          "Producciones pequeñas a grandes",
        ],
        image: "/placeholder.svg?height=400&width=600&text=Soluciones+Empaque",
      },
    },
    rush: {
      en: {
        title: "Rush Services",
        description: "Expedited printing and delivery for those urgent projects with tight deadlines.",
        features: [
          "Same-day printing options",
          "Priority production scheduling",
          "Express shipping and delivery",
          "24-hour turnaround available",
          "Quality assurance even on rush jobs",
        ],
        image: "/placeholder.svg?height=400&width=600&text=Rush+Services",
      },
      es: {
        title: "Servicios Express",
        description: "Impresión y entrega aceleradas para esos proyectos urgentes con plazos ajustados.",
        features: [
          "Opciones de impresión el mismo día",
          "Programación prioritaria de producción",
          "Envío y entrega express",
          "Entrega en 24 horas disponible",
          "Garantía de calidad incluso en trabajos urgentes",
        ],
        image: "/placeholder.svg?height=400&width=600&text=Servicios+Express",
      },
    },
    delivery: {
      en: {
        title: "Delivery & Shipping",
        description: "Reliable delivery options to get your printed materials where they need to go.",
        features: [
          "Local delivery services",
          "Nationwide shipping options",
          "International shipping available",
          "Tracking on all shipments",
          "Packaging to prevent damage during transit",
        ],
        image: "/placeholder.svg?height=400&width=600&text=Delivery+Shipping",
      },
      es: {
        title: "Entrega y Envío",
        description: "Opciones de entrega confiables para llevar tus materiales impresos donde necesiten ir.",
        features: [
          "Servicios de entrega local",
          "Opciones de envío nacional",
          "Envío internacional disponible",
          "Seguimiento en todos los envíos",
          "Embalaje para prevenir daños durante el tránsito",
        ],
        image: "/placeholder.svg?height=400&width=600&text=Entrega+Envío",
      },
    },
    consultation: {
      en: {
        title: "Consultation",
        description: "Expert advice on materials, finishes, and printing techniques for your project.",
        features: [
          "One-on-one consultation sessions",
          "Material and finish recommendations",
          "Cost-saving strategies",
          "Design optimization for print",
          "Project planning assistance",
        ],
        image: "/placeholder.svg?height=400&width=600&text=Consultation",
      },
      es: {
        title: "Consultoría",
        description: "Asesoramiento experto sobre materiales, acabados y técnicas de impresión para tu proyecto.",
        features: [
          "Sesiones de consulta personalizadas",
          "Recomendaciones de materiales y acabados",
          "Estrategias para ahorrar costos",
          "Optimización de diseño para impresión",
          "Asistencia en planificación de proyectos",
        ],
        image: "/placeholder.svg?height=400&width=600&text=Consultoría",
      },
    },
    // Add more services as needed
  }

  const service = services[serviceId as keyof typeof services]
  if (!service) return <div>Service not found</div>

  const t = language === "en" ? service.en : service.es

  const translations = {
    en: {
      backToServices: "Back to Services",
      features: "Features",
    },
    es: {
      backToServices: "Volver a Servicios",
      features: "Características",
    },
  }

  const common = language === "en" ? translations.en : translations.es

  return (
    <div className="container py-12">
      <div className="mb-6">
        <Link href="/services" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          {common.backToServices}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{t.description}</p>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{common.features}</h2>
            <ul className="space-y-2">
              {t.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden">
          <Image
            src={t.image || "/placeholder.svg"}
            alt={t.title}
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </div>
  )
}
