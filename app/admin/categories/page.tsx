"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, MoreVertical, Plus, Search, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CategoryForm } from "@/components/category-form"

// Mock category data - in a real app, this would come from an API
const initialCategories = [
  {
    id: "cat1",
    name: "Business Cards",
    slug: "business-cards",
    description: "Professional business cards for all occasions",
    productCount: 3,
  },
  {
    id: "cat2",
    name: "T-Shirts",
    slug: "t-shirts",
    description: "Custom printed t-shirts and apparel",
    productCount: 3,
  },
  {
    id: "cat3",
    name: "Mugs",
    slug: "mugs",
    description: "Personalized mugs and drinkware",
    productCount: 3,
  },
  {
    id: "cat4",
    name: "Posters",
    slug: "posters",
    description: "High-quality printed posters and art prints",
    productCount: 6,
  },
  {
    id: "cat5",
    name: "Flyers",
    slug: "flyers",
    description: "Marketing flyers and promotional materials",
    productCount: 3,
  },
]

export default function CategoriesManagementPage() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const [categories, setCategories] = useState(initialCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  const translations = {
    en: {
      title: "Category Management",
      description: "Add, edit, and manage your product categories",
      addCategory: "Add Category",
      search: "Search categories...",
      id: "ID",
      name: "Name",
      slug: "Slug",
      description: "Description",
      products: "Products",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      deleteConfirmTitle: "Delete Category",
      deleteConfirmMessage:
        "Are you sure you want to delete this category? This may affect products assigned to this category.",
      cancel: "Cancel",
      confirm: "Confirm",
      categoryAdded: "Category added successfully",
      categoryUpdated: "Category updated successfully",
      categoryDeleted: "Category deleted successfully",
    },
    es: {
      title: "Gestión de Categorías",
      description: "Añadir, editar y gestionar tus categorías de productos",
      addCategory: "Añadir Categoría",
      search: "Buscar categorías...",
      id: "ID",
      name: "Nombre",
      slug: "Slug",
      description: "Descripción",
      products: "Productos",
      actions: "Acciones",
      edit: "Editar",
      delete: "Eliminar",
      deleteConfirmTitle: "Eliminar Categoría",
      deleteConfirmMessage:
        "¿Estás seguro de que quieres eliminar esta categoría? Esto puede afectar a los productos asignados a esta categoría.",
      cancel: "Cancelar",
      confirm: "Confirmar",
      categoryAdded: "Categoría añadida con éxito",
      categoryUpdated: "Categoría actualizada con éxito",
      categoryDeleted: "Categoría eliminada con éxito",
    },
  }

  const t = translations[language]

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) => {
    return (
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleAddCategory = (newCategory) => {
    // Generate a simple ID and slug (in a real app, this would be done on the server)
    const id = `cat-${Date.now()}`
    const slug = newCategory.name.toLowerCase().replace(/\s+/g, "-")
    setCategories([...categories, { ...newCategory, id, slug, productCount: 0 }])
    setIsAddCategoryOpen(false)
    toast({
      title: t.categoryAdded,
      description: newCategory.name,
    })
  }

  const handleUpdateCategory = (updatedCategory) => {
    setCategories(categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)))
    setEditingCategory(null)
    toast({
      title: t.categoryUpdated,
      description: updatedCategory.name,
    })
  }

  const handleDeleteCategory = () => {
    if (!categoryToDelete) return

    setCategories(categories.filter((c) => c.id !== categoryToDelete.id))
    setDeleteConfirmOpen(false)
    setCategoryToDelete(null)
    toast({
      title: t.categoryDeleted,
      description: categoryToDelete.name,
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
          <Button onClick={() => setIsAddCategoryOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> {t.addCategory}
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.name}</TableHead>
                <TableHead>{t.slug}</TableHead>
                <TableHead>{t.description}</TableHead>
                <TableHead>{t.products}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{category.productCount}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            {t.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setCategoryToDelete(category)
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

        {/* Add Category Dialog */}
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.addCategory}</DialogTitle>
              <DialogDescription>Fill in the details to add a new product category.</DialogDescription>
            </DialogHeader>
            <CategoryForm onSubmit={handleAddCategory} />
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.edit}</DialogTitle>
              <DialogDescription>Update the category details.</DialogDescription>
            </DialogHeader>
            {editingCategory && <CategoryForm category={editingCategory} onSubmit={handleUpdateCategory} />}
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
              <Button variant="destructive" onClick={handleDeleteCategory}>
                {t.confirm}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
