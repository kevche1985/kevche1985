"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ContactForm } from "@/components/contact-form"
import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { Button } from "@/components/ui/button"

interface ContactModalProps {
  trigger?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ContactModal({
  trigger,
  isOpen: controlledIsOpen,
  onOpenChange: setControlledIsOpen,
}: ContactModalProps) {
  const { language } = useContext(LanguageContext) || { language: "en" }
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false)

  const isControlled = controlledIsOpen !== undefined && setControlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen
  const setIsOpen = isControlled ? setControlledIsOpen : setUncontrolledIsOpen

  const t = {
    title: language === "en" ? "Contact Us" : "Contáctenos",
    description:
      language === "en"
        ? "Have a question or need assistance? Send us a message and we'll get back to you as soon as possible."
        : "¿Tiene alguna pregunta o necesita ayuda? Envíenos un mensaje y nos pondremos en contacto con usted lo antes posible.",
    defaultTrigger: language === "en" ? "Contact Us" : "Contáctenos",
  }

  const handleSuccess = () => {
    // Close the modal after successful submission
    setTimeout(() => {
      setIsOpen(false)
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button>{t.defaultTrigger}</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        <ContactForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
