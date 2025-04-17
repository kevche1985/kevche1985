"use client"

import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash, Copy } from "lucide-react"
import Image from "next/image"

export default function MyDesignsPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }

  const content = {
    en: {
      title: "My Designs",
      subtitle: "Manage your saved designs and templates",
      noDesigns: "You don't have any saved designs yet.",
      createNew: "Create New Design",
      actions: {
        edit: "Edit",
        duplicate: "Duplicate",
        delete: "Delete",
        print: "Print",
      },
    },
    es: {
      title: "Mis Diseños",
      subtitle: "Administra tus diseños y plantillas guardados",
      noDesigns: "Aún no tienes diseños guardados.",
      createNew: "Crear Nuevo Diseño",
      actions: {
        edit: "Editar",
        duplicate: "Duplicar",
        delete: "Eliminar",
        print: "Imprimir",
      },
    },
  }

  const t = language === "en" ? content.en : content.es

  // Mock designs data - in a real app, this would come from an API
  const designs = [
    {
      id: "design-1",
      name: "Business Card Design",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Business+Card",
      lastEdited: "2025-03-01",
    },
    {
      id: "design-2",
      name: "Logo Design",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Logo",
      lastEdited: "2025-03-05",
    },
    {
      id: "design-3",
      name: "Flyer Design",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Flyer",
      lastEdited: "2025-03-10",
    },
  ]

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t.createNew}
          </Button>
        </div>

        {designs.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <p className="mb-4">{t.noDesigns}</p>
              <Button>{t.createNew}</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <Card key={design.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image src={design.thumbnail || "/placeholder.svg"} alt={design.name} fill className="object-cover" />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-medium">{design.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Last edited: " : "Última edición: "}
                    {new Date(design.lastEdited).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between gap-2 flex-wrap">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    {t.actions.edit}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-1" />
                    {t.actions.duplicate}
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive">
                    <Trash className="h-4 w-4 mr-1" />
                    {t.actions.delete}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
