"use client"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { useProducts } from "@/context/product-context"

export default function ProductsSection() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const { products } = useProducts()

  const content = {
    en: {
      title: "Our Popular",
      titleHighlight: "Products",
      description: "Discover our most popular print-on-demand products",
      cta: "View All Products",
    },
    es: {
      title: "Nuestros",
      titleHighlight: "Productos Populares",
      description: "Descubre nuestros productos de impresión bajo demanda más populares",
      cta: "Ver Todos los Productos",
    },
  }

  const t = language === "en" ? content.en : content.es

  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              {t.title} <span className="gradient-text">{t.titleHighlight}</span>
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t.description}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        <div className="flex justify-center">
          <Button size="lg">{t.cta}</Button>
        </div>
      </div>
    </section>
  )
}
