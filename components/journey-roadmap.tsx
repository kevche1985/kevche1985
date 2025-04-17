"use client"

import { useContext, useState } from "react"
import { LanguageContext } from "@/context/language-context"
import { JourneySpot } from "@/components/journey-spot"
import { motion } from "framer-motion"
import { ShoppingBag, Palette, Sparkles, Printer, ShoppingCart, User, Heart, FileText, Info } from "lucide-react"

export function JourneyRoadmap() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const [activeSpot, setActiveSpot] = useState<string | null>(null)

  const content = {
    en: {
      spots: [
        {
          id: "products",
          title: "Products",
          description:
            "Browse our wide range of customizable products, from business cards and flyers to t-shirts and mugs.",
          icon: <ShoppingBag className="h-6 w-6" />,
          link: "/products",
          position: "top-left",
        },
        {
          id: "customization",
          title: "Customization",
          description: "Upload your designs, add text, and customize your products with our easy-to-use design tools.",
          icon: <Palette className="h-6 w-6" />,
          link: "/products/camisetas",
          position: "top-center",
        },
        {
          id: "ai-tools",
          title: "AI Tools",
          description: "Use our AI-powered tools to generate logos, images, and design suggestions for your products.",
          icon: <Sparkles className="h-6 w-6" />,
          link: "/ai",
          position: "top-right",
        },
        {
          id: "services",
          title: "Services",
          description:
            "Explore our professional printing services, including digital printing, large format, and custom designs.",
          icon: <Printer className="h-6 w-6" />,
          link: "/services",
          position: "middle-left",
        },
        {
          id: "cart",
          title: "Shopping Cart",
          description: "Review your items, adjust quantities, and proceed to checkout when you're ready to order.",
          icon: <ShoppingCart className="h-6 w-6" />,
          link: "/cart",
          position: "middle-center",
        },
        {
          id: "my-print",
          title: "My Print",
          description: "Track your orders, manage your designs, and access your favorite products.",
          icon: <User className="h-6 w-6" />,
          link: "/my-print/orders",
          position: "middle-right",
        },
        {
          id: "favorites",
          title: "Favorites",
          description: "Save your favorite products and designs for quick access later.",
          icon: <Heart className="h-6 w-6" />,
          link: "/my-print/favorites",
          position: "bottom-left",
        },
        {
          id: "orders",
          title: "Orders",
          description: "View your order history, check order status, and reorder previous items.",
          icon: <FileText className="h-6 w-6" />,
          link: "/my-print/orders",
          position: "bottom-center",
        },
        {
          id: "about",
          title: "About Us",
          description: "Learn about our company, our mission, and our commitment to quality printing.",
          icon: <Info className="h-6 w-6" />,
          link: "/about",
          position: "bottom-right",
        },
      ],
    },
    es: {
      spots: [
        {
          id: "products",
          title: "Productos",
          description:
            "Explora nuestra amplia gama de productos personalizables, desde tarjetas de presentación y volantes hasta camisetas y tazas.",
          icon: <ShoppingBag className="h-6 w-6" />,
          link: "/products",
          position: "top-left",
        },
        {
          id: "customization",
          title: "Personalización",
          description:
            "Sube tus diseños, añade texto y personaliza tus productos con nuestras herramientas de diseño fáciles de usar.",
          icon: <Palette className="h-6 w-6" />,
          link: "/products/camisetas",
          position: "top-center",
        },
        {
          id: "ai-tools",
          title: "Herramientas IA",
          description:
            "Utiliza nuestras herramientas potenciadas por IA para generar logos, imágenes y sugerencias de diseño para tus productos.",
          icon: <Sparkles className="h-6 w-6" />,
          link: "/ai",
          position: "top-right",
        },
        {
          id: "services",
          title: "Servicios",
          description:
            "Explora nuestros servicios profesionales de impresión, incluyendo impresión digital, gran formato y diseños personalizados.",
          icon: <Printer className="h-6 w-6" />,
          link: "/services",
          position: "middle-left",
        },
        {
          id: "cart",
          title: "Carrito de Compras",
          description:
            "Revisa tus artículos, ajusta las cantidades y procede al pago cuando estés listo para realizar tu pedido.",
          icon: <ShoppingCart className="h-6 w-6" />,
          link: "/cart",
          position: "middle-center",
        },
        {
          id: "my-print",
          title: "Mi Print",
          description: "Rastrea tus pedidos, administra tus diseños y accede a tus productos favoritos.",
          icon: <User className="h-6 w-6" />,
          link: "/my-print/orders",
          position: "middle-right",
        },
        {
          id: "favorites",
          title: "Favoritos",
          description: "Guarda tus productos y diseños favoritos para acceder rápidamente más tarde.",
          icon: <Heart className="h-6 w-6" />,
          link: "/my-print/favorites",
          position: "bottom-left",
        },
        {
          id: "orders",
          title: "Pedidos",
          description:
            "Ve tu historial de pedidos, verifica el estado de los pedidos y vuelve a pedir artículos anteriores.",
          icon: <FileText className="h-6 w-6" />,
          link: "/my-print/orders",
          position: "bottom-center",
        },
        {
          id: "about",
          title: "Nosotros",
          description: "Conoce nuestra empresa, nuestra misión y nuestro compromiso con la impresión de calidad.",
          icon: <Info className="h-6 w-6" />,
          link: "/about",
          position: "bottom-right",
        },
      ],
    },
  }

  const spots = language === "en" ? content.en.spots : content.es.spots

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Grid layout for journey spots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {spots.map((spot, index) => {
          // Create connection dots
          const showDot = true

          return (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connection dot */}
              {showDot && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full z-10" />
              )}

              <JourneySpot
                title={spot.title}
                description={spot.description}
                icon={spot.icon}
                link={spot.link}
                isActive={activeSpot === spot.id}
                onClick={() => setActiveSpot(spot.id === activeSpot ? null : spot.id)}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Connection lines - these will be visible on larger screens */}
      <div className="hidden md:block">
        {/* Horizontal lines */}
        <div className="absolute top-[calc(33.33%-1.5rem)] left-[16.67%] w-[66.67%] h-0.5 bg-muted z-0"></div>
        <div className="absolute top-[calc(66.67%-1.5rem)] left-[16.67%] w-[66.67%] h-0.5 bg-muted z-0"></div>

        {/* Vertical lines */}
        <div className="absolute top-[16.67%] left-[calc(33.33%-1.5rem)] w-0.5 h-[66.67%] bg-muted z-0"></div>
        <div className="absolute top-[16.67%] left-[calc(66.67%-1.5rem)] w-0.5 h-[66.67%] bg-muted z-0"></div>
      </div>
    </div>
  )
}
