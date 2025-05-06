"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid2X2, List, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"

// Add imports for useSearchParams and useRouter at the top of the file
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useProducts } from "@/context/product-context"

// Update the products array to include products in all categories
const products = [
  {
    id: "1",
    name: "Geometric T-Shirt",
    description: "High-quality cotton t-shirt with custom geometric design",
    price: 24.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-tshirt-hero.jpg-REJerWrLTRG2rHVGLd8TRvYF5UEPbA.jpeg",
    category: "Apparel",
    isNew: true,
  },
  {
    id: "2",
    name: "Artist Series Mug",
    description: "Premium ceramic mug with vibrant gradient artwork design",
    price: 14.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-mug.jpg-5Q2pamNUHvlYx3oyMji9NA9nNt54Pz.jpeg",
    category: "Drinkware",
    isBestseller: true,
  },
  {
    id: "3",
    name: "Rainbow Splash Canvas Set",
    description: "5-panel canvas art set with stunning watercolor effect",
    price: 149.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-canvas.jpg-pJNPPkVNYUZuIBHicIcBfKkov8cLTC.jpeg",
    category: "Wall Art",
  },
  {
    id: "4",
    name: "Women + Waves Hoodie",
    description: "Cozy black hoodie with surf-inspired artwork",
    price: 39.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-hoodie.jpg-JbAQCvHzx8tc62SRUkAVXjKvpkNnTy.jpeg",
    category: "Apparel",
  },
  {
    id: "5",
    name: "Custom Phone Cases",
    description: "Personalized phone cases with your favorite photos and designs",
    price: 19.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-phoncase.jpg-lId32By5up2WTDh1JCtmFGVSn85wyG.jpeg",
    category: "Accessories",
    isNew: true,
  },
  {
    id: "6",
    name: "Canvas Tote Bag",
    description: "Eco-friendly tote bag with minimalist geometric design",
    price: 16.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-tote-S4oeZKtWIJorAgH19rWSCHsvAWCKTR.jpeg",
    category: "Accessories",
  },
  {
    id: "7",
    name: "Motivational Wall Art",
    description: "Inspiring Muhammad Ali quote poster for your gym or office",
    price: 29.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-poster.jpg-CUuRtARXJWj1jP1LtAGCQtwMoiyDzi.jpeg",
    category: "Wall Art",
    isBestseller: true,
  },
  {
    id: "8",
    name: "Dream Notebook Set",
    description: "Elegant notebooks with gold foil lettering, available in pink and navy",
    price: 12.99,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printondemand-notebook-T8PkCir9cuwTTDVF8vkkkFCpxK0D4c.png",
    category: "Stationery",
  },
  {
    id: "9",
    name: "Decorative Throw Pillows",
    description: "Set of 2 decorative throw pillows with custom patterns",
    price: 34.99,
    image: "/cozy-cushions.png",
    category: "Home & Living",
    isNew: true,
  },
  {
    id: "10",
    name: "Custom Tumbler",
    description: "Insulated tumbler with your choice of design or photo",
    price: 24.99,
    image: "/personalized-travel-mug.png",
    category: "Drinkware",
  },
  {
    id: "11",
    name: "Photo Canvas Print",
    description: "Turn your favorite photos into beautiful canvas prints",
    price: 59.99,
    image: "/placeholder.svg?key=r34pu",
    category: "Wall Art",
  },
  {
    id: "12",
    name: "Custom Blanket",
    description: "Soft fleece blanket with your photos or designs",
    price: 49.99,
    image: "/placeholder.svg?key=vry7t",
    category: "Home & Living",
  },
]

// Update the ProductsPage component to handle category filtering
export default function ProductsPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [sort, setSort] = useState("featured")
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get("category")
  const { products } = useProducts()

  // Filter products based on the category parameter
  const filteredProducts = categoryParam
    ? products.filter((product) => {
        const normalizedCategory = product.category.toLowerCase()
        const normalizedParam = categoryParam.toLowerCase()
        return (
          normalizedCategory === normalizedParam ||
          (normalizedParam === "home-living" && normalizedCategory.includes("home"))
        )
      })
    : products

  // Sort products based on the selected sort option
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]

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
  }, [filteredProducts, sort])

  // Function to handle category filter changes
  const handleCategoryChange = (category: string) => {
    router.push(`/products?category=${category.toLowerCase()}`)
  }

  return (
    <div className="container pt-24 pb-8">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-10">
        <ul className="flex items-center space-x-2 text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li className="before:content-['/'] before:mx-2">
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
          </li>
          {categoryParam && (
            <li className="before:content-['/'] before:mx-2 capitalize">{categoryParam.replace(/-/g, " ")}</li>
          )}
        </ul>
      </div>

      {/* Category Title if filtered */}
      {categoryParam && (
        <h1 className="text-3xl font-bold mb-6 capitalize">{categoryParam.replace(/-/g, " ")} Products</h1>
      )}

      {/* Filters and Sort */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Categories</h3>
                  <div className="space-y-3">
                    {["Apparel", "Drinkware", "Wall Art", "Home & Living", "Accessories"].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={
                            categoryParam?.toLowerCase() ===
                            category
                              .toLowerCase()
                              .replace(/\s+&\s+/g, "-")
                              .replace(/\s+/g, "-")
                          }
                          onCheckedChange={() =>
                            handleCategoryChange(
                              category
                                .toLowerCase()
                                .replace(/\s+&\s+/g, "-")
                                .replace(/\s+/g, "-"),
                            )
                          }
                        />
                        <label htmlFor={category} className="text-sm">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Add more filter sections */}
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden lg:flex items-center space-x-4">
            <Button variant={view === "grid" ? "default" : "ghost"} size="sm" onClick={() => setView("grid")}>
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button variant={view === "list" ? "default" : "ghost"} size="sm" onClick={() => setView("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

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

      {/* Products Grid */}
      <div
        className={
          view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
        }
      >
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => <ProductCard key={product.id} {...product} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">Try changing your filters or check back later for new products.</p>
          </div>
        )}
      </div>
    </div>
  )
}
