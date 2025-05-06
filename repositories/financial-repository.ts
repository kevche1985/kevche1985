import type {
  Transaction,
  TransactionType,
  TransactionCategory,
  FinancialSummary,
  FinancialRepository,
} from "../models/financial"
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

export class RedisFinancialRepository implements FinancialRepository {
  private readonly transactionPrefix = "transaction:"
  private readonly typeIndex = "index:transaction:type:"
  private readonly categoryIndex = "index:transaction:category:"
  private readonly dateIndex = "index:transaction:date:"
  private readonly transactionIdCounter = "counter:transaction:id"
  private readonly transactionList = "list:transactions"

  private readonly summaryPrefix = "financial-summary:"
  private readonly periodIndex = "index:financial-summary:period:"
  private readonly periodDateIndex = "index:financial-summary:period-date:"
  private readonly summaryIdCounter = "counter:financial-summary:id"
  private readonly summaryList = "list:financial-summaries"

  async createTransaction(transactionData: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
    const id = `transaction_${await incrementCounter(this.transactionIdCounter)}`
    const now = new Date().toISOString()

    const transaction: Transaction = {
      ...transactionData,
      id,
      createdAt: now,
    }

    // Store the transaction
    await setValue(`${this.transactionPrefix}${id}`, transaction)

    // Add to type index
    await addToSet(`${this.typeIndex}${transaction.type}`, id)

    // Add to category index
    await addToSet(`${this.categoryIndex}${transaction.category}`, id)

    // Add to date index (using YYYY-MM-DD format)
    const date = now.split("T")[0]
    await addToSet(`${this.dateIndex}${date}`, id)

    // Add to transaction list
    await addToSet(this.transactionList, id)

    return transaction
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return getValue<Transaction>(`${this.transactionPrefix}${id}`)
  }

  async listTransactions(page = 1, limit = 20): Promise<Transaction[]> {
    const transactionIds = await getSetMembers(this.transactionList)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = transactionIds.slice(start, end)

    const transactionKeys = paginatedIds.map((id) => `${this.transactionPrefix}${id}`)
    const transactions = await getMultipleValues<Transaction>(transactionKeys)

    return transactions.filter((transaction): transaction is Transaction => transaction !== null)
  }

  async listTransactionsByType(type: TransactionType, page = 1, limit = 20): Promise<Transaction[]> {
    const transactionIds = await getSetMembers(`${this.typeIndex}${type}`)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = transactionIds.slice(start, end)

    const transactionKeys = paginatedIds.map((id) => `${this.transactionPrefix}${id}`)
    const transactions = await getMultipleValues<Transaction>(transactionKeys)

    return transactions.filter((transaction): transaction is Transaction => transaction !== null)
  }

  async listTransactionsByCategory(category: TransactionCategory, page = 1, limit = 20): Promise<Transaction[]> {
    const transactionIds = await getSetMembers(`${this.categoryIndex}${category}`)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = transactionIds.slice(start, end)

    const transactionKeys = paginatedIds.map((id) => `${this.transactionPrefix}${id}`)
    const transactions = await getMultipleValues<Transaction>(transactionKeys)

    return transactions.filter((transaction): transaction is Transaction => transaction !== null)
  }

  async listTransactionsByDateRange(startDate: string, endDate: string, page = 1, limit = 20): Promise<Transaction[]> {
    // Get all dates in the range
    const start = new Date(startDate)
    const end = new Date(endDate)
    const dateRange: string[] = []

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      dateRange.push(dateStr)
    }

    // Get transaction IDs for each date
    const transactionIdSets = await Promise.all(dateRange.map((date) => getSetMembers(`${this.dateIndex}${date}`)))

    // Flatten and deduplicate
    const transactionIds = [...new Set(transactionIdSets.flat())]

    // Simple pagination
    const pageStart = (page - 1) * limit
    const pageEnd = pageStart + limit
    const paginatedIds = transactionIds.slice(pageStart, pageEnd)

    const transactionKeys = paginatedIds.map((id) => `${this.transactionPrefix}${id}`)
    const transactions = await getMultipleValues<Transaction>(transactionKeys)

    return transactions.filter((transaction): transaction is Transaction => transaction !== null)
  }

  async createFinancialSummary(
    summaryData: Omit<FinancialSummary, "id" | "createdAt" | "updatedAt">,
  ): Promise<FinancialSummary> {
    const id = `summary_${await incrementCounter(this.summaryIdCounter)}`
    const now = new Date().toISOString()

    const summary: FinancialSummary = {
      ...summaryData,
      id,
      createdAt: now,
      updatedAt: now,
    }

    // Store the summary
    await setValue(`${this.summaryPrefix}${id}`, summary)

    // Add to period index
    await addToSet(`${this.periodIndex}${summary.period}`, id)

    // Add to period-date index
    await setValue(`${this.periodDateIndex}${summary.period}:${summary.date}`, id)

    // Add to summary list
    await addToSet(this.summaryList, id)

    return summary
  }

  async getFinancialSummaryById(id: string): Promise<FinancialSummary | null> {
    return getValue<FinancialSummary>(`${this.summaryPrefix}${id}`)
  }

  async updateFinancialSummary(
    id: string,
    updates: Partial<Omit<FinancialSummary, "id" | "createdAt">>,
  ): Promise<FinancialSummary | null> {
    const summary = await this.getFinancialSummaryById(id)
    if (!summary) return null

    // Handle period change
    if (updates.period && updates.period !== summary.period) {
      // Remove from old period index
      await removeFromSet(`${this.periodIndex}${summary.period}`, id)

      // Add to new period index
      await addToSet(`${this.periodIndex}${updates.period}`, id)

      // Update period-date index
      await deleteValue(`${this.periodDateIndex}${summary.period}:${summary.date}`)
      const newDate = updates.date || summary.date
      await setValue(`${this.periodDateIndex}${updates.period}:${newDate}`, id)
    }

    // Handle date change
    if (updates.date && updates.date !== summary.date) {
      // Update period-date index
      await deleteValue(`${this.periodDateIndex}${summary.period}:${summary.date}`)
      const newPeriod = updates.period || summary.period
      await setValue(`${this.periodDateIndex}${newPeriod}:${updates.date}`, id)
    }

    const updatedSummary: FinancialSummary = {
      ...summary,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await setValue(`${this.summaryPrefix}${id}`, updatedSummary)

    return updatedSummary
  }

  async getFinancialSummaryByPeriodAndDate(period: string, date: string): Promise<FinancialSummary | null> {
    const id = await getValue<string>(`${this.periodDateIndex}${period}:${date}`)
    if (!id) return null

    return this.getFinancialSummaryById(id)
  }

  async listFinancialSummaries(period: string, page = 1, limit = 20): Promise<FinancialSummary[]> {
    const summaryIds = await getSetMembers(`${this.periodIndex}${period}`)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = summaryIds.slice(start, end)

    const summaryKeys = paginatedIds.map((id) => `${this.summaryPrefix}${id}`)
    const summaries = await getMultipleValues<FinancialSummary>(summaryKeys)

    return summaries.filter((summary): summary is FinancialSummary => summary !== null)
  }
}
