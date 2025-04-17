"use client"

import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export function CategoryShowcase() {
  const { language } = useContext(LanguageContext) || { language: "es" }

  const content = {
    en: {
      title: "Explore Our Product Categories",
      description: "Choose from our wide range of customizable products",
      viewAll: "View All Products",
      categories: [
        {
          name: "Business Cards",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tarjeta%20Disenio%204-2OJlQkhSF1CXhkgklnWnBBl3eEAyZ8.png",
          link: "/products/tarjetas",
        },
        {
          name: "T-Shirts",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-tshirt-hero.jpg-REJerWrLTRG2rHVGLd8TRvYF5UEPbA.jpeg",
          link: "/products/camisetas",
        },
        {
          name: "Flyers",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Flyer1-asyFTYUET57jq3aiwpOlz2RasVhZp5.png",
          link: "/products/flyers",
        },
        {
          name: "Mugs",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mug1-fpcuUkQmg35bAAy2pcDv1dxfGKV6nz.jpeg",
          link: "/products/tazas",
        },
        {
          name: "Stickers",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stickers1.jpg-SPj5rBRL1WXSZQddqfyxv0lSCa9dBR.jpeg",
          link: "/products/stickers",
        },
        {
          name: "Planners & Notebooks",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Notebook1.jpg-MYzgoBZWt0ppcCAKs4HeLXqlhxTOKi.jpeg",
          link: "/products/agendas-y-cuadernos",
        },
      ],
    },
    es: {
      title: "Explora Nuestras Categorías de Productos",
      description: "Elige entre nuestra amplia gama de productos personalizables",
      viewAll: "Ver Todos los Productos",
      categories: [
        {
          name: "Tarjetas de Presentación",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tarjeta%20Disenio%204-2OJlQkhSF1CXhkgklnWnBBl3eEAyZ8.png",
          link: "/products/tarjetas",
        },
        {
          name: "Camisetas",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-tshirt-hero.jpg-REJerWrLTRG2rHVGLd8TRvYF5UEPbA.jpeg",
          link: "/products/camisetas",
        },
        {
          name: "Volantes",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Flyer1-asyFTYUET57jq3aiwpOlz2RasVhZp5.png",
          link: "/products/flyers",
        },
        {
          name: "Tazas",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mug1-fpcuUkQmg35bAAy2pcDv1dxfGKV6nz.jpeg",
          link: "/products/tazas",
        },
        {
          name: "Stickers",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stickers1.jpg-SPj5rBRL1WXSZQddqfyxv0lSCa9dBR.jpeg",
          link: "/products/stickers",
        },
        {
          name: "Agendas y Cuadernos",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Notebook1.jpg-MYzgoBZWt0ppcCAKs4HeLXqlhxTOKi.jpeg",
          link: "/products/agendas-y-cuadernos",
        },
      ],
    },
  }

  const t = language === "en" ? content.en : content.es

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="mt-24 mb-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">{t.title}</h2>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {t.categories.map((category) => (
          <motion.div key={category.name} variants={item}>
            <Link href={category.link}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{category.name}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-center mt-8">
        <Button asChild>
          <Link href="/products">{t.viewAll}</Link>
        </Button>
      </div>
    </div>
  )
}
