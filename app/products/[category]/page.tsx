"use client"

import { useEffect, useState, useContext } from "react"
import { useParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { LanguageContext } from "@/context/language-context"

// Sample product data
const productsByCategory = {
  // Business Cards
  tarjetas: [
    {
      id: "bc1",
      name: "Premium Business Cards",
      description: "High-quality business cards with premium finish",
      price: 29.99,
      image: "/modern-minimalist-business-card.png",
      category: "Business Cards",
      isNew: true,
    },
    {
      id: "bc2",
      name: "Standard Business Cards",
      description: "Professional business cards for everyday use",
      price: 19.99,
      image: "/professional-business-card.png",
      category: "Business Cards",
    },
    {
      id: "bc3",
      name: "Luxury Business Cards",
      description: "Embossed business cards with gold foil accents",
      price: 39.99,
      image: "/elegant-gold-business-card.png",
      category: "Business Cards",
      isBestseller: true,
    },
  ],
  // T-Shirts
  camisetas: [
    {
      id: "ts1",
      name: "Custom Printed T-Shirt",
      description: "100% cotton t-shirt with your custom design",
      price: 24.99,
      image: "/personalized-message-tee.png",
      category: "T-Shirts",
      isNew: true,
    },
    {
      id: "ts2",
      name: "Premium Cotton T-Shirt",
      description: "High-quality cotton t-shirt with durable print",
      price: 29.99,
      image: "/luxurious-cotton-tee.png",
      category: "T-Shirts",
      isBestseller: true,
    },
    {
      id: "ts3",
      name: "Performance T-Shirt",
      description: "Moisture-wicking fabric ideal for sports and activities",
      price: 34.99,
      image: "/athletic-woman-running.png",
      category: "T-Shirts",
    },
  ],
  // Canvas Prints - Updated with the new canvas images
  lienzos: [
    {
      id: "cp1",
      name: "Abstract Botanical Canvas",
      description: "Modern abstract art with vibrant colors featuring stylized plant forms",
      price: 49.99,
      image: "/images/canvas/canvas1-abstract-plant.png",
      category: "Canvas Prints",
      isNew: true,
    },
    {
      id: "cp2",
      name: "Stylized Portrait Canvas",
      description: "Elegant stylized portrait of a woman with bold colors on contrasting background",
      price: 59.99,
      image: "/images/canvas/canvas2-stylized-portrait.png",
      category: "Canvas Prints",
    },
    {
      id: "cp3",
      name: "Gatsby Pop Art Canvas",
      description: "Colorful pop art portrait with vibrant abstract background",
      price: 69.99,
      image: "/images/canvas/canvas3-gatsby-portrait.png",
      category: "Canvas Prints",
      isBestseller: true,
    },
    {
      id: "cp4",
      name: "Starry Night Multi-Panel Canvas",
      description: "Five-panel reproduction of Van Gogh's Starry Night masterpiece",
      price: 129.99,
      image: "/images/canvas/canvas4-starry-night-panels.png",
      category: "Canvas Prints",
      isNew: true,
    },
  ],
  // Mugs
  tazas: [
    {
      id: "mg1",
      name: "Custom Photo Mug",
      description: "Ceramic mug with your photo or design",
      price: 14.99,
      image: "/personalized-coffee-mug.png",
      category: "Mugs",
      isNew: true,
    },
    {
      id: "mg2",
      name: "Magic Reveal Mug",
      description: "Heat-sensitive mug that reveals design when hot",
      price: 19.99,
      image: "/heat-reveal-mug.png",
      category: "Mugs",
      isBestseller: true,
    },
    {
      id: "mg3",
      name: "Travel Mug",
      description: "Insulated travel mug with custom design",
      price: 24.99,
      image: "/stainless-steel-travel-mug.png",
      category: "Mugs",
    },
  ],
  // Posters - With the previously added poster images
  posters: [
    {
      id: "p1",
      name: "Pink Floyd Poster",
      description: "Iconic Pink Floyd artwork inspired by their legendary albums",
      price: 19.99,
      image: "/images/posters/poster1-pink-floyd.png",
      category: "Posters",
      isNew: true,
    },
    {
      id: "p2",
      name: "Motivational Quote Poster",
      description: "Inspirational Thomas Fuller quote with colorful typography",
      price: 17.99,
      image: "/images/posters/poster2-all-things.png",
      category: "Posters",
    },
    {
      id: "p3",
      name: "Make It Happen Poster",
      description: "Extreme sports motivational poster for those who overcome challenges",
      price: 18.99,
      image: "/images/posters/poster3-make-it-happen.png",
      category: "Posters",
    },
    {
      id: "p4",
      name: "Ambition & Action Poster",
      description: "Vintage-style motivational poster about ambition and taking action",
      price: 16.99,
      image: "/images/posters/poster4-ambition.png",
      category: "Posters",
    },
    {
      id: "p5",
      name: "Rock & Roll Poster",
      description: "Vibrant guitar design with colorful rainbow patterns and butterflies",
      price: 21.99,
      image: "/images/posters/poster5-rock-and-roll.png",
      category: "Posters",
      isBestseller: true,
    },
    {
      id: "p6",
      name: "Nirvana Band Poster",
      description: "Classic Nirvana band poster featuring Kurt Cobain and bandmates",
      price: 24.99,
      image: "/images/posters/poster6-nirvana.png",
      category: "Posters",
      isNew: true,
    },
  ],
  // Flyers
  flyers: [
    {
      id: "f1",
      name: "Standard Flyers",
      description: "Full-color flyers for promotions and events",
      price: 15.99,
      image: "/colorful-event-promotion.png",
      category: "Flyers",
      isNew: true,
    },
    {
      id: "f2",
      name: "Premium Flyers",
      description: "Heavy stock flyers with glossy finish",
      price: 19.99,
      image: "/elegant-event-invitation.png",
      category: "Flyers",
      isBestseller: true,
    },
    {
      id: "f3",
      name: "Folded Flyers",
      description: "Bi-fold or tri-fold flyers for more content",
      price: 24.99,
      image: "/trifold-brochure-mockup.png",
      category: "Flyers",
    },
  ],
  // Brochures
  brochures: [
    {
      id: "br1",
      name: "Tri-Fold Brochure",
      description: "Professional tri-fold brochures on premium paper",
      price: 29.99,
      image: "/professional-services-trifold.png",
      category: "Brochures",
      isNew: true,
    },
    {
      id: "br2",
      name: "Bi-Fold Brochure",
      description: "Simple bi-fold brochures with custom design",
      price: 24.99,
      image: "/modern-business-bifold.png",
      category: "Brochures",
      isBestseller: true,
    },
    {
      id: "br3",
      name: "Catalog Brochure",
      description: "Multi-page catalog style brochures",
      price: 39.99,
      image: "/modern-product-catalog.png",
      category: "Brochures",
    },
  ],
  // Banners
  banners: [
    {
      id: "bn1",
      name: "Vinyl Banner",
      description: "Durable vinyl banner for indoor or outdoor use",
      price: 49.99,
      image: "/vibrant-event-banner.png",
      category: "Banners",
      isNew: true,
    },
    {
      id: "bn2",
      name: "Retractable Banner",
      description: "Portable roll-up banner with stand",
      price: 79.99,
      image: "/trade-show-display.png",
      category: "Banners",
      isBestseller: true,
    },
    {
      id: "bn3",
      name: "Mesh Banner",
      description: "Wind-resistant mesh banner for outdoor events",
      price: 59.99,
      image: "/construction-site-mesh-banner.png",
      category: "Banners",
    },
  ],
  // Stickers - Updated with the new sticker images
  stickers: [
    {
      id: "st1",
      name: "Love-Themed Stickers",
      description: "Cute Valentine's Day and love-themed die-cut stickers",
      price: 9.99,
      image: "/images/stickers/love-themed-stickers.jpeg",
      category: "Stickers",
      isNew: true,
    },
    {
      id: "st2",
      name: "Wildlife Badge Stickers",
      description: "Camp Wild Life California outdoor-themed circular stickers",
      price: 12.99,
      image: "/images/stickers/wildlife-badges-stickers.jpeg",
      category: "Stickers",
      isBestseller: true,
    },
    {
      id: "st3",
      name: "Anime Character Sticker",
      description: "High-quality die-cut anime character stickers",
      price: 7.99,
      image: "/images/stickers/anime-character-sticker.jpeg",
      category: "Stickers",
    },
    {
      id: "st4",
      name: "Canadian Themed Stickers",
      description: "Collection of Canadian symbols and landmarks stickers",
      price: 11.99,
      image: "/images/stickers/canadian-themed-stickers.jpeg",
      category: "Stickers",
      isNew: true,
    },
    {
      id: "st5",
      name: "Football Team Stickers",
      description: "Argentina national football team sticker collection",
      price: 14.99,
      image: "/images/stickers/argentina-football-stickers.webp",
      category: "Stickers",
    },
    {
      id: "st6",
      name: "Football Club Logos",
      description: "International football club emblems and logos sticker pack",
      price: 16.99,
      image: "/images/stickers/football-club-stickers.jpeg",
      category: "Stickers",
      isBestseller: true,
    },
  ],
}

// Category mapping for English to internal category keys
const categoryMapping = {
  // English mappings
  "business-cards": "tarjetas",
  businesscards: "tarjetas",
  "business cards": "tarjetas",
  "t-shirts": "camisetas",
  tshirts: "camisetas",
  "t shirts": "camisetas",
  "canvas-prints": "lienzos",
  canvasprints: "lienzos",
  "canvas prints": "lienzos",
  canvas: "lienzos",
  mugs: "tazas",
  posters: "posters",
  flyers: "flyers",
  brochures: "brochures",
  banners: "banners",
  stickers: "stickers",

  // Spanish mappings
  tarjetas: "tarjetas",
  "tarjetas-de-presentacion": "tarjetas",
  camisetas: "camisetas",
  lienzos: "lienzos",
  tazas: "tazas",
  "posters-es": "posters",
  volantes: "flyers",
  folletos: "brochures",
  "banners-es": "banners",
  pegatinas: "stickers",
}

export default function CategoryPage() {
  const params = useParams()
  const { language, t } = useContext(LanguageContext) || { language: "en", t: {} }
  const [products, setProducts] = useState([])
  const [categoryTitle, setCategoryTitle] = useState("")

  useEffect(() => {
    // Get the category from URL and normalize it
    let categoryParam = params.category as string
    categoryParam = categoryParam.toLowerCase().replace(/-/g, "")

    // Try to find the category in our mapping
    let internalCategory = null

    // First try exact match
    if (categoryMapping[categoryParam]) {
      internalCategory = categoryMapping[categoryParam]
    } else {
      // Try with hyphens
      const hyphenatedParam = categoryParam.replace(/\s+/g, "-")
      if (categoryMapping[hyphenatedParam]) {
        internalCategory = categoryMapping[hyphenatedParam]
      } else {
        // Try without hyphens
        const unhyphenatedParam = categoryParam.replace(/-/g, "")
        if (categoryMapping[unhyphenatedParam]) {
          internalCategory = categoryMapping[unhyphenatedParam]
        } else {
          // Try with spaces
          const spacedParam = categoryParam.replace(/-/g, " ")
          if (categoryMapping[spacedParam]) {
            internalCategory = categoryMapping[spacedParam]
          }
        }
      }
    }

    // If we still don't have a match, use posters as fallback
    if (!internalCategory) {
      console.warn(`Category not found: ${categoryParam}, using posters as fallback`)
      internalCategory = "posters"
    }

    // Set the products based on the internal category
    const categoryProducts = productsByCategory[internalCategory] || []
    setProducts(categoryProducts)

    // Set the category title based on the first product's category or fallback
    if (categoryProducts.length > 0) {
      setCategoryTitle(categoryProducts[0].category)
    } else {
      // Fallback title based on URL parameter
      setCategoryTitle(
        params.category
          .toString()
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
      )
    }
  }, [params.category, language])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{categoryTitle}</h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            {language === "en"
              ? "No products found in this category."
              : "No se encontraron productos en esta categoría."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.image}
              category={product.category}
              isNew={product.isNew}
              isBestseller={product.isBestseller}
            />
          ))}
        </div>
      )}
    </div>
  )
}
