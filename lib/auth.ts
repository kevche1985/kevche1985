import { db } from "./database"
import bcrypt from "bcryptjs"
import type { User } from "../models/user"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

// Secret key for JWT signing
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-at-least-32-characters")

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUserSession(user: User): Promise<string> {
  // Create a JWT token
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)

  // Update last login time
  await db.users.updateLastLogin(user.id)

  return token
}

export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    if (!payload.id) return null

    return db.users.getUserById(payload.id as string)
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) return null

  return getUserFromToken(token)
}

export async function login(email: string, password: string): Promise<{ user: User; token: string } | null> {
  const user = await db.users.getUserByEmail(email)

  if (!user || !user.isActive) return null

  const passwordValid = await verifyPassword(password, user.passwordHash)

  if (!passwordValid) return null

  const token = await createUserSession(user)

  return { user, token }
}

export async function logout(): Promise<void> {
  // In a more complex system, you might want to invalidate the token
  // For now, we'll just clear the cookie on the client side
}

export function isAuthorized(user: User | null, allowedRoles: string[]): boolean {
  if (!user) return false

  return allowedRoles.includes(user.role)
}
