import type { User, UserRole, UserRepository } from "../models/user"
import {
  setValue,
  getValue,
  deleteValue,
  getMultipleValues,
  addToSet,
  getSetMembers,
  removeFromSet,
  incrementCounter,
} from "../lib/kv-store"

export class RedisUserRepository implements UserRepository {
  private readonly userPrefix = "user:"
  private readonly emailIndex = "index:user:email:"
  private readonly roleIndex = "index:user:role:"
  private readonly userIdCounter = "counter:user:id"
  private readonly userList = "list:users"

  async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const id = `user_${await incrementCounter(this.userIdCounter)}`
    const now = new Date().toISOString()

    const user: User = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now,
      isActive: true,
    }

    // Store the user
    await setValue(`${this.userPrefix}${id}`, user)

    // Create email index
    await setValue(`${this.emailIndex}${userData.email.toLowerCase()}`, id)

    // Add to role index
    await addToSet(`${this.roleIndex}${userData.role}`, id)

    // Add to user list
    await addToSet(this.userList, id)

    return user
  }

  async getUserById(id: string): Promise<User | null> {
    return getValue<User>(`${this.userPrefix}${id}`)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const id = await getValue<string>(`${this.emailIndex}${email.toLowerCase()}`)
    if (!id) return null

    return this.getUserById(id)
  }

  async updateUser(id: string, updates: Partial<Omit<User, "id" | "createdAt">>): Promise<User | null> {
    const user = await this.getUserById(id)
    if (!user) return null

    // Handle email change
    if (updates.email && updates.email.toLowerCase() !== user.email.toLowerCase()) {
      // Delete old email index
      await deleteValue(`${this.emailIndex}${user.email.toLowerCase()}`)

      // Create new email index
      await setValue(`${this.emailIndex}${updates.email.toLowerCase()}`, id)
    }

    // Handle role change
    if (updates.role && updates.role !== user.role) {
      // Remove from old role index
      await removeFromSet(`${this.roleIndex}${user.role}`, id)

      // Add to new role index
      await addToSet(`${this.roleIndex}${updates.role}`, id)
    }

    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await setValue(`${this.userPrefix}${id}`, updatedUser)

    return updatedUser
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.getUserById(id)
    if (!user) return false

    // Delete email index
    await deleteValue(`${this.emailIndex}${user.email.toLowerCase()}`)

    // Remove from role index
    await removeFromSet(`${this.roleIndex}${user.role}`, id)

    // Remove from user list
    await removeFromSet(this.userList, id)

    // Delete user
    await deleteValue(`${this.userPrefix}${id}`)

    return true
  }

  async listUsers(page = 1, limit = 20): Promise<User[]> {
    const userIds = await getSetMembers(this.userList)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = userIds.slice(start, end)

    const userKeys = paginatedIds.map((id) => `${this.userPrefix}${id}`)
    const users = await getMultipleValues<User>(userKeys)

    return users.filter((user): user is User => user !== null)
  }

  async listUsersByRole(role: UserRole): Promise<User[]> {
    const userIds = await getSetMembers(`${this.roleIndex}${role}`)
    const userKeys = userIds.map((id) => `${this.userPrefix}${id}`)
    const users = await getMultipleValues<User>(userKeys)

    return users.filter((user): user is User => user !== null)
  }

  async updateLastLogin(id: string): Promise<void> {
    const user = await this.getUserById(id)
    if (!user) return

    user.lastLoginAt = new Date().toISOString()
    user.updatedAt = new Date().toISOString()

    await setValue(`${this.userPrefix}${id}`, user)
  }

  async setUserActive(id: string, isActive: boolean): Promise<User | null> {
    const user = await this.getUserById(id)
    if (!user) return null

    user.isActive = isActive
    user.updatedAt = new Date().toISOString()

    await setValue(`${this.userPrefix}${id}`, user)

    return user
  }
}
