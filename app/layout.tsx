import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { LanguageProvider } from "@/context/language-context"
import { CartProvider } from "@/context/cart-context"
import { OrderProvider } from "@/context/order-context"
import { AuthProvider } from "@/context/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Delivery On Demand - Print Services",
  description: "Quality print on demand services for your business",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <OrderProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <Toaster />
              </OrderProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}


import './globals.css'