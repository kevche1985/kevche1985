"use client"

import { useContext, useState } from "react"
import { LanguageContext } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { QuoteRequestModal } from "@/components/quote-request-modal"

export default function DesignServicesPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)

  const content = {
    en: {
      title: "Design Services",
      subtitle: "Professional graphic design solutions for your brand",
      description:
        "Our team of expert designers creates stunning visuals that help your brand stand out. From logos and marketing materials to digital assets and packaging, we deliver creative solutions tailored to your specific needs.",
      features: [
        "Logo Design & Brand Identity",
        "Marketing Materials",
        "Packaging Design",
        "Social Media Graphics",
        "Custom Illustrations",
        "Photo Editing & Retouching",
        "Website Design",
        "Print-Ready Artwork",
      ],
      expertDesigners: {
        title: "Expert Designers",
        description:
          "Our team of professional designers brings years of experience and creative expertise to every project.",
      },
      customSolutions: {
        title: "Custom Solutions",
        description: "We create tailored design solutions that align with your brand identity and business objectives.",
      },
      unlimitedRevisions: {
        title: "Unlimited Revisions",
        description: "We work with you until you're completely satisfied with the final design.",
      },
      cta: "Get a Quote",
      contact: "Contact Us",
      imageAlt: "Logo Design Process",
    },
    es: {
      title: "Servicios de Diseño",
      subtitle: "Soluciones profesionales de diseño gráfico para su marca",
      description:
        "Nuestro equipo de diseñadores expertos crea visuales impresionantes que ayudan a que su marca destaque. Desde logotipos y materiales de marketing hasta activos digitales y empaques, ofrecemos soluciones creativas adaptadas a sus necesidades específicas.",
      features: [
        "Diseño de Logo e Identidad de Marca",
        "Materiales de Marketing",
        "Diseño de Empaques",
        "Gráficos para Redes Sociales",
        "Ilustraciones Personalizadas",
        "Edición y Retoque de Fotos",
        "Diseño de Sitios Web",
        "Diseños Listos para Imprimir",
      ],
      expertDesigners: {
        title: "Diseñadores Expertos",
        description:
          "Nuestro equipo de diseñadores profesionales aporta años de experiencia y experiencia creativa a cada proyecto.",
      },
      customSolutions: {
        title: "Soluciones Personalizadas",
        description:
          "Creamos soluciones de diseño a medida que se alinean con la identidad de su marca y los objetivos de su negocio.",
      },
      unlimitedRevisions: {
        title: "Revisiones Ilimitadas",
        description: "Trabajamos con usted hasta que esté completamente satisfecho con el diseño final.",
      },
      cta: "Obtener Cotización",
      contact: "Contáctenos",
      imageAlt: "Proceso de Diseño de Logo",
    },
  }

  const t = language === "en" ? content.en : content.es

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-2xl text-primary font-medium mb-4">{t.subtitle}</p>
          <p className="text-lg text-muted-foreground mb-6">{t.description}</p>
          <div className="flex flex-col md:flex-row gap-4">
            <Button size="lg" onClick={() => setIsQuoteModalOpen(true)}>
              {t.cta}
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">{t.contact}</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Diseno-Grafico.jpg-1dzZBkHw7HlLASV49Qej919p8EdJ0T.jpeg"
            alt={t.imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {language === "en" ? "Our Design Services" : "Nuestros Servicios de Diseño"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2 bg-muted/50 p-4 rounded-lg">
              <div className="mt-1 bg-primary rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted rounded-xl p-8 mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {language === "en" ? "Why Choose Our Design Services" : "Por Qué Elegir Nuestros Servicios de Diseño"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t.expertDesigners.title}</h3>
            <p className="text-muted-foreground">{t.expertDesigners.description}</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t.customSolutions.title}</h3>
            <p className="text-muted-foreground">{t.customSolutions.description}</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t.unlimitedRevisions.title}</h3>
            <p className="text-muted-foreground">{t.unlimitedRevisions.description}</p>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          {language === "en" ? "Ready to Transform Your Brand?" : "¿Listo para Transformar su Marca?"}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          {language === "en"
            ? "Let our design experts help you create a visual identity that resonates with your audience and elevates your brand."
            : "Permita que nuestros expertos en diseño le ayuden a crear una identidad visual que resuene con su audiencia y eleve su marca."}
        </p>
        <Button size="lg" onClick={() => setIsQuoteModalOpen(true)}>
          {t.cta}
        </Button>
      </div>

      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        serviceType={language === "en" ? "Design Services" : "Servicios de Diseño"}
      />
    </div>
  )
}
