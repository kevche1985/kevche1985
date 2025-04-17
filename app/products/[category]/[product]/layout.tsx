import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Product Detail - Print On Demand",
  description: "Customize and order your print on demand product",
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen">{children}</div>
}
