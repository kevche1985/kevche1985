"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Upload, AlertCircle } from "lucide-react"
import Image from "next/image"
import { AddCategoryDialog } from "@/app/admin/components/add-category-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useDbConnection } from "@/hooks/use-db-connection"

interface ProductFormProps {
  product?: any
  onSubmit: (product: any) => void
  categories: string[]
  suppliers: { id: string; name: string }[]
  onSuppliersUpdate?: (suppliers: { id: string; name: string }[]) => void
}

export function ProductForm({ product, onSubmit, categories, suppliers = [], onSuppliersUpdate }: ProductFormProps) {
  const { language } = useLanguage()
  const { toast } = useToast()
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
    supplierId: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [previewImage, setPreviewImage] = useState(product?.image || "")
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [useFallback, setUseFallback] = useState(false)
  const [progressMessage, setProgressMessage] = useState("")

  const { status: dbStatus, ensureConnection } = useDbConnection()

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
        supplierId: product.supplierId || "",
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
      isActiveTooltip: "When inactive, the product will be hidden from the product gallery and product view",
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
      retrying: "Retrying submission...",
      usingFallback: "Using local storage fallback...",
      databaseTimeout: "Database operation timed out. Your changes will be saved locally.",
      tryAgain: "Try Again",
      useFallback: "Use Local Storage",
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
      isActiveTooltip:
        "Cuando está inactivo, el producto se ocultará de la galería de productos y la vista de producto",
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
      retrying: "Reintentando envío...",
      usingFallback: "Usando almacenamiento local...",
      databaseTimeout: "La operación de base de datos agotó el tiempo de espera. Tus cambios se guardarán localmente.",
      tryAgain: "Intentar de nuevo",
      useFallback: "Usar almacenamiento local",
    },
  }

  const t = translations[language]

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.price.trim()) newErrors.price = "Price is required"
    if (isNaN(Number.parseFloat(formData.price)) || Number.parseFloat(formData.price) <= 0)
      newErrors.price = "Price must be a positive number"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.supplierId) newErrors.supplierId = "Supplier is required"

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
      // Check file size - limit to 1MB
      if (file.size > 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 1MB",
        }))
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        // Optimize by checking if the image is too large
        if (dataUrl.length > 500000) {
          // If image is large, we'll use a compressed version or URL instead
          setPreviewImage(URL.createObjectURL(file))
          setFormData((prev) => ({
            ...prev,
            image: URL.createObjectURL(file),
          }))
        } else {
          setPreviewImage(dataUrl)
          setFormData((prev) => ({
            ...prev,
            image: dataUrl,
          }))
        }

        // Clear error
        if (errors.image) {
          setErrors((prev) => ({
            ...prev,
            image: "",
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitError(null)
    setProgressMessage("Processing your request...")

    // Ensure database connection is active before submitting
    try {
      // Try to ensure we have an active connection
      await ensureConnection()

      // Prepare the product data
      const processedData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: formData.stock ? Number.parseInt(formData.stock) : 0,
      }

      // If editing, preserve the ID and other required fields
      if (product) {
        processedData.id = product.id
        if (product.createdAt) processedData.createdAt = product.createdAt
      }

      // Set up progress indicator
      const progressInterval = setInterval(() => {
        setProgressMessage((prev) => {
          if (prev.endsWith("...")) return "Processing your request"
          return prev + "."
        })
      }, 800)

      try {
        if (useFallback) {
          // Use local storage directly if fallback mode is enabled
          const savedProduct = await saveToLocalStorage(processedData)
          clearInterval(progressInterval)
          setIsSubmitting(false)
          return
        }

        // Set a much longer timeout for database operations
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Database operation timed out")), 60000) // 60 seconds
        })

        // Try to submit with a timeout
        await Promise.race([onSubmit(processedData), timeoutPromise])

        // If successful, clear any previous errors
        setSubmitError(null)
        setRetryCount(0)

        // Show success toast
        toast({
          title: "Product saved",
          description: "Your product has been saved successfully.",
        })
      } catch (error) {
        console.error("Error submitting product form:", error)

        // Handle the error
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        setSubmitError(errorMessage)

        // If it's a timeout error, offer fallback option
        if (errorMessage.includes("timed out")) {
          toast({
            title: "Database connection issue",
            description: "Would you like to save your changes locally instead?",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error saving product",
            description: errorMessage,
            variant: "destructive",
          })
        }
      } finally {
        clearInterval(progressInterval)
        setIsSubmitting(false)
        setProgressMessage("")
      }
    } catch (error) {
      console.error("Failed to establish database connection:", error)
      setSubmitError("Failed to establish database connection. Your changes will be saved locally.")
      await saveToLocalStorage({
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: formData.stock ? Number.parseInt(formData.stock) : 0,
        id: product?.id,
        createdAt: product?.createdAt,
      })
      setIsSubmitting(false)
      setProgressMessage("")
    }
  }

  // Function to save product to local storage as fallback
  const saveToLocalStorage = async (productData) => {
    try {
      setProgressMessage("Saving to local storage...")

      // Generate a unique ID if this is a new product
      const productId = product?.id || `local-${Date.now()}`
      const timestamp = new Date().toISOString()

      const localProduct = {
        ...productData,
        id: productId,
        updatedAt: timestamp,
        createdAt: product?.createdAt || timestamp,
      }

      // Get existing products from localStorage
      const existingProductsJson = localStorage.getItem("products")
      const existingProducts = existingProductsJson ? JSON.parse(existingProductsJson) : []

      // Update or add the product
      const updatedProducts = product?.id
        ? existingProducts.map((p) => (p.id === product.id ? localProduct : p))
        : [...existingProducts, localProduct]

      // Save back to localStorage
      localStorage.setItem("products", JSON.stringify(updatedProducts))

      // Show success message
      toast({
        title: "Product saved locally",
        description: "The product has been saved to your browser's local storage.",
      })

      return localProduct
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      throw new Error("Failed to save product locally")
    }
  }

  const handleRetry = async () => {
    setRetryCount((prev) => prev + 1)
    setSubmitError(null)
    setIsSubmitting(true)
    setProgressMessage(`Retry attempt ${retryCount + 1}...`)

    // Prepare the product data
    const processedData = {
      ...formData,
      price: Number.parseFloat(formData.price),
      stock: formData.stock ? Number.parseInt(formData.stock) : 0,
    }

    // If editing, preserve the ID and other required fields
    if (product) {
      processedData.id = product.id
      if (product.createdAt) processedData.createdAt = product.createdAt
    }

    try {
      // Try with an even longer timeout for retries
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Database operation timed out")), 90000) // 90 seconds
      })

      // Try to submit with a timeout
      await Promise.race([onSubmit(processedData), timeoutPromise])

      // If successful, clear any previous errors
      setSubmitError(null)
      setRetryCount(0)

      // Show success toast
      toast({
        title: "Product saved",
        description: "Your product has been saved successfully on retry.",
      })
    } catch (error) {
      console.error("Error retrying product submission:", error)

      // Handle the error
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setSubmitError(errorMessage)

      // If we've tried multiple times, suggest using the fallback
      if (retryCount >= 2) {
        toast({
          title: "Multiple failures",
          description: "Would you like to save your changes locally instead?",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Retry failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
      setProgressMessage("")
    }
  }

  const handleUseFallback = async () => {
    setUseFallback(true)

    // Prepare the product data
    const processedData = {
      ...formData,
      price: Number.parseFloat(formData.price),
      stock: formData.stock ? Number.parseInt(formData.stock) : 0,
    }

    // If editing, preserve the ID and other required fields
    if (product) {
      processedData.id = product.id
      if (product.createdAt) processedData.createdAt = product.createdAt
    }

    try {
      await saveToLocalStorage(processedData)
      setSubmitError(null)
    } catch (error) {
      console.error("Error using fallback:", error)
      setSubmitError("Failed to save locally. Please try again.")
      toast({
        title: "Error",
        description: "Failed to save product locally.",
        variant: "destructive",
      })
    }
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
      {submitError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {submitError}
            <div className="mt-4 flex space-x-4">
              <Button type="button" variant="outline" onClick={handleRetry} disabled={isSubmitting || retryCount >= 3}>
                {t.tryAgain} {retryCount > 0 && `(${retryCount}/3)`}
              </Button>
              <Button type="button" variant="default" onClick={handleUseFallback} disabled={isSubmitting}>
                {t.useFallback}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label htmlFor="isActive" className="cursor-pointer">
                      {t.isActive}
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t.isActiveTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
              />
            </div>
            <p className="text-sm text-muted-foreground">{t.isActiveTooltip}</p>
          </div>
          <div>
            <Label>{t.image}</Label>
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
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <div
          className={`w-2 h-2 rounded-full ${
            dbStatus === "connected" ? "bg-green-500" : dbStatus === "connecting" ? "bg-amber-500" : "bg-red-500"
          }`}
        />
        <span>
          {dbStatus === "connected"
            ? "Database connected"
            : dbStatus === "connecting"
              ? "Connecting to database..."
              : "Database disconnected"}
        </span>
      </div>

      <div className="flex flex-col space-y-2">
        {progressMessage && <p className="text-sm text-amber-600">{progressMessage}</p>}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? t.submitting : product ? "Update Product" : "Add Product"}
          </Button>
        </div>
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
