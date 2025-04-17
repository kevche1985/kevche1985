"use client"

import { useContext, useState } from "react"
import { LanguageContext } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer, Maximize2, Palette, Truck, MessageSquare } from "lucide-react"
import Link from "next/link"
import { QuoteRequestModal } from "@/components/quote-request-modal"

export default function ServicesPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState("general")

  const openQuoteModal = (serviceId = "general") => {
    setSelectedService(serviceId)
    setIsQuoteModalOpen(true)
  }

  const t = language === "en" ? en : es

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {t.services.map((service, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4">{service.icon}</div>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 mt-1 text-primary">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/services/${service.id}`}>{t.learnMore}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-muted rounded-xl p-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">{t.whyChooseUs.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.whyChooseUs.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.whyChooseUs.reasons.map((reason, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary text-xl">{reason.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">{t.process.title}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.process.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {t.process.steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4 text-white text-2xl font-bold">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
            {index < t.process.steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary/30 -z-10 transform -translate-x-8"></div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
        <Button size="lg" className="px-8" onClick={() => openQuoteModal()}>
          {t.cta}
        </Button>
        <Button size="lg" variant="outline" className="px-8" asChild>
          <Link href="/contact">{t.contact}</Link>
        </Button>
      </div>

      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        serviceType={selectedService}
      />
    </div>
  )
}

const en = {
  title: "Our Services",
  subtitle: "We offer a wide range of printing and design services to meet your business needs",
  learnMore: "Learn More",
  cta: "Get a Quote",
  contact: "Contact Us",
  services: [
    {
      id: "digital-printing",
      icon: <Printer className="h-8 w-8 text-primary" />,
      title: "Digital Printing",
      description: "High-quality digital printing for all your business needs",
      features: [
        "Business cards, flyers, and brochures",
        "Booklets and catalogs",
        "Posters and promotional materials",
        "Fast turnaround times",
        "Eco-friendly options available",
      ],
    },
    {
      id: "large-format",
      icon: <Maximize2 className="h-8 w-8 text-primary" />,
      title: "Large Format Printing",
      description: "Make a big impression with our large format printing services",
      features: [
        "Banners and posters",
        "Trade show displays",
        "Window graphics",
        "Vehicle wraps",
        "Billboard advertising",
      ],
    },
    {
      id: "design",
      icon: <Palette className="h-8 w-8 text-primary" />,
      title: "Design Services",
      description: "Professional design services to bring your ideas to life",
      features: [
        "Logo and brand identity design",
        "Marketing material design",
        "Packaging design",
        "Web design",
        "Unlimited revisions",
      ],
    },
    {
      id: "delivery",
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Delivery & Shipping",
      description: "Convenient delivery options to get your prints where they need to go",
      features: [
        "Local delivery",
        "Nationwide shipping",
        "International shipping options",
        "Tracking on all orders",
        "Secure packaging",
      ],
    },
    {
      id: "consultation",
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Consultation",
      description: "Expert advice to help you choose the right printing solutions",
      features: [
        "One-on-one consultations",
        "Material and finish recommendations",
        "Budget-friendly options",
        "Project planning assistance",
        "Free samples available",
      ],
    },
  ],
  whyChooseUs: {
    title: "Why Choose Us",
    subtitle: "We're committed to providing the best printing services with unmatched quality and customer service",
    reasons: [
      {
        icon: "🏆",
        title: "Quality Guaranteed",
        description: "We use the latest technology and premium materials to ensure the highest quality prints.",
      },
      {
        icon: "⏱️",
        title: "Fast Turnaround",
        description:
          "We understand deadlines are important, so we offer quick turnaround times without compromising quality.",
      },
      {
        icon: "💰",
        title: "Competitive Pricing",
        description:
          "High-quality printing doesn't have to break the bank. We offer competitive prices for all our services.",
      },
      {
        icon: "🌿",
        title: "Eco-Friendly Options",
        description: "We're committed to sustainability with eco-friendly materials and processes.",
      },
      {
        icon: "👥",
        title: "Expert Team",
        description:
          "Our team of printing professionals has years of experience and is dedicated to your satisfaction.",
      },
      {
        icon: "🔄",
        title: "Hassle-Free Revisions",
        description:
          "Not completely satisfied? We offer hassle-free revisions to ensure you get exactly what you want.",
      },
    ],
  },
  process: {
    title: "Our Process",
    subtitle: "We make printing simple with our streamlined process",
    steps: [
      {
        title: "Request a Quote",
        description: "Fill out our quote form with your project details or contact us directly.",
      },
      {
        title: "Design & Approval",
        description: "We'll work with you on the design or use your files, then get your approval before printing.",
      },
      {
        title: "Production",
        description: "Your project goes into production with our state-of-the-art equipment and quality materials.",
      },
      {
        title: "Delivery",
        description: "We'll deliver your finished prints directly to your door or have them ready for pickup.",
      },
    ],
  },
}

const es = {
  title: "Nuestros Servicios",
  subtitle:
    "Ofrecemos una amplia gama de servicios de impresión y diseño para satisfacer las necesidades de su negocio",
  learnMore: "Más Información",
  cta: "Solicitar Cotización",
  contact: "Contáctenos",
  services: [
    {
      id: "digital-printing",
      icon: <Printer className="h-8 w-8 text-primary" />,
      title: "Impresión Digital",
      description: "Impresión digital de alta calidad para todas las necesidades de su negocio",
      features: [
        "Tarjetas de presentación, volantes y folletos",
        "Folletos y catálogos",
        "Pósters y materiales promocionales",
        "Tiempos de entrega rápidos",
        "Opciones ecológicas disponibles",
      ],
    },
    {
      id: "large-format",
      icon: <Maximize2 className="h-8 w-8 text-primary" />,
      title: "Impresión de Gran Formato",
      description: "Cause una gran impresión con nuestros servicios de impresión de gran formato",
      features: [
        "Banners y pósters",
        "Displays para ferias comerciales",
        "Gráficos para ventanas",
        "Envolturas para vehículos",
        "Publicidad en vallas",
      ],
    },
    {
      id: "design",
      icon: <Palette className="h-8 w-8 text-primary" />,
      title: "Servicios de Diseño",
      description: "Servicios de diseño profesional para dar vida a sus ideas",
      features: [
        "Diseño de logotipos e identidad de marca",
        "Diseño de material de marketing",
        "Diseño de empaques",
        "Diseño web",
        "Revisiones ilimitadas",
      ],
    },
    {
      id: "delivery",
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Entrega y Envío",
      description: "Opciones de entrega convenientes para llevar sus impresiones donde las necesite",
      features: [
        "Entrega local",
        "Envío nacional",
        "Opciones de envío internacional",
        "Seguimiento en todos los pedidos",
        "Embalaje seguro",
      ],
    },
    {
      id: "consultation",
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Consultoría",
      description: "Asesoramiento experto para ayudarle a elegir las soluciones de impresión adecuadas",
      features: [
        "Consultas personalizadas",
        "Recomendaciones de materiales y acabados",
        "Opciones económicas",
        "Asistencia en planificación de proyectos",
        "Muestras gratuitas disponibles",
      ],
    },
  ],
  whyChooseUs: {
    title: "Por Qué Elegirnos",
    subtitle:
      "Estamos comprometidos a proporcionar los mejores servicios de impresión con calidad y servicio al cliente inigualables",
    reasons: [
      {
        icon: "🏆",
        title: "Calidad Garantizada",
        description:
          "Utilizamos la última tecnología y materiales premium para garantizar impresiones de la más alta calidad.",
      },
      {
        icon: "⏱️",
        title: "Entrega Rápida",
        description:
          "Entendemos que los plazos son importantes, por lo que ofrecemos tiempos de entrega rápidos sin comprometer la calidad.",
      },
      {
        icon: "💰",
        title: "Precios Competitivos",
        description:
          "La impresión de alta calidad no tiene que ser costosa. Ofrecemos precios competitivos para todos nuestros servicios.",
      },
      {
        icon: "🌿",
        title: "Opciones Ecológicas",
        description: "Estamos comprometidos con la sostenibilidad con materiales y procesos ecológicos.",
      },
      {
        icon: "👥",
        title: "Equipo Experto",
        description:
          "Nuestro equipo de profesionales de impresión tiene años de experiencia y está dedicado a su satisfacción.",
      },
      {
        icon: "🔄",
        title: "Revisiones Sin Complicaciones",
        description:
          "¿No está completamente satisfecho? Ofrecemos revisiones sin complicaciones para asegurar que obtenga exactamente lo que desea.",
      },
    ],
  },
  process: {
    title: "Nuestro Proceso",
    subtitle: "Hacemos que la impresión sea simple con nuestro proceso optimizado",
    steps: [
      {
        title: "Solicitar Cotización",
        description:
          "Complete nuestro formulario de cotización con los detalles de su proyecto o contáctenos directamente.",
      },
      {
        title: "Diseño y Aprobación",
        description:
          "Trabajaremos con usted en el diseño o usaremos sus archivos, luego obtendremos su aprobación antes de imprimir.",
      },
      {
        title: "Producción",
        description: "Su proyecto entra en producción con nuestro equipo de última generación y materiales de calidad.",
      },
      {
        title: "Entrega",
        description:
          "Entregaremos sus impresiones terminadas directamente a su puerta o las tendremos listas para recoger.",
      },
    ],
  },
}
