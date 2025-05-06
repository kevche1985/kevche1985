import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { hashPassword } from "@/lib/auth"

export async function GET() {
  try {
    // Create admin user if it doesn't exist
    const adminExists = await db.users.getUserByEmail("admin@example.com")

    if (!adminExists) {
      const passwordHash = await hashPassword("admin123")

      await db.users.createUser({
        email: "admin@example.com",
        name: "Admin User",
        passwordHash,
        role: "admin",
        isActive: true,
      })

      console.log("Admin user created")
    }

    // Create operator user if it doesn't exist
    const operatorExists = await db.users.getUserByEmail("operator@example.com")

    if (!operatorExists) {
      const passwordHash = await hashPassword("operator123")

      await db.users.createUser({
        email: "operator@example.com",
        name: "Operator User",
        passwordHash,
        role: "operator",
        isActive: true,
      })

      console.log("Operator user created")
    }

    // Create regular user if it doesn't exist
    const userExists = await db.users.getUserByEmail("user@example.com")

    if (!userExists) {
      const passwordHash = await hashPassword("user123")

      await db.users.createUser({
        email: "user@example.com",
        name: "Regular User",
        passwordHash,
        role: "user",
        isActive: true,
      })

      console.log("Regular user created")
    }

    return NextResponse.json({ success: true, message: "Database initialized successfully" })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ success: false, message: "Error initializing database" }, { status: 500 })
  }
}
