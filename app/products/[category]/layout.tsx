import type React from "react"
import type { Metadata } from "next"
import ProductLayoutClient from "./ProductLayoutClient"

export const metadata: Metadata = {
  title: "Products - Print On Demand",
  description: "Browse our collection of print on demand products",
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProductLayoutClient>{children}</ProductLayoutClient>
}
