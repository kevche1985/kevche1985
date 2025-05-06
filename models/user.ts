export type UserRole = "user" | "operator" | "admin"

export interface User {
  id: string
  email: string
  name: string
  passwordHash: string
  role: UserRole
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  isActive: boolean
  avatar?: string
}

export interface UserRepository {
  createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>
  getUserById(id: string): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  updateUser(id: string, updates: Partial<Omit<User, "id" | "createdAt">>): Promise<User | null>
  deleteUser(id: string): Promise<boolean>
  listUsers(page?: number, limit?: number): Promise<User[]>
  listUsersByRole(role: UserRole): Promise<User[]>
  updateLastLogin(id: string): Promise<void>
  setUserActive(id: string, isActive: boolean): Promise<User | null>
}
