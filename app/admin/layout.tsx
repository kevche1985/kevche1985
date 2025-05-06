"use client"

import { ProductProvider } from "@/context/product-context"
import { Settings, ShoppingBag, FileText, Users, LayoutDashboard } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <div className="w-64 bg-gray-800 border-r border-gray-700 text-white">
        <nav className="p-4">
          <Link href="/admin/dashboard" className="block p-2 hover:bg-gray-700 rounded">
            <div className="flex items-center">
              <LayoutDashboard className="h-5 w-5 mr-2" />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link href="/admin/products" className="block p-2 hover:bg-gray-700 rounded">
            <div className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              <span>Products</span>
            </div>
          </Link>
          <Link href="/admin/quotes" className="block p-2 hover:bg-gray-700 rounded">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              <span>Quotes</span>
            </div>
          </Link>
          <Link href="/admin/users" className="block p-2 hover:bg-gray-700 rounded">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>Users</span>
            </div>
          </Link>
          <Link href="/admin/system" className="block p-2 hover:bg-gray-700 rounded">
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              <span>System</span>
            </div>
          </Link>
        </nav>
      </div>
      <div className="flex-1 p-4">
        <ProductProvider>{children}</ProductProvider>
      </div>
    </div>
  )
}
