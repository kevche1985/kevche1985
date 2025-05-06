"use client"

import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"

export type UserRole = "user" | "operator" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at?: string
  last_login_at?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  hasPermission: (permission: string) => boolean
  hasRole: (role: UserRole | UserRole[]) => boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to check if a user has a specific permission
const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false

  // Admin has all permissions
  if (user.role === "admin") return true

  // Define permissions for each role
  const rolePermissions: Record<UserRole, string[]> = {
    admin: ["*"], // Admin has all permissions
    operator: [
      "manage:products",
      "manage:prices",
      "manage:shipping",
      "manage:users",
      "process:orders",
      "manage:quotes",
      "view:orders",
      "view:payments",
      "save:designs",
    ],
    user: ["view:orders", "view:payments", "save:designs"],
  }

  return rolePermissions[user.role].includes(permission) || rolePermissions[user.role].includes("*")
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Fetch user data from Supabase with caching
  const fetchUserData = async (userId: string, userEmail: string) => {
    try {
      // Get user data from the users table
      const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

      if (userError) {
        console.error("Error fetching user data:", userError)

        // Return basic user info as fallback
        return {
          id: userId,
          email: userEmail,
          name: userEmail?.split("@")[0] || "User",
          role: "user" as const,
          is_active: true,
          created_at: new Date().toISOString(),
        }
      }

      return userData
    } catch (error) {
      console.error("Error in fetchUserData:", error)
      return null
    }
  }

  // Check if user is already logged in
  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      try {
        // Get session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          if (isMounted) {
            setUser(null)
            setIsLoading(false)
          }
          return
        }

        // Get user data
        const userData = await fetchUserData(session.user.id, session.user.email || "")

        if (isMounted) {
          if (userData) {
            setUser(userData as User)
          } else {
            // If API fails, use basic user info from session
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
              role: "user",
              is_active: true,
              created_at: session.user.created_at || new Date().toISOString(),
              updated_at: session.user.updated_at || new Date().toISOString(),
            })
          }
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        if (isMounted) {
          setUser(null)
          setIsLoading(false)
        }
      }
    }

    checkSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const userData = await fetchUserData(session.user.id, session.user.email || "")
        if (isMounted) {
          if (userData) {
            setUser(userData as User)
          } else {
            // If API fails, use basic user info from session
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
              role: "user",
              is_active: true,
              created_at: session.user.created_at || new Date().toISOString(),
              updated_at: session.user.updated_at || new Date().toISOString(),
            })
          }
        }
      } else if (event === "SIGNED_OUT") {
        if (isMounted) {
          setUser(null)
        }
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const refreshUser = async () => {
    if (!user) return

    const userData = await fetchUserData(user.id, user.email)
    if (userData) {
      setUser(userData as User)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Update last login timestamp
      if (data.user) {
        await supabase.from("users").update({ last_login_at: new Date().toISOString() }).eq("id", data.user.id)
      }

      // Get user data
      const userData = await fetchUserData(data.user.id, data.user.email || "")

      if (userData) {
        // Redirect based on role
        if (userData.role === "admin") {
          router.push("/admin/dashboard")
        } else if (userData.role === "operator") {
          router.push("/operator/dashboard")
        } else {
          router.push("/my-print/orders")
        }
      } else {
        // Default redirect if role can't be determined
        router.push("/")
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      })
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // First, check if user already exists
      const { data: existingUsers } = await supabase.from("users").select("*").eq("email", email).limit(1)

      if (existingUsers && existingUsers.length > 0) {
        throw new Error("A user with this email already exists")
      }

      // Sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      })

      if (error) throw error

      // Create user in custom users table
      if (data.user) {
        const now = new Date().toISOString()
        const { error: insertError } = await supabase.from("users").insert({
          id: data.user.id,
          email,
          name,
          role: "user", // Always set role to "user" for self-registration
          is_active: true,
          created_at: now,
          updated_at: now,
        })

        if (insertError) {
          console.error("Error creating user entry:", insertError)
          // Try to clean up auth user if db insert fails
          try {
            // Note: We can't use admin.deleteUser here as we don't have admin rights in the client
            // Just log the error for now
            console.error("Failed to create user record in database. Auth user may be orphaned:", data.user.id)
          } catch (deleteError) {
            console.error("Error cleaning up auth user:", deleteError)
          }
          throw insertError
        }
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account before logging in.",
      })

      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      })
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password",
      })
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
      console.error("Forgot password error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkPermission = (permission: string) => {
    return hasPermission(user, permission)
  }

  const checkRole = (role: UserRole | UserRole[]) => {
    if (!user) return false

    if (Array.isArray(role)) {
      return role.includes(user.role)
    }

    return user.role === role
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        forgotPassword,
        hasPermission: checkPermission,
        hasRole: checkRole,
        refreshUser,
      }}
    >
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
