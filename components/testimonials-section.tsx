"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Star } from "lucide-react"
import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"

export default function TestimonialsSection() {
  const { language } = useContext(LanguageContext) || { language: "es" }

  const content = {
    en: {
      tagline: "Testimonials",
      title: "What Our",
      titleHighlight: "Customers Say",
      description: "Don't just take our word for it - hear from our satisfied customers",
    },
    es: {
      tagline: "Testimonios",
      title: "Lo Que Dicen",
      titleHighlight: "Nuestros Clientes",
      description: "No solo confíes en nuestra palabra - escucha a nuestros clientes satisfechos",
    },
  }

  const testimonials = {
    en: [
      {
        name: "Sarah Johnson",
        role: "Small Business Owner",
        content:
          "The quality of the prints exceeded my expectations. My customers love the products, and the fast delivery has helped me grow my business.",
        avatar: "/placeholder.svg?height=80&width=80",
        rating: 5,
      },
      {
        name: "Michael Chen",
        role: "Graphic Designer",
        content:
          "I've tried several print-on-demand services, and this is by far the best. The colors are vibrant, and the customer service is exceptional.",
        avatar: "/placeholder.svg?height=80&width=80",
        rating: 5,
      },
      {
        name: "Emily Rodriguez",
        role: "Etsy Shop Owner",
        content:
          "The print quality is consistent, and the shipping is reliable. I've been able to scale my Etsy shop thanks to this service.",
        avatar: "/placeholder.svg?height=80&width=80",
        rating: 4,
      },
    ],
    es: [
      {
        name: "Sarah Johnson",
        role: "Dueña de Pequeño Negocio",
        content:
          "La calidad de las impresiones superó mis expectativas. A mis clientes les encantan los productos, y la entrega rápida ha ayudado a hacer crecer mi negocio.",
        avatar: "/placeholder.svg?height=80&width=80",
        rating: 5,
      },
      {
        name: "Michael Chen",
        role: "Diseñador Gráfico",
        content:
          "He probado varios servicios de impresión bajo demanda, y este es sin duda el mejor. Los colores son vibrantes y el servicio al cliente es excepcional.",
        avatar: "/placeholder.svg?height=80&width=80",
        rating: 5,
      },
      {
        name: "Emily Rodriguez",
        role: "Propietaria de Tienda Etsy",
        content:
          "La calidad de impresión es consistente y el envío es confiable. He podido expandir mi tienda de Etsy gracias a este servicio.",
        avatar: "/placeholder.svg?height=80&width=80",
        rating: 4,
      },
    ],
  }

  const t = language === "en" ? content.en : content.es
  const testimonialsList = language === "en" ? testimonials.en : testimonials.es

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
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          {testimonialsList.map((testimonial, index) => (
            <Card key={index} className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                      />
                    ))}
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
