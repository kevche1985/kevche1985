import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Products - Print On Demand",
  description: "Browse our collection of print on demand products",
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen">{children}</div>
}
