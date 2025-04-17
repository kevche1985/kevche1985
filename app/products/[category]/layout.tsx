import type React from "react"
import type { Metadata } from "next"
import { ProductCustomizer } from "@/components/product-customizer"

export const metadata: Metadata = {
  title: "Products - Print On Demand",
  description: "Browse our collection of print on demand products",
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
      <div className="container py-12 border-t border-border/40 mt-12">
        <h2 className="text-2xl font-bold mb-6">Customize Your Product</h2>
        <p className="text-muted-foreground mb-8">
          Upload your own design, adjust it to fit the product, and add text or shapes to create your perfect custom
          item.
        </p>
        <ProductCustomizer
          productImage="/placeholder.svg?height=600&width=600&text=Select+a+Product"
          productName="Custom Product"
          productDescription="Select a product above to customize it with your own design."
          price={0}
        />
      </div>
    </div>
  )
}
