"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Trash2, Plus } from "lucide-react"
import { useLanguage } from "@/context/language-context"

// Mock data - replace with actual API calls
const mockSuppliers = [
  {
    id: "delivery-print",
    name: "Delivery Print",
    email: "deliveryondemand@groupdeliveryprint.com",
    phone: "5142526365",
    address: "default",
    contactPerson: "Kevin",
    notes: "N/A",
  },
  {
    id: "1",
    name: "ABC Printing Supplies",
    email: "contact@abcprinting.com",
    phone: "555-123-4567",
    address: "123 Printer Lane, Inkville, CA 90210",
    contactPerson: "John Smith",
    notes: "Specializes in high-quality paper and ink supplies",
  },
  {
    id: "2",
    name: "XYZ Materials",
    email: "orders@xyzmaterials.com",
    phone: "555-987-6543",
    address: "456 Material Ave, Supplyton, NY 10001",
    contactPerson: "Jane Doe",
    notes: "Best for canvas and large format materials",
  },
  {
    id: "3",
    name: "PrintTech Solutions",
    email: "support@printtech.com",
    phone: "555-456-7890",
    address: "789 Tech Blvd, Printerville, TX 75001",
    contactPerson: "Robert Johnson",
    notes: "Provides specialty printing materials and equipment",
  },
]

