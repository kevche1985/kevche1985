"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: Array<"user" | "operator" | "admin">
}

export function ProtectedRoute({ children, allowedRoles = ["user", "operator", "admin"] }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !isLoading) {
      if (!user) {
        router.push("/")
      } else if (user && !allowedRoles.includes(user.role)) {
        // Redirect based on role if they don't have access
        if (user.role === "admin") {
          router.push("/admin/dashboard")
        } else if (user.role === "operator") {
          router.push("/operator/dashboard")
        } else {
          router.push("/my-print/orders")
        }
      }
    }
  }, [user, isLoading, router, allowedRoles, isClient])

  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // For debugging purposes, show who's logged in
  if (user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="mb-4">You don't have permission to access this page.</p>
        <p className="text-sm text-muted-foreground">
          Logged in as: {user.name} ({user.email}) - Role: {user.role}
        </p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Login Required</h2>
        <p>Please log in to access this page.</p>
      </div>
    )
  }

  return <>{children}</>
}
