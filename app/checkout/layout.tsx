import type React from "react"
import { PaymentMethodProvider } from "@/context/payment-method-context"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PaymentMethodProvider>{children}</PaymentMethodProvider>
}
