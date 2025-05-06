"use client"

import type React from "react"
import { Mail } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav>
          <Link
            href="/admin"
            className={`flex items-center p-2 rounded-lg ${
              pathname === "/admin" ? "bg-gray-700" : ""
            } hover:bg-gray-700`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
              <path
                fillRule="evenodd"
                d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm12 1.5a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5zM6.75 7.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM6 12a1.5 1.5 0 011.5-1.5h9a1.5 1.5 0 011.5 1.5v4.5a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5V12z"
                clipRule="evenodd"
              />
            </svg>
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/email-settings"
            className={`flex items-center p-2 rounded-lg ${
              pathname === "/admin/email-settings" ? "bg-gray-700" : ""
            } hover:bg-gray-700`}
          >
            <Mail className="w-5 h-5 mr-2" />
            <span>Email Settings</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  )
}
