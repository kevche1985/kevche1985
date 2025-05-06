export type QuoteStatus = "draft" | "sent" | "accepted" | "declined" | "expired" | "converted"

export interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Quote {
  id: string
  customerId?: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: QuoteItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  currency: string
  status: QuoteStatus
  validUntil: string
  notes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  convertedToOrderId?: string
}

export interface QuoteRepository {
  createQuote(quote: Omit<Quote, "id" | "createdAt" | "updatedAt">): Promise<Quote>
  getQuoteById(id: string): Promise<Quote | null>
  updateQuote(id: string, updates: Partial<Omit<Quote, "id" | "createdAt">>): Promise<Quote | null>
  updateQuoteStatus(id: string, status: QuoteStatus): Promise<Quote | null>
  convertQuoteToOrder(id: string, orderId: string): Promise<Quote | null>
  listQuotes(page?: number, limit?: number): Promise<Quote[]>
  listQuotesByStatus(status: QuoteStatus, page?: number, limit?: number): Promise<Quote[]>
  listQuotesByCustomer(customerId: string, page?: number, limit?: number): Promise<Quote[]>
  searchQuotes(query: string): Promise<Quote[]>
}
