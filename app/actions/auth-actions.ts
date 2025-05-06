"use server"

import { db } from "@/lib/database"
import { login, hashPassword } from "@/lib/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, message: "Email and password are required" }
  }

  const result = await login(email, password)

  if (!result) {
    return { success: false, message: "Invalid email or password" }
  }

  // Set the auth token as a cookie
  cookies().set({
    name: "auth_token",
    value: result.token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
  })

  return {
    success: true,
    user: { id: result.user.id, name: result.user.name, email: result.user.email, role: result.user.role },
  }
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!name || !email || !password) {
    return { success: false, message: "All fields are required" }
  }

  // Check if user already exists
  const existingUser = await db.users.getUserByEmail(email)

  if (existingUser) {
    return { success: false, message: "User with this email already exists" }
  }

  // Hash the password
  const passwordHash = await hashPassword(password)

  // Create the user
  const user = await db.users.createUser({
    name,
    email,
    passwordHash,
    role: "user",
    isActive: true,
  })

  // Log the user in
  const result = await login(email, password)

  if (!result) {
    return { success: false, message: "Failed to log in after registration" }
  }

  // Set the auth token as a cookie
  cookies().set({
    name: "auth_token",
    value: result.token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
  })

  return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
}

export async function logoutUser() {
  cookies().delete("auth_token")
  redirect("/")
}
