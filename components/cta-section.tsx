"use client"

import { Button } from "@/components/ui/button"
import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import Link from "next/link"

export default function CTASection() {
  const { language } = useContext(LanguageContext) || { language: "es" }

  const content = {
    en: {
      title: "Ready to bring your designs to life?",
      description:
        "Get started today and experience our premium print-on-demand services. No minimum orders, fast delivery, and exceptional quality.",
      cta1: "Get Started",
      cta2: "Contact Sales",
    },
    es: {
      title: "¿Listo para dar vida a tus diseños?",
      description:
        "Comienza hoy y experimenta nuestros servicios premium de impresión bajo demanda. Sin pedidos mínimos, entrega rápida y calidad excepcional.",
      cta1: "Comenzar",
      cta2: "Contactar Ventas",
    },
  }

  const t = language === "en" ? content.en : content.es

  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="rounded-2xl bg-gradient-to-r from-brand-red to-brand-orange p-1">
          <div className="rounded-xl bg-brand-dark p-8 md:p-12 lg:p-16">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t.title}</h2>
                <p className="text-muted-foreground md:text-xl">{t.description}</p>
              </div>
              <div className="flex flex-col gap-4 lg:justify-end">
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="h-12" asChild>
                    <Link href="/get-started">{t.cta1}</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12">
                    {t.cta2}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
