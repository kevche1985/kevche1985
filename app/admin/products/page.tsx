"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/language-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, MoreVertical, Plus, Eye, EyeOff, Search, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ProductForm } from "@/components/product-form"
import { useProducts } from "@/context/product-context"
import { AddCategoryDialog } from "../components/add-category-dialog"
import Image from "next/image"

export default function ProductsManagementPage() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const { products, addProduct, updateProduct, deleteProduct, toggleProductStatus, categories } = useProducts()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showInactive, setShowInactive] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  // Add suppliers state
  const [suppliers, setSuppliers] = useState([
    { id: "delivery-print", name: "Delivery Print" },
    { id: "supplier-1", name: "Premium Print Supplies" },
    { id: "supplier-2", name: "Creative Materials Co." },
    { id: "supplier-3", name: "Quality Print Products" },
    { id: "supplier-4", name: "Eco-Friendly Print Solutions" },
    { id: "supplier-5", name: "Digital Print Materials" },
  ])

  // Fetch suppliers on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    // Example:
    // const fetchSuppliers = async () => {
    //   try {
    //     const response = await fetch('/api/suppliers');
    //     const data = await response.json();
    //     if (data.success) {
    //       setSuppliers(data.suppliers);
    //     }
    //   } catch (error) {
    //     console.error('Failed to fetch suppliers:', error);
    //   }
    // };
    // fetchSuppliers();

    // For now, try to load from localStorage
    try {
      const savedSuppliers = localStorage.getItem("suppliers")
      if (savedSuppliers) {
        const parsedSuppliers = JSON.parse(savedSuppliers)
        // Merge with existing suppliers, avoiding duplicates
        const combinedSuppliers = [...suppliers]

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

  const translations = {
    en: {
      title: "Product Management",
      description: "Add, edit, and manage your products",
      addProduct: "Add Product",
      search: "Search products...",
      filter: "Filter by Category",
      allCategories: "All Categories",
      showInactive: "Show Inactive Products",
      id: "ID",
      image: "Image",
      name: "Name",
      category: "Category",
      price: "Price",
      stock: "Stock",
      status: "Status",
      actions: "Actions",
      active: "Active",
      inactive: "Inactive",
      edit: "Edit",
      view: "View",
      delete: "Delete",
      toggleStatus: "Toggle Status",
      deleteConfirmTitle: "Delete Product",
      deleteConfirmMessage: "Are you sure you want to delete this product? This action cannot be undone.",
      cancel: "Cancel",
      confirm: "Confirm",
      productAdded: "Product added successfully",
      productUpdated: "Product updated successfully",
      productDeleted: "Product deleted successfully",
      statusChanged: "Product status changed successfully",
    },
    es: {
      title: "Gestión de Productos",
      description: "Añadir, editar y gestionar tus productos",
      addProduct: "Añadir Producto",
      search: "Buscar productos...",
      filter: "Filtrar por Categoría",
      allCategories: "Todas las Categorías",
      showInactive: "Mostrar Productos Inactivos",
      id: "ID",
      image: "Imagen",
      name: "Nombre",
      category: "Categoría",
      price: "Precio",
      stock: "Stock",
      status: "Estado",
      actions: "Acciones",
      active: "Activo",
      inactive: "Inactivo",
      edit: "Editar",
      view: "Ver",
      delete: "Eliminar",
      toggleStatus: "Cambiar Estado",
      deleteConfirmTitle: "Eliminar Producto",
      deleteConfirmMessage: "¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.",
      cancel: "Cancelar",
      confirm: "Confirmar",
      productAdded: "Producto añadido con éxito",
      productUpdated: "Producto actualizado con éxito",
      productDeleted: "Producto eliminado con éxito",
      statusChanged: "Estado del producto cambiado con éxito",
    },
  }

  const t = translations[language]

  // Get unique categories from products
  const categoryOptions = ["All", ...categories]

  // Filter products based on search term, category, and active status
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesStatus = showInactive ? true : product.isActive

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleAddProduct = (newProduct) => {
    // Generate a simple ID (in a real app, this would be done on the server)
    const id = `prod-${Date.now()}`
    addProduct({ ...newProduct, id })
    setIsAddProductOpen(false)
    toast({
      title: t.productAdded,
      description: newProduct.name,
    })
  }

  const handleUpdateProduct = (updatedProduct) => {
    updateProduct(updatedProduct)
    setEditingProduct(null)
    toast({
      title: t.productUpdated,
      description: updatedProduct.name,
    })
  }

  const handleDeleteProduct = () => {
    if (!productToDelete) return

    deleteProduct(productToDelete.id)
    setDeleteConfirmOpen(false)
    setProductToDelete(null)
    toast({
      title: t.productDeleted,
      description: productToDelete.name,
    })
  }

  const handleToggleStatus = (product) => {
    toggleProductStatus(product.id)
    toast({
      title: t.statusChanged,
      description: `${product.name} is now ${product.isActive ? t.inactive : t.active}`,
    })
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "operator"]}>
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="text-muted-foreground">{t.description}</p>
          </div>
          <div className="flex gap-2">
            <AddCategoryDialog />
            <Button onClick={() => setIsAddProductOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> {t.addProduct}
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  {t.filter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categoryOptions.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-muted" : ""}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              onClick={() => setShowInactive(!showInactive)}
              className={showInactive ? "bg-muted" : ""}
            >
              {showInactive ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {t.showInactive}
            </Button>
          </div>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">{t.image}</TableHead>
                <TableHead>{t.name}</TableHead>
                <TableHead>{t.category}</TableHead>
                <TableHead>{t.price}</TableHead>
                <TableHead>{t.stock}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-10 w-10 rounded overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? t.active : t.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            {t.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${product.category.toLowerCase()}/${product.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              {t.view}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(product)}>
                            {product.isActive ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                            {t.toggleStatus}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setProductToDelete(product)
                              setDeleteConfirmOpen(true)
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add Product Dialog */}
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.addProduct}</DialogTitle>
              <DialogDescription>Fill in the details to add a new product to your catalog.</DialogDescription>
            </DialogHeader>
            <ProductForm
              onSubmit={handleAddProduct}
              categories={categoryOptions.filter((c) => c !== "All")}
              suppliers={suppliers}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.edit}</DialogTitle>
              <DialogDescription>Update the product details.</DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <ProductForm
                product={editingProduct}
                onSubmit={handleUpdateProduct}
                categories={categoryOptions.filter((c) => c !== "All")}
                suppliers={suppliers}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.deleteConfirmTitle}</DialogTitle>
              <DialogDescription>{t.deleteConfirmMessage}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                {t.cancel}
              </Button>
              <Button variant="destructive" onClick={handleDeleteProduct}>
                {t.confirm}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
