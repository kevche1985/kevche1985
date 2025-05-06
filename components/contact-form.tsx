"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { submitContactForm } from "@/app/actions/contact-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/language-context"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  subject: z.string().min(2, { message: "Subject must be at least 2 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

interface ContactFormProps {
  onSuccess?: () => void
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const translations = {
    en: {
      name: "Name",
      email: "Email",
      phone: "Phone (optional)",
      subject: "Subject",
      message: "Message",
      submit: "Submit",
      submitting: "Submitting...",
      successTitle: "Message Sent",
      successDescription: "Thank you for your message. We'll get back to you soon.",
      errorTitle: "Error",
      errorDescription: "There was a problem sending your message. Please try again.",
      devModeTitle: "Development Mode",
      devModeDescription: "Message would be sent in production environment.",
    },
    es: {
      name: "Nombre",
      email: "Correo electrónico",
      phone: "Teléfono (opcional)",
      subject: "Asunto",
      message: "Mensaje",
      submit: "Enviar",
      submitting: "Enviando...",
      successTitle: "Mensaje Enviado",
      successDescription: "Gracias por tu mensaje. Te responderemos pronto.",
      errorTitle: "Error",
      errorDescription: "Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.",
      devModeTitle: "Modo Desarrollo",
      devModeDescription: "El mensaje se enviaría en un entorno de producción.",
    },
  }

  const t2 = translations[language as keyof typeof translations]

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      const result = await submitContactForm(formData)

      if (result.success) {
        // Check if we're in development mode
        if (result.development) {
          toast({
            title: t2.devModeTitle,
            description: t2.devModeDescription,
          })
        } else {
          toast({
            title: t2.successTitle,
            description: t2.successDescription,
          })
        }

        form.reset()
        if (onSuccess) onSuccess()
      } else {
        const errorMessages = result.errors
          ? Object.entries(result.errors)
              .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
              .join("\n")
          : t2.errorDescription

        toast({
          variant: "destructive",
          title: t2.errorTitle,
          description: errorMessages,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t2.errorTitle,
        description: t2.errorDescription,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t2.name}</FormLabel>
              <FormControl>
                <Input placeholder={t2.name} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t2.email}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t2.email} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t2.phone}</FormLabel>
              <FormControl>
                <Input type="tel" placeholder={t2.phone} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t2.subject}</FormLabel>
              <FormControl>
                <Input placeholder={t2.subject} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t2.message}</FormLabel>
              <FormControl>
                <Textarea placeholder={t2.message} className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t2.submitting : t2.submit}
        </Button>
      </form>
    </Form>
  )
}
