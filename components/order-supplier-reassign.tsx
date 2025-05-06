"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/language-context"
import { reassignOrderToSupplier } from "@/app/actions/supplier-actions"

export function OrderSupplierReassign({ orderId, currentSupplierId, suppliers, onReassigned }) {
  const { language } = useLanguage()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSupplierId, setSelectedSupplierId] = useState(currentSupplierId)
  const [isLoading, setIsLoading] = useState(false)

  const handleReassign = async () => {
    if (selectedSupplierId === currentSupplierId) {
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const result = await reassignOrderToSupplier(orderId, selectedSupplierId)

      if (result.success) {
        toast({
          title: language === "en" ? "Order Reassigned" : "Pedido Reasignado",
          description:
            language === "en"
              ? "The order has been reassigned to a new supplier."
              : "El pedido ha sido reasignado a un nuevo proveedor.",
        })

        if (onReassigned) {
          onReassigned(result.data)
        }
      } else {
        toast({
          title: language === "en" ? "Error" : "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" ? "Failed to reassign the order." : "No se pudo reasignar el pedido.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        {language === "en" ? "Change Supplier" : "Cambiar Proveedor"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "Reassign Order to Supplier" : "Reasignar Pedido a Proveedor"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              {language === "en"
                ? "Select a new supplier for this order:"
                : "Seleccione un nuevo proveedor para este pedido:"}
            </p>
            <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
              <SelectTrigger>
                <SelectValue placeholder={language === "en" ? "Select a supplier" : "Seleccione un proveedor"} />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              {language === "en" ? "Cancel" : "Cancelar"}
            </Button>
            <Button onClick={handleReassign} disabled={isLoading || selectedSupplierId === currentSupplierId}>
              {isLoading
                ? language === "en"
                  ? "Reassigning..."
                  : "Reasignando..."
                : language === "en"
                  ? "Reassign Order"
                  : "Reasignar Pedido"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
