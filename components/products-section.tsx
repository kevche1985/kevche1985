"use client"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"

export default function ProductsSection() {
  const { language } = useContext(LanguageContext) || { language: "es" }

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

  const products = [
    {
      id: "1",
      name: language === "en" ? "Geometric T-Shirt" : "Camiseta Geométrica",
      description:
        language === "en"
          ? "High-quality cotton t-shirt with custom geometric design"
          : "Camiseta de algodón de alta calidad con diseño geométrico personalizado",
      price: 24.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-tshirt-hero.jpg-REJerWrLTRG2rHVGLd8TRvYF5UEPbA.jpeg",
      category: language === "en" ? "Apparel" : "Ropa",
      isNew: true,
    },
    {
      id: "2",
      name: language === "en" ? "Artist Series Mug" : "Taza Serie Artística",
      description:
        language === "en"
          ? "Premium ceramic mug with vibrant gradient artwork design"
          : "Taza de cerámica premium con diseño artístico de gradiente vibrante",
      price: 14.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-mug.jpg-5Q2pamNUHvlYx3oyMji9NA9nNt54Pz.jpeg",
      category: language === "en" ? "Drinkware" : "Tazas",
      isBestseller: true,
    },
    {
      id: "3",
      name: language === "en" ? "Rainbow Splash Canvas Set" : "Set de Lienzos Arcoíris",
      description:
        language === "en"
          ? "5-panel canvas art set with stunning watercolor effect"
          : "Set de 5 lienzos con impresionante efecto acuarela",
      price: 149.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-canvas.jpg-pJNPPkVNYUZuIBHicIcBfKkov8cLTC.jpeg",
      category: language === "en" ? "Wall Art" : "Arte de Pared",
    },
    {
      id: "4",
      name: language === "en" ? "Women + Waves Hoodie" : "Sudadera Women + Waves",
      description:
        language === "en"
          ? "Cozy black hoodie with surf-inspired artwork"
          : "Cómoda sudadera negra con diseño inspirado en el surf",
      price: 39.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-hoodie.jpg-JbAQCvHzx8tc62SRUkAVXjKvpkNnTy.jpeg",
      category: language === "en" ? "Apparel" : "Ropa",
    },
    {
      id: "5",
      name: language === "en" ? "Custom Phone Cases" : "Fundas Personalizadas",
      description:
        language === "en"
          ? "Personalized phone cases with your favorite photos and designs"
          : "Fundas de teléfono personalizadas con tus fotos y diseños favoritos",
      price: 19.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-phoncase.jpg-lId32By5up2WTDh1JCtmFGVSn85wyG.jpeg",
      category: language === "en" ? "Accessories" : "Accesorios",
      isNew: true,
    },
    {
      id: "6",
      name: language === "en" ? "Canvas Tote Bag" : "Bolsa de Lona",
      description:
        language === "en"
          ? "Eco-friendly tote bag with minimalist geometric design"
          : "Bolsa ecológica con diseño geométrico minimalista",
      price: 16.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-tote-S4oeZKtWIJorAgH19rWSCHsvAWCKTR.jpeg",
      category: language === "en" ? "Accessories" : "Accesorios",
    },
    {
      id: "7",
      name: language === "en" ? "Motivational Wall Art" : "Póster Motivacional",
      description:
        language === "en"
          ? "Inspiring Muhammad Ali quote poster for your gym or office"
          : "Póster con cita inspiradora de Muhammad Ali para tu gimnasio u oficina",
      price: 29.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-poster.jpg-CUuRtARXJWj1jP1LtAGCQtwMoiyDzi.jpeg",
      category: language === "en" ? "Wall Art" : "Arte de Pared",
      isBestseller: true,
    },
    {
      id: "8",
      name: language === "en" ? "Dream Notebook Set" : "Set de Cuadernos Dream",
      description:
        language === "en"
          ? "Elegant notebooks with gold foil lettering, available in pink and navy"
          : "Elegantes cuadernos con letras en lámina dorada, disponibles en rosa y azul marino",
      price: 12.99,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-notebook-T8PkCir9cuwTTDVF8vkkkFCpxK0D4c.png",
      category: language === "en" ? "Stationery" : "Papelería",
    },
  ]

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
