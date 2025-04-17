"use client"

import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { MessageSquare, CheckCircle, Users, FileText, Calendar, Lightbulb } from "lucide-react"
import Link from "next/link"
import { QuoteRequestModal } from "@/components/quote-request-modal"
import { useState } from "react"

export default function ConsultationServicesPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)

  const t = language === "en" ? en : es

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl font-bold mb-6">{t.title}</h1>
          <p className="text-xl text-muted-foreground mb-8">{t.subtitle}</p>
          <div className="space-y-4">
            {t.keyPoints.map((point, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary mr-2 mt-1 flex-shrink-0" />
                <p>{point}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => setIsQuoteModalOpen(true)}>
              {t.cta}
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">{t.contact}</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden shadow-xl">
          <img src="/consultation-services.jpg" alt={t.imageAlt} className="w-full h-auto object-cover" />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t.servicesTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.services.map((service, index) => (
            <div key={index} className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted rounded-xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">{t.processTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.process.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4 text-white text-2xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < t.process.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary/30 -z-10 transform -translate-x-8"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-6">{t.faqTitle}</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.faqSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {t.faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
            <p className="text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="bg-primary/10 rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">{t.ctaSection.title}</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">{t.ctaSection.subtitle}</p>
        <Button size="lg" onClick={() => setIsQuoteModalOpen(true)}>
          {t.ctaSection.button}
        </Button>
      </div>

      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        serviceType="consultation"
      />
    </div>
  )
}

const en = {
  title: "Print Consultation Services",
  subtitle: "Expert advice to help you choose the right printing solutions for your business needs",
  imageAlt: "Print consultation experts reviewing technical drawings",
  keyPoints: [
    "Personalized consultation with printing experts",
    "Material and finish recommendations based on your specific needs",
    "Budget-friendly options for every project",
    "Technical guidance for optimal print results",
    "Sustainable printing solutions",
  ],
  cta: "Schedule a Consultation",
  contact: "Contact Us",
  servicesTitle: "Our Consultation Services",
  services: [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "One-on-One Consultations",
      description:
        "Meet with our print experts to discuss your specific project needs and get personalized recommendations.",
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Material Selection",
      description:
        "Get expert advice on the best materials, finishes, and printing techniques for your specific project.",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
      title: "Design Optimization",
      description: "Our experts will review your designs and suggest improvements to ensure the best print quality.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: "Project Planning",
      description: "Get help planning your print project timeline, from design to delivery, to meet your deadlines.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Technical Support",
      description: "Receive technical guidance on file preparation, color management, and print specifications.",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Quality Assurance",
      description: "Our experts will help ensure your print projects meet the highest quality standards.",
    },
  ],
  processTitle: "Our Consultation Process",
  process: [
    {
      title: "Initial Discussion",
      description: "We'll discuss your project requirements, goals, and budget to understand your needs.",
    },
    {
      title: "Recommendations",
      description: "Our experts will provide detailed recommendations tailored to your specific project.",
    },
    {
      title: "Sample Review",
      description: "Review material samples and mock-ups to ensure you're satisfied with our recommendations.",
    },
    {
      title: "Implementation",
      description: "We'll help implement the recommendations and guide you through the printing process.",
    },
  ],
  faqTitle: "Frequently Asked Questions",
  faqSubtitle: "Find answers to common questions about our consultation services",
  faqs: [
    {
      question: "Is there a fee for consultation services?",
      answer:
        "Initial consultations are complimentary. Depending on the complexity of your project, additional consultation services may have associated fees, which can be applied to your print order.",
    },
    {
      question: "How long does a typical consultation take?",
      answer:
        "Initial consultations typically take 30-60 minutes, depending on the complexity of your project and requirements.",
    },
    {
      question: "Can I get samples of materials during the consultation?",
      answer:
        "Yes, we provide material samples during consultations to help you make informed decisions about your print project.",
    },
    {
      question: "Do I need to prepare anything before the consultation?",
      answer:
        "It's helpful to have a general idea of your project requirements, timeline, and budget. If you have existing designs or samples, please bring them to the consultation.",
    },
  ],
  ctaSection: {
    title: "Ready to Get Started?",
    subtitle: "Schedule a consultation with our print experts today and take your print projects to the next level.",
    button: "Schedule a Consultation",
  },
}

const es = {
  title: "Servicios de Consultoría de Impresión",
  subtitle:
    "Asesoramiento experto para ayudarle a elegir las soluciones de impresión adecuadas para las necesidades de su negocio",
  imageAlt: "Expertos en consultoría de impresión revisando dibujos técnicos",
  keyPoints: [
    "Consulta personalizada con expertos en impresión",
    "Recomendaciones de materiales y acabados basadas en sus necesidades específicas",
    "Opciones económicas para cada proyecto",
    "Orientación técnica para resultados de impresión óptimos",
    "Soluciones de impresión sostenibles",
  ],
  cta: "Programar una Consulta",
  contact: "Contáctenos",
  servicesTitle: "Nuestros Servicios de Consultoría",
  services: [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Consultas Personalizadas",
      description:
        "Reúnase con nuestros expertos en impresión para discutir las necesidades específicas de su proyecto y obtener recomendaciones personalizadas.",
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Selección de Materiales",
      description:
        "Obtenga asesoramiento experto sobre los mejores materiales, acabados y técnicas de impresión para su proyecto específico.",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
      title: "Optimización de Diseño",
      description:
        "Nuestros expertos revisarán sus diseños y sugerirán mejoras para garantizar la mejor calidad de impresión.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: "Planificación de Proyectos",
      description:
        "Obtenga ayuda para planificar el cronograma de su proyecto de impresión, desde el diseño hasta la entrega, para cumplir con sus plazos.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Soporte Técnico",
      description:
        "Reciba orientación técnica sobre preparación de archivos, gestión de color y especificaciones de impresión.",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Garantía de Calidad",
      description:
        "Nuestros expertos le ayudarán a garantizar que sus proyectos de impresión cumplan con los más altos estándares de calidad.",
    },
  ],
  processTitle: "Nuestro Proceso de Consultoría",
  process: [
    {
      title: "Discusión Inicial",
      description: "Discutiremos los requisitos, objetivos y presupuesto de su proyecto para entender sus necesidades.",
    },
    {
      title: "Recomendaciones",
      description: "Nuestros expertos proporcionarán recomendaciones detalladas adaptadas a su proyecto específico.",
    },
    {
      title: "Revisión de Muestras",
      description:
        "Revise muestras de materiales y maquetas para asegurarse de que está satisfecho con nuestras recomendaciones.",
    },
    {
      title: "Implementación",
      description: "Le ayudaremos a implementar las recomendaciones y le guiaremos a través del proceso de impresión.",
    },
  ],
  faqTitle: "Preguntas Frecuentes",
  faqSubtitle: "Encuentre respuestas a preguntas comunes sobre nuestros servicios de consultoría",
  faqs: [
    {
      question: "¿Hay una tarifa por los servicios de consultoría?",
      answer:
        "Las consultas iniciales son gratuitas. Dependiendo de la complejidad de su proyecto, los servicios de consultoría adicionales pueden tener tarifas asociadas, que pueden aplicarse a su pedido de impresión.",
    },
    {
      question: "¿Cuánto tiempo dura una consulta típica?",
      answer:
        "Las consultas iniciales suelen durar entre 30 y 60 minutos, dependiendo de la complejidad de su proyecto y requisitos.",
    },
    {
      question: "¿Puedo obtener muestras de materiales durante la consulta?",
      answer:
        "Sí, proporcionamos muestras de materiales durante las consultas para ayudarle a tomar decisiones informadas sobre su proyecto de impresión.",
    },
    {
      question: "¿Necesito preparar algo antes de la consulta?",
      answer:
        "Es útil tener una idea general de los requisitos, el cronograma y el presupuesto de su proyecto. Si tiene diseños o muestras existentes, por favor tráigalos a la consulta.",
    },
  ],
  ctaSection: {
    title: "¿Listo para Comenzar?",
    subtitle:
      "Programe una consulta con nuestros expertos en impresión hoy y lleve sus proyectos de impresión al siguiente nivel.",
    button: "Programar una Consulta",
  },
}
