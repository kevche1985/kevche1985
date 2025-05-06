"use client"

import { useEffect, useState, useContext, useMemo } from "react"
import { useParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { LanguageContext } from "@/context/language-context"
import { useProducts } from "@/context/product-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CategoryPage() {
  const params = useParams()
  const { language, t } = useContext(LanguageContext) || { language: "en", t: {} }
  const [products, setProducts] = useState([])
  const [categoryTitle, setCategoryTitle] = useState("")
  const [sort, setSort] = useState("featured")

  const { getProductsByCategory, categories } = useProducts()

  useEffect(() => {
    // Get the category from URL
    const categoryParam = params.category as string

    // Get products for this category
    const categoryProducts = getProductsByCategory(categoryParam)
    setProducts(categoryProducts)

    // Set the category title based on the first product's category or fallback
    if (categoryProducts.length > 0) {
      setCategoryTitle(categoryProducts[0].category)
    } else {
      // Fallback title based on URL parameter
      let title = params.category
        .toString()
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
      if (language === "en" && params.category === "agendas-y-cuadernos") {
        title = "Planners and Notebooks"
      }
      setCategoryTitle(title)
    }
  }, [params.category, language, getProductsByCategory])

  // Sort products based on the selected sort option
  const sortedProducts = useMemo(() => {
    const sorted = [...products]

    switch (sort) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price)
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price)
      case "newest":
        return sorted.sort((a, b) => (a.isNew ? -1 : 1) - (b.isNew ? -1 : 1))
      case "featured":
      default:
        return sorted.sort((a, b) => (a.isBestseller ? -1 : 1) - (b.isBestseller ? -1 : 1))
    }
  }, [products, sort])

  return (
    <div className="container pt-24 pb-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{categoryTitle}</h1>

        <Select defaultValue={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {products.length === 0 ? (
        <div className="py-8">
          <p className="text-xl text-gray-500 text-center mb-8">
            {language === "en"
              ? "No products found in this category. Check out our Canvas collection:"
              : "No se encontraron productos en esta categoría. Mira nuestra colección de Canvas:"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Canvas products */}
            <ProductCard
              id="cp1"
              name="Abstract Botanical Canvas"
              description="Modern abstract art with vibrant colors featuring stylized plant forms"
              price={49.99}
              image="/images/canvas/canvas1-abstract-plant.png"
              category="Canvas Prints"
              isNew={true}
            />
            <ProductCard
              id="cp2"
              name="Stylized Portrait Canvas"
              description="Elegant stylized portrait of a woman with bold colors on contrasting background"
              price={59.99}
              image="/images/canvas/canvas2-stylized-portrait.png"
              category="Canvas Prints"
              isNew={false}
            />
            <ProductCard
              id="cp3"
              name="Gatsby Pop Art Canvas"
              description="Colorful pop art portrait with vibrant abstract background"
              price={69.99}
              image="/images/canvas/canvas3-gatsby-portrait.png"
              category="Canvas Prints"
              isBestseller={true}
            />
            <ProductCard
              id="cp4"
              name="Starry Night Multi-Panel Canvas"
              description="Five-panel reproduction of Van Gogh's Starry Night masterpiece"
              price={129.99}
              image="/images/canvas/canvas4-starry-night-panels.png"
              category="Canvas Prints"
              isNew={true}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
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
