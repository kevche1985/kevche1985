"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"

export default function Footer() {
  const { language } = useContext(LanguageContext) || { language: "es" }

  const content = {
    en: {
      products: {
        title: "Products",
        items: ["Apparel", "Drinkware", "Wall Art", "Home & Living", "Accessories"],
      },
      company: {
        title: "Company",
        items: ["About Us", "Careers", "Blog", "Press", "Partners"],
      },
      contact: {
        title: "Contact",
        address: "145 Colonia Escalon, San Salvador",
        phone: "2556-5113",
        email: "info@groupdeliveryprint.com",
      },
      legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
      copyright: "© 2025 PrintOnDemand. All rights reserved.",
    },
    es: {
      products: {
        title: "Productos",
        items: ["Ropa", "Tazas", "Arte de Pared", "Hogar", "Accesorios"],
      },
      company: {
        title: "Empresa",
        items: ["Nosotros", "Carreras", "Blog", "Prensa", "Socios"],
      },
      contact: {
        title: "Contacto",
        address: "145 Colonia Escalon, San Salvador",
        phone: "2556-5113",
        email: "info@groupdeliveryprint.com",
      },
      legal: ["Política de Privacidad", "Términos de Servicio", "Política de Cookies"],
      copyright: "© 2025 PrintOnDemand. Todos los derechos reservados.",
    },
  }

  const t = language === "en" ? content.en : content.es

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/logo-print.png" alt="PrintOnDemand Logo" className="h-8 w-8" />
              <span className="text-xl font-bold gradient-text">PrintOnDemand</span>
            </Link>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Premium print-on-demand services for businesses and individuals. High-quality printing, fast delivery, and exceptional customer service."
                : "Servicios premium de impresión bajo demanda para empresas e individuos. Impresión de alta calidad, entrega rápida y servicio al cliente excepcional."}
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.products.title}</h3>
            <ul className="space-y-2">
              {t.products.items.map((item) => (
                <li key={item}>
                  <Link
                    href={`/products?category=${item
                      .toLowerCase()
                      .replace(/\s+&\s+/g, "-")
                      .replace(/\s+/g, "-")}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.company.title}</h3>
            <ul className="space-y-2">
              {t.company.items.map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.contact.title}</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">{t.contact.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <Link href="tel:25565113" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.contact.phone}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <Link
                  href="mailto:info@groupdeliveryprint.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.contact.email}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">{t.copyright}</p>
          <div className="flex gap-4 text-sm">
            {t.legal.map((item) => (
              <Link key={item} href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
