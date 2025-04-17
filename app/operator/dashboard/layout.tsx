"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"

export default function OperatorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["operator", "admin"]}>
      <div className="min-h-screen bg-background py-8 px-4 md:px-8">{children}</div>
    </ProtectedRoute>
  )
}
