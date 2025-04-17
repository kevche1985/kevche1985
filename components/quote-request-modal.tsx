"use client"

import type React from "react"

import { useState } from "react"
import { X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface QuoteRequestModalProps {
  isOpen: boolean
  onClose: () => void
  serviceType: string
}

export function QuoteRequestModal({ isOpen, onClose, serviceType }: QuoteRequestModalProps) {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const translations = {
    en: {
      title: "Request a Quote",
      name: "Full Name",
      company: "Company Name",
      email: "Email Address",
      phone: "Phone Number",
      details: "Project Details",
      service: "Service Type",
      submit: "Submit Quote Request",
      submitting: "Submitting...",
      success: "Quote request submitted successfully!",
      error: "There was an error submitting your request. Please try again.",
      close: "Close",
      processInfo: "Quote Request Process:",
      processSteps: [
        "Our operator will review your request",
        "You'll receive a response with pricing and details",
        "Additional files may be attached if needed",
        "You may be contacted for more information",
        "Once approved, the quote will be converted to an order",
      ],
      quoteId: "Your quote request will be assigned a unique ID for tracking",
    },
    es: {
      title: "Solicitar Cotización",
      name: "Nombre Completo",
      company: "Nombre de la Empresa",
      email: "Correo Electrónico",
      phone: "Número de Teléfono",
      details: "Detalles del Proyecto",
      service: "Tipo de Servicio",
      submit: "Enviar Solicitud de Cotización",
      submitting: "Enviando...",
      success: "¡Solicitud de cotización enviada con éxito!",
      error: "Hubo un error al enviar su solicitud. Por favor, inténtelo de nuevo.",
      close: "Cerrar",
      processInfo: "Proceso de Solicitud de Cotización:",
      processSteps: [
        "Nuestro operador revisará su solicitud",
        "Recibirá una respuesta con precios y detalles",
        "Se pueden adjuntar archivos adicionales si es necesario",
        "Es posible que lo contactemos para obtener más información",
        "Una vez aprobada, la cotización se convertirá en un pedido",
      ],
      quoteId: "A su solicitud de cotización se le asignará un ID único para seguimiento",
    },
  }

  const t = language === "en" ? translations.en : translations.es

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success
      toast({
        title: t.success,
        description: `Quote ID: QT-${Date.now().toString().slice(-6)}`,
      })
      onClose()
    } catch (error) {
      // Error
      toast({
        title: t.error,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-white hover:bg-gray-700"
          aria-label={t.close}
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-4 text-2xl font-bold">{t.title}</h2>

        <Alert className="mb-4 bg-gray-700 border-blue-400">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-gray-200 text-sm">
            <p className="font-medium mb-2">{t.processInfo}</p>
            <ul className="list-disc pl-5 space-y-1">
              {t.processSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
            <p className="mt-2 italic">{t.quoteId}</p>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-200">
              {t.name} *
            </label>
            <Input
              id="name"
              name="name"
              required
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="company" className="mb-1 block text-sm font-medium text-gray-200">
              {t.company}
            </label>
            <Input
              id="company"
              name="company"
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-200">
              {t.email} *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-200">
              {t.phone} *
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="service" className="mb-1 block text-sm font-medium text-gray-200">
              {t.service}
            </label>
            <Input
              id="service"
              name="service"
              value={serviceType}
              readOnly
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="details" className="mb-1 block text-sm font-medium text-gray-200">
              {t.details}
            </label>
            <Textarea
              id="details"
              name="details"
              rows={4}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
            {isSubmitting ? t.submitting : t.submit}
          </Button>
        </form>
      </div>
    </div>
  )
}
