import { RedisUserRepository } from "../repositories/user-repository"
import { RedisDesignRepository } from "../repositories/design-repository"
import { RedisProductRepository } from "../repositories/product-repository"
import { RedisOrderRepository } from "../repositories/order-repository"
import { RedisQuoteRepository } from "../repositories/quote-repository"
import { RedisFinancialRepository } from "../repositories/financial-repository"

// Create a singleton database service
class Database {
  private static instance: Database

  public users: RedisUserRepository
  public designs: RedisDesignRepository
  public products: RedisProductRepository
  public orders: RedisOrderRepository
  public quotes: RedisQuoteRepository
  public financials: RedisFinancialRepository

  private constructor() {
    this.users = new RedisUserRepository()
    this.designs = new RedisDesignRepository()
    this.products = new RedisProductRepository()
    this.orders = new RedisOrderRepository()
    this.quotes = new RedisQuoteRepository()
    this.financials = new RedisFinancialRepository()
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

// Export a singleton instance
export const db = Database.getInstance()
