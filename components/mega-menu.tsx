"use client"

import { useState, useContext } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { LanguageContext } from "@/context/language-context"

interface MenuItem {
  title: string
  items: {
    name: string
    href: string
  }[]
}

export default function MegaMenu() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const menuItems: { [key: string]: MenuItem[] } = {
    en: [
      {
        title: "STATIONERY & ADVERTISING",
        items: [
          { name: "Business Cards", href: "/products/business-cards" },
          { name: "Loyalty Cards", href: "/products/loyalty-cards" },
          { name: "Brochures & Flyers", href: "/products/brochures-flyers" },
          { name: "Gift Cards", href: "/products/gift-cards" },
          { name: "Tent Cards", href: "/products/tent-cards" },
          { name: "ID Cards", href: "/products/id-cards" },
          { name: "Posters", href: "/products/posters" },
          { name: "Calendars", href: "/products/calendars" },
          { name: "Lanyards", href: "/products/lanyards" },
        ],
      },
      {
        title: "STICKERS & ADHESIVES",
        items: [
          { name: "Die Cut Stickers", href: "/products/die-cut-stickers" },
          { name: "Circle Stickers", href: "/products/circle-stickers" },
          { name: "Square Stickers", href: "/products/square-stickers" },
          { name: "Gold Foil Stickers", href: "/products/gold-foil-stickers" },
          { name: "Magic Stickers", href: "/products/magic-stickers" },
          { name: "Transparent Stickers", href: "/products/transparent-stickers" },
        ],
      },
      {
        title: "SIGNS & SIGNAGE",
        items: [
          { name: "PVC Signs", href: "/products/pvc-signs" },
          { name: "XL Vinyl Stickers", href: "/products/xl-vinyl-stickers" },
          { name: "Banners", href: "/products/banners" },
        ],
      },
    ],
    es: [
      {
        title: "PAPELERÍA & PUBLICIDAD",
        items: [
          { name: "Tarjetas de presentación", href: "/products/tarjetas-presentacion" },
          { name: "Tarjetas de cliente frecuente", href: "/products/tarjetas-cliente" },
          { name: "Brochures y Flyers", href: "/products/brochures-flyers" },
          { name: "Gift Cards", href: "/products/gift-cards" },
          { name: "Tent Cards", href: "/products/tent-cards" },
          { name: "Carnet", href: "/products/carnet" },
          { name: "Posters", href: "/products/posters" },
          { name: "Calendarios", href: "/products/calendarios" },
          { name: "Landyards", href: "/products/landyards" },
        ],
      },
      {
        title: "STICKERS & ADHESIVOS",
        items: [
          { name: "Sticker troquelados", href: "/products/stickers-troquelados" },
          { name: "Stickers Circulares", href: "/products/stickers-circulares" },
          { name: "Stickers Cuadrados", href: "/products/stickers-cuadrados" },
          { name: "Stickers con Foil dorado", href: "/products/stickers-foil" },
          { name: "Magic Stickers", href: "/products/magic-stickers" },
          { name: "Stickers transparentes", href: "/products/stickers-transparentes" },
        ],
      },
      {
        title: "RÓTULOS & SEÑALÉTICA",
        items: [
          { name: "Rótulos sobre PVC", href: "/products/rotulos-pvc" },
          { name: "Stickers de vinil XL", href: "/products/stickers-vinil-xl" },
          { name: "Banners", href: "/products/banners" },
        ],
      },
    ],
  }

  return (
    <nav className="relative bg-background border-b">
      <div className="container mx-auto">
        <ul className="flex space-x-8">
          {menuItems[language].map((category) => (
            <li
              key={category.title}
              className="relative group py-4"
              onMouseEnter={() => setActiveCategory(category.title)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <button className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                <span>{category.title}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {activeCategory === category.title && (
                <div className="absolute left-0 top-full w-64 bg-background border rounded-lg shadow-lg p-4 z-50">
                  <ul className="space-y-2">
                    {category.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
