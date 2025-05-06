"use client"

import type React from "react"

import { createQuote } from "@/app/actions/quote-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export function QuoteForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<QuoteItem[]>([{ id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }])

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [total, setTotal] = useState(0)

  const updateTotals = () => {
    const newSubtotal = calculateSubtotal()
    setSubtotal(newSubtotal)

    const newTotal = newSubtotal + tax - discount
    setTotal(newTotal)
  }

  const handleItemChange = (id: string, field: keyof QuoteItem, value: string | number) => {
    setItems((prevItems) => {
      const newItems = prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Recalculate total if quantity or unitPrice changes
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
          }

          return updatedItem
        }
        return item
      })

      // Update totals after item change
      setTimeout(updateTotals, 0)

      return newItems
    })
  }

  const addItem = () => {
    const newId = `item_${Date.now()}`
    setItems([...items, { id: newId, description: "", quantity: 1, unitPrice: 0, total: 0 }])
  }

  const removeItem = (id: string) => {
    if (items.length === 1) {
      return // Don't remove the last item
    }

    setItems(items.filter((item) => item.id !== id))
    setTimeout(updateTotals, 0)
  }

  const handleTaxChange = (value: string) => {
    const newTax = Number.parseFloat(value) || 0
    setTax(newTax)
    setTotal(subtotal + newTax - discount)
  }

  const handleDiscountChange = (value: string) => {
    const newDiscount = Number.parseFloat(value) || 0
    setDiscount(newDiscount)
    setTotal(subtotal + tax - newDiscount)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)

    // Add calculated values
    formData.append("subtotal", subtotal.toString())
    formData.append("tax", tax.toString())
    formData.append("discount", discount.toString())
    formData.append("total", total.toString())

    // Add items as JSON
    formData.append("items", JSON.stringify(items))

    // Add current user as creator (in a real app, get this from auth)
    formData.append("createdBy", "current-user-id")

    try {
      setIsLoading(true)
      const quote = await createQuote(formData)

      toast({
        title: "Quote created",
        description: "Your quote has been created successfully",
      })

      router.push(`/admin/quotes/${quote.id}`)
    } catch (error) {
      console.error("Error creating quote:", error)
      toast({
        title: "Error",
        description: "Failed to create quote",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input id="customerName" name="customerName" required />
          </div>

          <div>
            <Label htmlFor="customerEmail">Customer Email</Label>
            <Input id="customerEmail" name="customerEmail" type="email" required />
          </div>

          <div>
            <Label htmlFor="customerPhone">Customer Phone (optional)</Label>
            <Input id="customerPhone" name="customerPhone" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="validUntil">Valid Until</Label>
            <Input
              id="validUntil"
              name="validUntil"
              type="date"
              required
              defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" name="notes" rows={4} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Quote Items</h3>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-5">
                <Label htmlFor={`item-${item.id}-description`}>Description</Label>
                <Input
                  id={`item-${item.id}-description`}
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor={`item-${item.id}-quantity`}>Quantity</Label>
                <Input
                  id={`item-${item.id}-quantity`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor={`item-${item.id}-price`}>Unit Price</Label>
                <Input
                  id={`item-${item.id}-price`}
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="col-span-2">
                <Label>Total</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm">
                  {formatCurrency(item.total)}
                </div>
              </div>

              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="tax">Tax:</Label>
              <div className="w-24">
                <Input
                  id="tax"
                  type="number"
                  step="0.01"
                  min="0"
                  value={tax}
                  onChange={(e) => handleTaxChange(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="discount">Discount:</Label>
              <div className="w-24">
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={discount}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/quotes")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Quote"}
        </Button>
      </div>
    </form>
  )
}
