"use client"

import { useContext, useState } from "react"
import { LanguageContext } from "@/context/language-context"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const router = useRouter()

  const content = {
    en: {
      title: "Your Cart",
      emptyCart: "Your cart is empty",
      continueShopping: "Continue Shopping",
      product: "Product",
      price: "Price",
      quantity: "Quantity",
      total: "Total",
      subtotal: "Subtotal",
      checkout: "Checkout",
      remove: "Remove",
      clearCart: "Clear Cart",
    },
    es: {
      title: "Tu Carrito",
      emptyCart: "Tu carrito está vacío",
      continueShopping: "Continuar Comprando",
      product: "Producto",
      price: "Precio",
      quantity: "Cantidad",
      total: "Total",
      subtotal: "Subtotal",
      checkout: "Pagar",
      remove: "Eliminar",
      clearCart: "Vaciar Carrito",
    },
  }

  const t = language === "en" ? content.en : content.es

  const handleCheckout = () => {
    setIsCheckingOut(true)
    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">{t.title}</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingCart className="h-24 w-24 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold mb-4">{t.emptyCart}</h2>
          <Button asChild>
            <Link href="/products">{t.continueShopping}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex items-center mb-8">
        <Link
          href="/products"
          className="flex items-center text-muted-foreground hover:text-primary transition-colors mr-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t.continueShopping}
        </Link>
        <h1 className="text-3xl font-bold">{t.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="hidden md:grid grid-cols-12 gap-4 mb-4 font-medium text-muted-foreground">
            <div className="col-span-6">{t.product}</div>
            <div className="col-span-2 text-center">{t.price}</div>
            <div className="col-span-2 text-center">{t.quantity}</div>
            <div className="col-span-2 text-right">{t.total}</div>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="h-20 w-20 relative rounded overflow-hidden">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        {item.customization?.text && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {language === "en" ? "Custom text: " : "Texto personalizado: "}
                            {item.customization.text}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-span-2 text-center">
                      <div className="md:hidden text-sm text-muted-foreground mb-1">{t.price}</div>
                      <div>${item.price.toFixed(2)}</div>
                    </div>

                    <div className="col-span-2 flex items-center justify-center">
                      <div className="md:hidden text-sm text-muted-foreground mb-1 mr-2">{t.quantity}</div>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                          className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center justify-between md:justify-end">
                      <div className="md:hidden text-sm text-muted-foreground">{t.total}</div>
                      <div className="flex items-center gap-4">
                        <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={clearCart}>
              <Trash2 className="h-4 w-4 mr-2" />
              {t.clearCart}
            </Button>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">{t.subtotal}</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>{t.total}</span>
                  <span className="font-bold">${getCartTotal().toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                  {t.checkout}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