export default function SuppliersPage() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const [suppliers, setSuppliers] = useState(mockSuppliers)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    contactPerson: "",
    notes: "",
  })

  // In a real application, you would fetch suppliers from your API
  useEffect(() => {
    // Replace with actual API call
    // const fetchSuppliers = async () => {
    //   const response = await fetch('/api/suppliers')
    //   const data = await response.json()
    //   setSuppliers(data)
    // }
    // fetchSuppliers()
  }, [])

  // Load suppliers from localStorage on component mount
  useEffect(() => {
    try {
      const savedSuppliers = localStorage.getItem("suppliers")
      if (savedSuppliers) {
        const parsedSuppliers = JSON.parse(savedSuppliers)
        // Merge with mock suppliers, avoiding duplicates
        const combinedSuppliers = [...mockSuppliers]

        parsedSuppliers.forEach((savedSupplier) => {
          if (!combinedSuppliers.some((s) => s.id === savedSupplier.id)) {
            combinedSuppliers.push(savedSupplier)
          }
        })

        setSuppliers(combinedSuppliers)
      }
    } catch (error) {
      console.error("Failed to load suppliers from localStorage:", error)
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSupplier = async () => {
    // In a real application, you would call your API to add the supplier
    // const response = await fetch('/api/suppliers', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // })
    // const data = await response.json()

    // Mock implementation
    const newSupplier = {
      id: `supplier-${Date.now()}`, // Generate a unique ID format that matches the product form expectations
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      contactPerson: formData.contactPerson,
      notes: formData.notes,
    }
    setSuppliers([...suppliers, newSupplier])
    setIsAddDialogOpen(false)
    resetForm()

    // Store in localStorage to persist between pages
    try {
      const existingSuppliers = JSON.parse(localStorage.getItem("suppliers") || "[]")
      localStorage.setItem("suppliers", JSON.stringify([...existingSuppliers, newSupplier]))
    } catch (error) {
      console.error("Failed to save supplier to localStorage:", error)
    }

    toast({
      title: language === "en" ? "Supplier Added" : "Proveedor Agregado",
      description:
        language === "en"
          ? `${formData.name} has been added successfully.`
          : `${formData.name} ha sido agregado exitosamente.`,
    })
  }

  const handleEditSupplier = async () => {
    // In a real application, you would call your API to update the supplier
    // const response = await fetch(`/api/suppliers/${currentSupplier.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // })
    // const data = await response.json()

    // Mock implementation
    const updatedSuppliers = suppliers.map((supplier) =>
      supplier.id === currentSupplier.id ? { ...supplier, ...formData } : supplier,
    )
    setSuppliers(updatedSuppliers)
    setIsEditDialogOpen(false)
    resetForm()

    toast({
      title: language === "en" ? "Supplier Updated" : "Proveedor Actualizado",
      description:
        language === "en"
          ? `${formData.name} has been updated successfully.`
          : `${formData.name} ha sido actualizado exitosamente.`,
    })
  }

  const handleDeleteSupplier = async () => {
    // In a real application, you would call your API to delete the supplier
    // const response = await fetch(`/api/suppliers/${currentSupplier.id}`, {
    //   method: 'DELETE'
    // })

    // Mock implementation
    const updatedSuppliers = suppliers.filter((supplier) => supplier.id !== currentSupplier.id)
    setSuppliers(updatedSuppliers)
    setIsDeleteDialogOpen(false)

    toast({
      title: language === "en" ? "Supplier Deleted" : "Proveedor Eliminado",
      description:
        language === "en"
          ? `${currentSupplier.name} has been deleted successfully.`
          : `${currentSupplier.name} ha sido eliminado exitosamente.`,
    })
  }

  const openEditDialog = (supplier) => {
    setCurrentSupplier(supplier)
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      contactPerson: supplier.contactPerson,
      notes: supplier.notes,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (supplier) => {
    setCurrentSupplier(supplier)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      contactPerson: "",
      notes: "",
    })
    setCurrentSupplier(null)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{language === "en" ? "Supplier Management" : "Gestión de Proveedores"}</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {language === "en" ? "Add Supplier" : "Agregar Proveedor"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{language === "en" ? "Suppliers" : "Proveedores"}</CardTitle>
          <CardDescription>
            {language === "en"
              ? "Manage your product suppliers and their information."
              : "Gestione sus proveedores de productos y su información."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === "en" ? "Name" : "Nombre"}</TableHead>
                <TableHead>{language === "en" ? "Contact Person" : "Persona de Contacto"}</TableHead>
                <TableHead>{language === "en" ? "Email" : "Correo"}</TableHead>
                <TableHead>{language === "en" ? "Phone" : "Teléfono"}</TableHead>
                <TableHead className="text-right">{language === "en" ? "Actions" : "Acciones"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(supplier)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                        onClick={() => openDeleteDialog(supplier)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Supplier Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Add New Supplier" : "Agregar Nuevo Proveedor"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {language === "en" ? "Name" : "Nombre"}*
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactPerson" className="text-right">
                {language === "en" ? "Contact Person" : "Persona de Contacto"}*
              </Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {language === "en" ? "Email" : "Correo"}*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                {language === "en" ? "Phone" : "Teléfono"}*
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                {language === "en" ? "Address" : "Dirección"}
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                {language === "en" ? "Notes" : "Notas"}
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                setIsAddDialogOpen(false)
              }}
            >
              {language === "en" ? "Cancel" : "Cancelar"}
            </Button>
            <Button onClick={handleAddSupplier}>{language === "en" ? "Add Supplier" : "Agregar Proveedor"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Edit Supplier" : "Editar Proveedor"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                {language === "en" ? "Name" : "Nombre"}*
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-contactPerson" className="text-right">
                {language === "en" ? "Contact Person" : "Persona de Contacto"}*
              </Label>
              <Input
                id="edit-contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                {language === "en" ? "Email" : "Correo"}*
              </Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                {language === "en" ? "Phone" : "Teléfono"}*
              </Label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right">
                {language === "en" ? "Address" : "Dirección"}
              </Label>
              <Input
                id="edit-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-notes" className="text-right">
                {language === "en" ? "Notes" : "Notas"}
              </Label>
              <Textarea
                id="edit-notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                setIsEditDialogOpen(false)
              }}
            >
              {language === "en" ? "Cancel" : "Cancelar"}
            </Button>
            <Button onClick={handleEditSupplier}>{language === "en" ? "Save Changes" : "Guardar Cambios"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Supplier Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Delete Supplier" : "Eliminar Proveedor"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              {language === "en"
                ? `Are you sure you want to delete ${currentSupplier?.name}? This action cannot be undone.`
                : `¿Está seguro de que desea eliminar ${currentSupplier?.name}? Esta acción no se puede deshacer.`}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {language === "en" ? "Cancel" : "Cancelar"}
            </Button>
            <Button variant="destructive" onClick={handleDeleteSupplier}>
              {language === "en" ? "Delete" : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
