"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// Create a Supabase client with admin privileges for server actions
function createAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

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
}

export async function getAllUsers() {
  try {
    const supabase = createServerActionClient({ cookies })

    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getAllUsers:", error)
    return { success: false, error: "Failed to fetch users" }
  }
}

export async function getUsersByRole(role: UserRole) {
  try {
    const supabase = createServerActionClient({ cookies })

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", role)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users by role:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getUsersByRole:", error)
    return { success: false, error: "Failed to fetch users by role" }
  }
}

export async function getUsersByStatus(isActive: boolean) {
  try {
    const supabase = createServerActionClient({ cookies })

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("is_active", isActive)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users by status:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getUsersByStatus:", error)
    return { success: false, error: "Failed to fetch users by status" }
  }
}

export async function createUser(formData: FormData) {
  try {
    // Use the admin client for user creation to bypass email verification
    const adminClient = createAdminClient()

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = (formData.get("role") as UserRole) || "user"

    // First, check if a user with this email already exists in auth
    const { data: existingUsers, error: searchError } = await adminClient.auth.admin.listUsers({
      filter: {
        email: email,
      },
    })

    if (searchError) {
      console.error("Error searching for existing user:", searchError)
      return { success: false, error: searchError.message }
    }

    let userId: string

    // If user doesn't exist in auth, create them
    if (!existingUsers.users || existingUsers.users.length === 0) {
      // Create the user with admin API, setting email_confirm to true
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
      })

      if (authError) {
        console.error("Error creating auth user:", authError)
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: "Failed to create user" }
      }

      userId = authData.user.id
    } else {
      // User already exists in auth
      userId = existingUsers.users[0].id

      // Check if user already exists in our custom users table
      const { data: existingUserData, error: userCheckError } = await adminClient
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle()

      if (userCheckError) {
        console.error("Error checking for existing user in custom table:", userCheckError)
        return { success: false, error: userCheckError.message }
      }

      // If user already exists in our custom table, return an error
      if (existingUserData) {
        return {
          success: false,
          error: "A user with this email already exists in the system. Please use a different email address.",
        }
      }

      // Update the user's password if they exist in auth but not in our custom table
      const { error: updatePasswordError } = await adminClient.auth.admin.updateUserById(userId, {
        password,
        user_metadata: { name },
      })

      if (updatePasswordError) {
        console.error("Error updating user password:", updatePasswordError)
        return { success: false, error: updatePasswordError.message }
      }
    }

    // Create or update the user record in our custom users table
    const now = new Date().toISOString()
    const { error: dbError } = await adminClient.from("users").insert({
      id: userId,
      email,
      name,
      role,
      is_active: true,
      created_at: now,
      updated_at: now,
    })

    if (dbError) {
      console.error("Error creating user record:", dbError)
      return { success: false, error: dbError.message }
    }

    revalidatePath("/admin/users")
    return { success: true, message: "User created successfully. They can now log in with their credentials." }
  } catch (error) {
    console.error("Error in createUser:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function updateUser(userId: string, updates: Partial<User>) {
  try {
    const adminClient = createAdminClient()

    // Update the user record
    const { error } = await adminClient
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Error updating user:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error in updateUser:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUser(userId: string) {
  try {
    // Use admin client for all operations
    const adminClient = createAdminClient()

    // First delete the user from the users table
    const { error: dbError } = await adminClient.from("users").delete().eq("id", userId)

    if (dbError) {
      console.error("Error deleting user from database:", dbError)
      return { success: false, error: dbError.message }
    }

    // Then delete the auth user
    const { error: authError } = await adminClient.auth.admin.deleteUser(userId)

    if (authError) {
      console.error("Error deleting auth user:", authError)
      return { success: false, error: authError.message }
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteUser:", error)
    return { success: false, error: "Failed to delete user" }
  }
}

export async function resetUserPassword(email: string) {
  try {
    const supabase = createServerActionClient({ cookies })

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })

    if (error) {
      console.error("Error resetting password:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in resetUserPassword:", error)
    return { success: false, error: "Failed to reset password" }
  }
}
