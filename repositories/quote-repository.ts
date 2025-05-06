import type { Quote, QuoteStatus, QuoteRepository } from "../models/quote"
import {
  setValue,
  getValue,
  getMultipleValues,
  addToSet,
  getSetMembers,
  removeFromSet,
  incrementCounter,
} from "../lib/kv-store"

export class RedisQuoteRepository implements QuoteRepository {
  private readonly quotePrefix = "quote:"
  private readonly customerQuotesIndex = "index:quote:customer:"
  private readonly statusIndex = "index:quote:status:"
  private readonly quoteIdCounter = "counter:quote:id"
  private readonly quoteList = "list:quotes"

  async createQuote(quoteData: Omit<Quote, "id" | "createdAt" | "updatedAt">): Promise<Quote> {
    const id = `quote_${await incrementCounter(this.quoteIdCounter)}`
    const now = new Date().toISOString()

    const quote: Quote = {
      ...quoteData,
      id,
      createdAt: now,
      updatedAt: now,
    }

    // Store the quote
    await setValue(`${this.quotePrefix}${id}`, quote)

    // Add to customer's quotes if customerId exists
    if (quote.customerId) {
      await addToSet(`${this.customerQuotesIndex}${quote.customerId}`, id)
    }

    // Add to status index
    await addToSet(`${this.statusIndex}${quote.status}`, id)

    // Add to quote list
    await addToSet(this.quoteList, id)

    return quote
  }

  async getQuoteById(id: string): Promise<Quote | null> {
    return getValue<Quote>(`${this.quotePrefix}${id}`)
  }

  async updateQuote(id: string, updates: Partial<Omit<Quote, "id" | "createdAt">>): Promise<Quote | null> {
    const quote = await this.getQuoteById(id)
    if (!quote) return null

    // Handle status change
    if (updates.status && updates.status !== quote.status) {
      // Remove from old status index
      await removeFromSet(`${this.statusIndex}${quote.status}`, id)

      // Add to new status index
      await addToSet(`${this.statusIndex}${updates.status}`, id)
    }

    // Handle customer change
    if (updates.customerId && updates.customerId !== quote.customerId) {
      // Remove from old customer index if it exists
      if (quote.customerId) {
        await removeFromSet(`${this.customerQuotesIndex}${quote.customerId}`, id)
      }

      // Add to new customer index
      await addToSet(`${this.customerQuotesIndex}${updates.customerId}`, id)
    }

    const updatedQuote: Quote = {
      ...quote,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await setValue(`${this.quotePrefix}${id}`, updatedQuote)

    return updatedQuote
  }

  async updateQuoteStatus(id: string, status: QuoteStatus): Promise<Quote | null> {
    const quote = await this.getQuoteById(id)
    if (!quote) return null

    if (status !== quote.status) {
      // Remove from old status index
      await removeFromSet(`${this.statusIndex}${quote.status}`, id)

      // Add to new status index
      await addToSet(`${this.statusIndex}${status}`, id)

      quote.status = status
      quote.updatedAt = new Date().toISOString()

      await setValue(`${this.quotePrefix}${id}`, quote)
    }

    return quote
  }

  async convertQuoteToOrder(id: string, orderId: string): Promise<Quote | null> {
    const quote = await this.getQuoteById(id)
    if (!quote) return null

    // Update status to converted
    await this.updateQuoteStatus(id, "converted")

    // Set the converted order ID
    quote.convertedToOrderId = orderId
    quote.updatedAt = new Date().toISOString()

    await setValue(`${this.quotePrefix}${id}`, quote)

    return quote
  }

  async listQuotes(page = 1, limit = 20): Promise<Quote[]> {
    const quoteIds = await getSetMembers(this.quoteList)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = quoteIds.slice(start, end)

    const quoteKeys = paginatedIds.map((id) => `${this.quotePrefix}${id}`)
    const quotes = await getMultipleValues<Quote>(quoteKeys)

    return quotes.filter((quote): quote is Quote => quote !== null)
  }

  async listQuotesByStatus(status: QuoteStatus, page = 1, limit = 20): Promise<Quote[]> {
    const quoteIds = await getSetMembers(`${this.statusIndex}${status}`)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = quoteIds.slice(start, end)

    const quoteKeys = paginatedIds.map((id) => `${this.quotePrefix}${id}`)
    const quotes = await getMultipleValues<Quote>(quoteKeys)

    return quotes.filter((quote): quote is Quote => quote !== null)
  }

  async listQuotesByCustomer(customerId: string, page = 1, limit = 20): Promise<Quote[]> {
    const quoteIds = await getSetMembers(`${this.customerQuotesIndex}${customerId}`)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = quoteIds.slice(start, end)

    const quoteKeys = paginatedIds.map((id) => `${this.quotePrefix}${id}`)
    const quotes = await getMultipleValues<Quote>(quoteKeys)

    return quotes.filter((quote): quote is Quote => quote !== null)
  }

  async searchQuotes(query: string): Promise<Quote[]> {
    // This is a simple implementation that searches by quote ID
    // In a real application, you might want to implement more sophisticated search
    const quoteIds = await getSetMembers(this.quoteList)
    const matchingIds = quoteIds.filter((id) => id.includes(query))

    const quoteKeys = matchingIds.map((id) => `${this.quotePrefix}${id}`)
    const quotes = await getMultipleValues<Quote>(quoteKeys)

    return quotes.filter((quote): quote is Quote => quote !== null)
  }
}
