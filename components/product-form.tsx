"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Upload } from "lucide-react"
import Image from "next/image"
import { AddCategoryDialog } from "@/app/admin/components/add-category-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ProductFormProps {
  product?: any
  onSubmit: (product: any) => void
  categories: string[]
  suppliers: { id: string; name: string }[]
  onSuppliersUpdate?: (suppliers: { id: string; name: string }[]) => void
}

export function ProductForm({ product, onSubmit, categories, suppliers = [], onSuppliersUpdate }: ProductFormProps) {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
    sku: "",
    isNew: false,
    isBestseller: false,
    isActive: true,
    supplierId: "", // Add supplierId field
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [previewImage, setPreviewImage] = useState(product?.image || "")

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price ? product.price.toString() : "",
        category: product.category || "",
        image: product.image || "",
        stock: product.stock ? product.stock.toString() : "",
        sku: product.sku || "",
        isNew: product.isNew || false,
        isBestseller: product.isBestseller || false,
        isActive: product.isActive !== undefined ? product.isActive : true,
        supplierId: product.supplierId || "", // Initialize supplierId
      })
      setPreviewImage(product.image || "")
    }
  }, [product])

  const translations = {
    en: {
      name: "Product Name",
      description: "Description",
      price: "Price",
      category: "Category",
      selectCategory: "Select a category",
      stock: "Stock Quantity",
      sku: "SKU (Stock Keeping Unit)",
      isNew: "Mark as New",
      isActive: "Active",
      image: "Product Image",
      uploadImage: "Upload Image",
      changeImage: "Change Image",
      submit: "Save Product",
      submitting: "Saving...",
      required: "This field is required",
      invalidPrice: "Please enter a valid price",
      selectImage: "Please select an image",
      supplier: "Supplier",
      selectSupplier: "Select a supplier",
    },
    es: {
      name: "Nombre del Producto",
      description: "Descripción",
      price: "Precio",
      category: "Categoría",
      selectCategory: "Selecciona una categoría",
      stock: "Cantidad en Stock",
      sku: "SKU (Unidad de Mantenimiento de Stock)",
      isNew: "Marcar como Nuevo",
      isActive: "Activo",
      image: "Imagen del Producto",
      uploadImage: "Subir Imagen",
      changeImage: "Cambiar Imagen",
      submit: "Guardar Producto",
      submitting: "Guardando...",
      required: "Este campo es obligatorio",
      invalidPrice: "Por favor, introduce un precio válido",
      selectImage: "Por favor, selecciona una imagen",
      supplier: "Proveedor",
      selectSupplier: "Selecciona un proveedor",
    },
  }

  const t = translations[language]

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.price.trim()) newErrors.price = "Price is required"
    if (isNaN(Number.parseFloat(formData.price)) || Number.parseFloat(formData.price) <= 0)
      newErrors.price = "Price must be a positive number"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.image.trim()) newErrors.image = "Image URL is required"
    if (formData.stock && (isNaN(Number.parseInt(formData.stock)) || Number.parseInt(formData.stock) < 0))
      newErrors.stock = "Stock must be a non-negative number"
    if (!formData.supplierId) newErrors.supplierId = "Supplier is required" // Validate supplierId

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (name, value) => {
    if (value === "add-new-category") {
      setShowAddCategory(true)
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Instead of using URL.createObjectURL which creates temporary blob URLs
      // that become invalid after page navigation, we'll use a more persistent approach

      // For a real app, you would upload to a server and get a permanent URL
      // For this demo, we'll convert to a data URL which persists in localStorage
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setPreviewImage(dataUrl)
        setFormData({
          ...formData,
          image: dataUrl,
        })

        // Clear error
        if (errors.image) {
          setErrors({
            ...errors,
            image: "",
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    const processedData = {
      ...formData,
      price: Number.parseFloat(formData.price),
      stock: formData.stock ? Number.parseInt(formData.stock) : 0,
    }

    // If editing, preserve the ID
    if (product) {
      processedData.id = product.id
    }

    onSubmit(processedData)
    setIsSubmitting(false)
  }

  const handleAddCategory = (newCategoryName) => {
    setFormData((prev) => ({
      ...prev,
      category: newCategoryName,
    }))
    setShowAddCategory(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? "border-destructive" : ""}
            />
            {errors.price && <p className="text-destructive text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <div className="flex gap-2">
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger className={`flex-1 ${errors.category ? "border-destructive" : ""}`}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="add-new-category" className="text-primary">
                    <div className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Category
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.category && <p className="text-destructive text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Supplier dropdown */}
          <div>
            <Label htmlFor="supplier">{t.supplier}</Label>
            <Select value={formData.supplierId} onValueChange={(value) => handleSelectChange("supplierId", value)}>
              <SelectTrigger className={`w-full ${errors.supplierId ? "border-destructive" : ""}`}>
                <SelectValue placeholder={t.selectSupplier} />
              </SelectTrigger>
              <SelectContent>
                {/* Always include Delivery Print at the top */}
                <SelectItem value="delivery-print">Delivery Print</SelectItem>

                {/* Map through all suppliers from props */}
                {suppliers &&
                  suppliers.length > 0 &&
                  suppliers
                    .filter((supplier) => supplier.id !== "delivery-print") // Avoid duplicate Delivery Print
                    .map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}

                {/* If no suppliers provided, show some defaults */}
                {(!suppliers || suppliers.length === 0) && (
                  <>
                    <SelectItem value="supplier-1">Premium Print Supplies</SelectItem>
                    <SelectItem value="supplier-2">Creative Materials Co.</SelectItem>
                    <SelectItem value="supplier-3">Quality Print Products</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            {errors.supplierId && <p className="text-destructive text-sm mt-1">{errors.supplierId}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className={errors.image ? "border-destructive" : ""}
            />
            {errors.image && <p className="text-destructive text-sm mt-1">{errors.image}</p>}
          </div>

          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className={errors.stock ? "border-destructive" : ""}
            />
            {errors.stock && <p className="text-destructive text-sm mt-1">{errors.stock}</p>}
          </div>

          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="isNew" className="cursor-pointer">
                Mark as New
              </Label>
              <Switch
                id="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) => handleSwitchChange("isNew", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isBestseller" className="cursor-pointer">
                Mark as Bestseller
              </Label>
              <Switch
                id="isBestseller"
                checked={formData.isBestseller}
                onCheckedChange={(checked) => handleSwitchChange("isBestseller", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive" className="cursor-pointer">
                Active
              </Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
              />
            </div>
          </div>
          <div>
            <Label>
              {t.image} <span className="text-destructive">*</span>
            </Label>
            <div className="mt-2">
              {previewImage ? (
                <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-md border">
                  <Image src={previewImage || "/placeholder.svg"} alt="Product preview" fill className="object-cover" />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => document.getElementById("image-upload").click()}
                  >
                    {t.changeImage}
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image-upload").click()}
                  className={`w-full h-32 flex flex-col items-center justify-center ${
                    errors.image ? "border-destructive" : ""
                  }`}
                >
                  <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                  {t.uploadImage}
                </Button>
              )}
              <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {errors.image && <p className="text-destructive text-sm mt-1">{errors.image}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? "Update Product" : "Add Product"}
        </Button>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new product category for your store.</DialogDescription>
          </DialogHeader>
          <AddCategoryDialog onCategoryAdded={handleAddCategory} />
        </DialogContent>
      </Dialog>
    </form>
  )
}
