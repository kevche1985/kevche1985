"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface CategoryFormProps {
  category?: any
  onSubmit: (category: any) => void
}

export function CategoryForm({ category, onSubmit }: CategoryFormProps) {
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
  })

  const [errors, setErrors] = useState({
    name: "",
  })

  const translations = {
    en: {
      name: "Category Name",
      description: "Description",
      submit: "Save Category",
      submitting: "Saving...",
      required: "This field is required",
    },
    es: {
      name: "Nombre de la Categoría",
      description: "Descripción",
      submit: "Guardar Categoría",
      submitting: "Guardando...",
      required: "Este campo es obligatorio",
    },
  }

  const t = translations[language]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {
      name: !formData.name ? t.required : "",
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // In a real app, you would send the data to an API
      // For this demo, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSubmit({
        ...formData,
        id: category?.id,
        slug: category?.slug,
        productCount: category?.productCount || 0,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">
          {t.name} <span className="text-destructive">*</span>
        </Label>
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
        <Label htmlFor="description">{t.description}</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.submitting}
            </>
          ) : (
            t.submit
          )}
        </Button>
      </div>
    </form>
  )
}
