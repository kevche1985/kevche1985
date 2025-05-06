"use client"

import type React from "react"

import { ProductCustomizer } from "@/components/product-customizer"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"

// Define business card types and prices
interface BusinessCardType {
  name: string
  description: string
  price: number
}

const businessCardTypes: BusinessCardType[] = [
  {
    name: "Standard",
    description: "Basic quality, affordable option",
    price: 19.99,
  },
  {
    name: "Premium",
    description: "Higher quality paper and finish",
    price: 29.99,
  },
  {
    name: "Luxury",
    description: "Premium materials with special finishes",
    price: 49.99,
  },
]

export default function ProductLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [selectedCardType, setSelectedCardType] = useState<BusinessCardType | null>(null)
  const [isDesignLocked, setIsDesignLocked] = useState(false)
  const [currentPrice, setCurrentPrice] = useState(0)
  const router = useRouter()
  const { addItem } = useCart()

  const handleCardTypeSelect = (cardType: BusinessCardType) => {
    if (!isDesignLocked) {
      setSelectedCardType(cardType)
      setCurrentPrice(cardType.price)
    }
  }

  const confirmDesign = () => {
    if (!selectedCardType) {
      toast({
        title: "Please select a card type",
        description: "You need to select a business card type before confirming your design.",
        variant: "destructive",
      })
      return
    }

    setIsDesignLocked(true)
    toast({
      title: "Design confirmed!",
      description: `Your ${selectedCardType.name} business card design has been locked. Price: $${selectedCardType.price.toFixed(2)}`,
    })
  }

  const resetDesign = () => {
    setIsDesignLocked(false)
    setSelectedCardType(null)
    setCurrentPrice(0)
  }

  const handleAddToCart = () => {
    if (selectedCardType) {
      addItem({
        id: `business-card-${Date.now()}`,
        name: `${selectedCardType.name} Business Card`,
        price: selectedCardType.price,
        quantity: 1,
        image: "/modern-minimalist-business-card.png", // Replace with actual image
        category: "Business Cards",
      })
      router.push("/cart")
    } else {
      toast({
        title: "Please select a card type",
        description: "You need to select a business card type before adding to cart.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container pt-4 flex justify-end">
        <button
          onClick={() => {
            console.log("Refreshing product data")
            window.location.reload()
          }}
          className="text-sm bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/90 transition-colors"
        >
          Refresh Products
        </button>
      </div>
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
          price={currentPrice}
          isLocked={isDesignLocked}
        />

        {/* Business Card Type Selection and Pricing */}
        <div className="mt-8 border-t border-border/40 pt-6">
          <h3 className="text-xl font-semibold mb-4">Select Business Card Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {businessCardTypes.map((cardType) => (
              <div
                key={cardType.name}
                onClick={() => handleCardTypeSelect(cardType)}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedCardType?.name === cardType.name ? "border-primary bg-primary/5" : "hover:border-primary"
                } ${isDesignLocked ? "opacity-70 pointer-events-none" : ""}`}
              >
                <h4 className="font-medium">{cardType.name}</h4>
                <p className="text-muted-foreground text-sm mb-2">{cardType.description}</p>
                <p className="font-bold">${cardType.price.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-end mt-6">
            {isDesignLocked ? (
              <button
                onClick={resetDesign}
                className="px-4 py-2 border border-destructive rounded-md text-destructive hover:bg-destructive/10 transition-colors"
              >
                Edit Design
              </button>
            ) : (
              <button
                onClick={confirmDesign}
                className={`px-4 py-2 border border-primary rounded-md text-primary hover:bg-primary/10 transition-colors ${
                  !selectedCardType ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!selectedCardType}
              >
                Confirm Design
              </button>
            )}
            <button
              onClick={handleAddToCart}
              className={`px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors ${
                !isDesignLocked ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isDesignLocked}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
