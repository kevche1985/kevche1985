export type TransactionType = "payment" | "refund" | "expense" | "adjustment"
export type TransactionCategory = "sales" | "shipping" | "tax" | "supplies" | "marketing" | "operations" | "other"

export interface Transaction {
  id: string
  type: TransactionType
  category: TransactionCategory
  amount: number
  currency: string
  description: string
  orderId?: string
  paymentId?: string
  metadata?: Record<string, any>
  createdBy: string
  createdAt: string
}

export interface FinancialSummary {
  id: string
  period: string // 'daily', 'weekly', 'monthly', 'yearly'
  date: string
  revenue: number
  expenses: number
  netProfit: number
  orderCount: number
  averageOrderValue: number
  currency: string
  createdAt: string
  updatedAt: string
}

export interface FinancialRepository {
  createTransaction(transaction: Omit<Transaction, "id" | "createdAt">): Promise<Transaction>
  getTransactionById(id: string): Promise<Transaction | null>
  listTransactions(page?: number, limit?: number): Promise<Transaction[]>
  listTransactionsByType(type: TransactionType, page?: number, limit?: number): Promise<Transaction[]>
  listTransactionsByCategory(category: TransactionCategory, page?: number, limit?: number): Promise<Transaction[]>
  listTransactionsByDateRange(startDate: string, endDate: string, page?: number, limit?: number): Promise<Transaction[]>

  createFinancialSummary(summary: Omit<FinancialSummary, "id" | "createdAt" | "updatedAt">): Promise<FinancialSummary>
  getFinancialSummaryById(id: string): Promise<FinancialSummary | null>
  updateFinancialSummary(
    id: string,
    updates: Partial<Omit<FinancialSummary, "id" | "createdAt">>,
  ): Promise<FinancialSummary | null>
  getFinancialSummaryByPeriodAndDate(period: string, date: string): Promise<FinancialSummary | null>
  listFinancialSummaries(period: string, page?: number, limit?: number): Promise<FinancialSummary[]>
}
