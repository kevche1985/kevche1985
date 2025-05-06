import { db } from "../lib/database"
import type { UserRole } from "../models/user"
import bcrypt from "bcryptjs"

async function initializeDatabase() {
  console.log("Initializing database...")

  // Create admin user
  const adminExists = await db.users.getUserByEmail("admin@example.com")

  if (!adminExists) {
    console.log("Creating admin user...")
    const passwordHash = await bcrypt.hash("admin123", 10)

    await db.users.createUser({
      email: "admin@example.com",
      name: "Admin User",
      passwordHash,
      role: "admin" as UserRole,
      isActive: true,
    })

    console.log("Admin user created")
  }

  // Create sample categories and products
  const categories = ["Business Cards", "T-Shirts", "Mugs", "Posters", "Canvas Prints"]

  for (const category of categories) {
    console.log(`Creating sample products for category: ${category}`)

    // Create 3 sample products per category
    for (let i = 1; i <= 3; i++) {
      await db.products.createProduct({
        name: `Sample ${category} ${i}`,
        description: `This is a sample ${category.toLowerCase()} product ${i}`,
        category,
        images: [
          {
            id: `img_${i}`,
            url: `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(category + " " + i)}`,
            alt: `Sample ${category} ${i}`,
            isPrimary: true,
          },
        ],
        variants: [
          {
            id: `var_${i}_1`,
            name: "Standard",
            sku: `${category.substring(0, 3).toUpperCase()}-STD-${i}`,
            price: 19.99 + i * 5,
            inventory: 100,
            attributes: {
              size: "Standard",
              color: "Default",
            },
          },
          {
            id: `var_${i}_2`,
            name: "Premium",
            sku: `${category.substring(0, 3).toUpperCase()}-PRE-${i}`,
            price: 29.99 + i * 5,
            inventory: 50,
            attributes: {
              size: "Premium",
              color: "Enhanced",
            },
          },
        ],
        tags: [`${category.toLowerCase()}`, "sample", `product-${i}`],
        isActive: true,
        isFeatured: i === 1,
      })
    }
  }

  console.log("Database initialization complete!")
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log("Database setup completed successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Error initializing database:", error)
    process.exit(1)
  })
