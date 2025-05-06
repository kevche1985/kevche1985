export type OrderStatus =
  | "cart"
  | "checkout"
  | "payment_pending"
  | "payment_completed"
  | "processing"
  | "ready_for_shipping"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"

export interface OrderItem {
  id: string
  productId: string
  variantId: string
  name: string
  price: number
  quantity: number
  customizations?: Record<string, any>
  designId?: string
}

export interface OrderAddress {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

export interface OrderPayment {
  id: string
  method: string
  amount: number
  status: "pending" | "completed" | "failed" | "refunded"
  transactionId?: string
  metadata?: Record<string, any>
  createdAt: string
}

export interface OrderStatusHistory {
  status: OrderStatus
  timestamp: string
  note?: string
}

export interface Order {
  id: string
  userId?: string
  email: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  status: OrderStatus
  statusHistory: OrderStatusHistory[]
  shippingAddress?: OrderAddress
  billingAddress?: OrderAddress
  paymentMethod?: string
  payments: OrderPayment[]
  notes?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
  supplierId: string // ADDED: Supplier ID
}

export interface OrderRepository {
  createOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt" | "statusHistory">): Promise<Order>
  getOrderById(id: string): Promise<Order | null>
  updateOrder(id: string, updates: Partial<Omit<Order, "id" | "createdAt" | "statusHistory">>): Promise<Order | null>
  updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order | null>
  addPayment(id: string, payment: Omit<OrderPayment, "id" | "createdAt">): Promise<Order | null>
  listOrdersByUser(userId: string, page?: number, limit?: number): Promise<Order[]>
  listOrdersByStatus(status: OrderStatus, page?: number, limit?: number): Promise<Order[]>
  listOrders(page?: number, limit?: number): Promise<Order[]>
  searchOrders(query: string): Promise<Order[]>
}
