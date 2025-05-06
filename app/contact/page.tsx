"use client"

import { useEffect, useState } from "react"
import { ContactModal } from "@/components/contact-modal"
import { useRouter } from "next/navigation"

export default function ContactPage() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Open the modal when the page loads
    setIsOpen(true)
  }, [])

  // Handle modal close
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      // Redirect back to home page when modal is closed
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ContactModal isOpen={isOpen} onOpenChange={handleOpenChange} />
    </div>
  )
}
