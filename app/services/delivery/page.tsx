"use client"

import { useContext, useState } from "react"
import { LanguageContext } from "@/context/language-context"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MapPin, Clock, Truck, Shield } from "lucide-react"
import Link from "next/link"
import { QuoteRequestModal } from "@/components/quote-request-modal"

export default function DeliveryPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)

  const t = language === "en" ? en : es

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="relative h-[350px] md:h-[450px] rounded-xl overflow-hidden">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Delivery-w77p5NgsU354cgibXakw56BwJmnBGQ.jpeg"
            alt="Delivery Person Handing Package to Customer"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">{t.reliableDelivery.title}</h2>
          <p className="text-lg mb-6">{t.reliableDelivery.description}</p>

          <Alert className="mb-6 border-amber-500">
            <MapPin className="h-5 w-5 text-amber-500" />
            <AlertTitle className="text-amber-500 font-bold">{t.metropolitanArea.title}</AlertTitle>
            <AlertDescription>{t.metropolitanArea.description}</AlertDescription>
          </Alert>

          <div className="space-y-4">
            {t.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="mr-3 mt-1 text-primary">✓</div>
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">{t.shippingOptions.title}</h2>
        <Card>
          <CardHeader>
            <CardTitle>{t.shippingOptions.subtitle}</CardTitle>
            <CardDescription>{t.shippingOptions.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.shippingOptions.serviceType}</TableHead>
                  <TableHead>{t.shippingOptions.deliveryTime}</TableHead>
                  <TableHead>{t.shippingOptions.cost}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{t.shippingOptions.options.priority.name}</TableCell>
                  <TableCell>{t.shippingOptions.options.priority.time}</TableCell>
                  <TableCell>${t.shippingOptions.options.priority.cost}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{t.shippingOptions.options.maxUrgency.name}</TableCell>
                  <TableCell>{t.shippingOptions.options.maxUrgency.time}</TableCell>
                  <TableCell>${t.shippingOptions.options.maxUrgency.cost}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{t.shippingOptions.options.regular.name}</TableCell>
                  <TableCell>{t.shippingOptions.options.regular.time}</TableCell>
                  <TableCell>${t.shippingOptions.options.regular.cost}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <Truck className="h-10 w-10 text-primary mb-2" />
            <CardTitle>{t.benefits.reliable.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t.benefits.reliable.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Clock className="h-10 w-10 text-primary mb-2" />
            <CardTitle>{t.benefits.flexible.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t.benefits.flexible.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Shield className="h-10 w-10 text-primary mb-2" />
            <CardTitle>{t.benefits.secure.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t.benefits.secure.description}</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted rounded-xl p-8 text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{t.cta.title}</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">{t.cta.description}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" onClick={() => setIsQuoteModalOpen(true)}>
            {t.cta.quoteButton}
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">{t.cta.contactButton}</Link>
          </Button>
        </div>
      </div>

      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        serviceType={language === "en" ? "Delivery & Shipping" : "Entrega y Envío"}
      />
    </div>
  )
}

const en = {
  title: "Delivery & Shipping Services",
  subtitle: "Fast, reliable delivery options for all your printed materials",
  reliableDelivery: {
    title: "Reliable Delivery When You Need It",
    description:
      "We understand that timely delivery of your printed materials is crucial. That's why we offer flexible shipping options to meet your deadlines and budget requirements. From same-day rush delivery to standard shipping, we've got you covered.",
  },
  metropolitanArea: {
    title: "Metropolitan Area Only",
    description:
      "Our delivery services are currently available only within the Metropolitan area. We're working on expanding our coverage to serve you better.",
  },
  features: [
    {
      title: "Real-time Tracking",
      description: "Track your delivery in real-time from dispatch to delivery.",
    },
    {
      title: "Secure Packaging",
      description: "Your printed materials are carefully packaged to prevent damage during transit.",
    },
    {
      title: "Flexible Scheduling",
      description: "Choose delivery times that work for your schedule.",
    },
    {
      title: "Proof of Delivery",
      description: "Receive confirmation when your package has been delivered.",
    },
  ],
  shippingOptions: {
    title: "Shipping Options",
    subtitle: "Choose the Delivery Option That Works for You",
    description: "We offer multiple shipping options based on your urgency and budget requirements.",
    serviceType: "Service Type",
    deliveryTime: "Delivery Time",
    cost: "Cost",
    options: {
      priority: {
        name: "Priority",
        time: "5 hours",
        cost: "5",
      },
      maxUrgency: {
        name: "Maximum Urgency",
        time: "1.5-2 hours",
        cost: "10",
      },
      regular: {
        name: "Regular Shipping",
        time: "48 hours",
        cost: "3",
      },
    },
  },
  benefits: {
    reliable: {
      title: "Reliable Service",
      description: "Our dedicated delivery team ensures your printed materials arrive on time, every time.",
    },
    flexible: {
      title: "Flexible Options",
      description: "Choose from multiple delivery options based on your timeline and budget.",
    },
    secure: {
      title: "Secure Handling",
      description: "Your materials are carefully packaged and handled to prevent damage during transit.",
    },
  },
  cta: {
    title: "Ready to Get Started?",
    description:
      "Contact us today to learn more about our delivery options or to schedule a delivery for your printed materials.",
    quoteButton: "Get a Quote",
    contactButton: "Contact Us",
  },
}

const es = {
  title: "Servicios de Entrega y Envío",
  subtitle: "Opciones de entrega rápidas y confiables para todos sus materiales impresos",
  reliableDelivery: {
    title: "Entrega Confiable Cuando Lo Necesita",
    description:
      "Entendemos que la entrega oportuna de sus materiales impresos es crucial. Por eso ofrecemos opciones de envío flexibles para cumplir con sus plazos y requisitos de presupuesto. Desde entregas urgentes el mismo día hasta envíos estándar, lo tenemos cubierto.",
  },
  metropolitanArea: {
    title: "Solo Área Metropolitana",
    description:
      "Nuestros servicios de entrega están actualmente disponibles solo dentro del área Metropolitana. Estamos trabajando para expandir nuestra cobertura para servirle mejor.",
  },
  features: [
    {
      title: "Seguimiento en Tiempo Real",
      description: "Siga su entrega en tiempo real desde el despacho hasta la entrega.",
    },
    {
      title: "Embalaje Seguro",
      description: "Sus materiales impresos son cuidadosamente empaquetados para evitar daños durante el tránsito.",
    },
    {
      title: "Programación Flexible",
      description: "Elija horarios de entrega que funcionen para su agenda.",
    },
    {
      title: "Comprobante de Entrega",
      description: "Reciba confirmación cuando su paquete haya sido entregado.",
    },
  ],
  shippingOptions: {
    title: "Opciones de Envío",
    subtitle: "Elija la Opción de Entrega que Funcione para Usted",
    description: "Ofrecemos múltiples opciones de envío basadas en su urgencia y requisitos de presupuesto.",
    serviceType: "Tipo de Servicio",
    deliveryTime: "Tiempo de Entrega",
    cost: "Costo",
    options: {
      priority: {
        name: "Prioritario",
        time: "5 horas",
        cost: "5",
      },
      maxUrgency: {
        name: "Máxima Urgencia",
        time: "1.5-2 horas",
        cost: "10",
      },
      regular: {
        name: "Envío Regular",
        time: "48 horas",
        cost: "3",
      },
    },
  },
  benefits: {
    reliable: {
      title: "Servicio Confiable",
      description: "Nuestro dedicado equipo de entrega asegura que sus materiales impresos lleguen a tiempo, siempre.",
    },
    flexible: {
      title: "Opciones Flexibles",
      description: "Elija entre múltiples opciones de entrega según su cronograma y presupuesto.",
    },
    secure: {
      title: "Manejo Seguro",
      description:
        "Sus materiales son cuidadosamente empaquetados y manipulados para evitar daños durante el tránsito.",
    },
  },
  cta: {
    title: "¿Listo para Comenzar?",
    description:
      "Contáctenos hoy para obtener más información sobre nuestras opciones de entrega o para programar una entrega para sus materiales impresos.",
    quoteButton: "Obtener Cotización",
    contactButton: "Contáctenos",
  },
}
