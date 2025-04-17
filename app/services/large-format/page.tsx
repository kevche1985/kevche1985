"use client"

import { useContext } from "react"
import Image from "next/image"
import { LanguageContext } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { QuoteRequestModal } from "@/components/quote-request-modal"

export default function LargeFormatPrintingPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const router = useRouter()
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)

  const translations = {
    en: {
      title: "Large Format Printing",
      subtitle: "High-impact visual solutions for any space",
      description:
        "Our large format printing services deliver stunning visual impact for your marketing and promotional needs. From billboards and banners to posters and trade show displays, we provide high-quality printing on a variety of materials and sizes.",
      features: [
        "Billboard printing for maximum visibility",
        "Banners and signage for indoor and outdoor use",
        "Trade show displays and exhibition materials",
        "Vehicle wraps and large promotional graphics",
        "Custom sizes and materials available",
      ],
      benefits: [
        "Capture attention with high-impact visuals",
        "Durable materials for long-lasting displays",
        "Vibrant colors and sharp details",
        "Fast turnaround times for urgent projects",
        "Professional installation services available",
      ],
      cta: "Get a Quote",
      contactUs: "Contact Us",
      learnMore: "Learn More",
    },
    es: {
      title: "Impresión de Gran Formato",
      subtitle: "Soluciones visuales de alto impacto para cualquier espacio",
      description:
        "Nuestros servicios de impresión de gran formato ofrecen un impacto visual impresionante para tus necesidades de marketing y promoción. Desde vallas publicitarias y banners hasta pósters y displays para ferias comerciales, proporcionamos impresión de alta calidad en una variedad de materiales y tamaños.",
      features: [
        "Impresión de vallas publicitarias para máxima visibilidad",
        "Banners y señalización para uso interior y exterior",
        "Displays para ferias comerciales y materiales de exhibición",
        "Rotulación de vehículos y gráficos promocionales grandes",
        "Tamaños y materiales personalizados disponibles",
      ],
      benefits: [
        "Captura la atención con visuales de alto impacto",
        "Materiales duraderos para exhibiciones de larga duración",
        "Colores vibrantes y detalles nítidos",
        "Tiempos de entrega rápidos para proyectos urgentes",
        "Servicios de instalación profesional disponibles",
      ],
      cta: "Obtener Cotización",
      contactUs: "Contáctanos",
      learnMore: "Más Información",
    },
  }

  const t = language === "en" ? translations.en : translations.es

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">{t.title}</h1>
          <p className="text-xl text-muted-foreground">{t.subtitle}</p>
          <p className="text-lg">{t.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" onClick={() => setIsQuoteModalOpen(true)}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {t.cta}
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/contact")}>
              {t.contactUs}
            </Button>
          </div>
        </div>
        <div className="relative flex-1 h-[400px] w-full overflow-hidden rounded-xl">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/billboard-printing.jpg-gz5SStqKmGbI1lvsvj0bzVAdgiUZ0V.jpeg"
            alt="Billboard Printing Example"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{language === "en" ? "Our Services" : "Nuestros Servicios"}</h2>
          <ul className="space-y-2">
            {t.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 mt-1 text-primary">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{language === "en" ? "Benefits" : "Beneficios"}</h2>
          <ul className="space-y-2">
            {t.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 mt-1 text-primary">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-muted p-8 rounded-xl text-center">
        <h2 className="text-2xl font-bold mb-4">
          {language === "en" ? "Ready to make a big impression?" : "¿Listo para causar una gran impresión?"}
        </h2>
        <p className="text-lg mb-6">
          {language === "en"
            ? "Contact us today to discuss your large format printing needs and get a personalized quote."
            : "Contáctanos hoy para discutir tus necesidades de impresión de gran formato y obtener una cotización personalizada."}
        </p>
        <Button size="lg" onClick={() => setIsQuoteModalOpen(true)}>
          {t.cta}
        </Button>
      </div>

      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        serviceType="large-format"
      />
    </div>
  )
}
