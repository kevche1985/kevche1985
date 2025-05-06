"use client"

import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "user" | "operator" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Regular User",
    email: "user@example.com",
    role: "user",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "operator-1",
    name: "Operator User",
    email: "operator@example.com",
    role: "operator",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user with matching email
      const foundUser = mockUsers.find((u) => u.email === email)

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      // In a real app, you would verify the password here
      // For demo purposes, we'll just check if password is "password"
      if (password !== "password") {
        throw new Error("Invalid email or password")
      }

      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))

      // Redirect based on role
      if (foundUser.role === "admin") {
        router.push("/admin/dashboard")
      } else if (foundUser.role === "operator") {
        router.push("/operator/dashboard")
      } else {
        router.push("/my-print/orders")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      if (mockUsers.some((u) => u.email === email)) {
        throw new Error("User already exists")
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: "user", // New users are always regular users
        avatar: "/placeholder.svg?height=40&width=40",
      }

      // In a real app, you would save the user to your database here
      mockUsers.push(newUser)

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      router.push("/my-print/orders")
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user exists
      const foundUser = mockUsers.find((u) => u.email === email)
      if (!foundUser) {
        throw new Error("User not found")
      }

      // In a real app, you would send a password reset email here
      console.log(`Password reset email sent to ${email}`)
    } catch (error) {
      console.error("Forgot password error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthContext }
