import type { Order, OrderStatus, OrderPayment, OrderRepository } from "../models/order"
import {
  setValue,
  getValue,
  getMultipleValues,
  addToSet,
  getSetMembers,
  removeFromSet,
  incrementCounter,
} from "../lib/kv-store"

export class RedisOrderRepository implements OrderRepository {
  private readonly orderPrefix = "order:"
  private readonly userOrdersIndex = "index:order:user:"
  private readonly statusIndex = "index:order:status:"
  private readonly orderIdCounter = "counter:order:id"
  private readonly orderList = "list:orders"
  private readonly paymentIdCounter = "counter:payment:id"

  async createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt" | "statusHistory">): Promise<Order> {
    const id = `order_${await incrementCounter(this.orderIdCounter)}`
    const now = new Date().toISOString()

    const order: Order = {
      ...orderData,
      id,
      statusHistory: [
        {
          status: orderData.status,
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
      payments: orderData.payments || [],
    }

    // Store the order
    await setValue(`${this.orderPrefix}${id}`, order)

    // Add to user's orders if userId exists
    if (order.userId) {
      await addToSet(`${this.userOrdersIndex}${order.userId}`, id)
    }

    // Add to status index
    await addToSet(`${this.statusIndex}${order.status}`, id)

    // Add to order list
    await addToSet(this.orderList, id)

    return order
  }

  async getOrderById(id: string): Promise<Order | null> {
    return getValue<Order>(`${this.orderPrefix}${id}`)
  }

  async updateOrder(
    id: string,
    updates: Partial<Omit<Order, "id" | "createdAt" | "statusHistory">>,
  ): Promise<Order | null> {
    const order = await this.getOrderById(id)
    if (!order) return null

    // Handle status change
    if (updates.status && updates.status !== order.status) {
      // Remove from old status index
      await removeFromSet(`${this.statusIndex}${order.status}`, id)

      // Add to new status index
      await addToSet(`${this.statusIndex}${updates.status}`, id)

      // Add to status history
      order.statusHistory.push({
        status: updates.status,
        timestamp: new Date().toISOString(),
      })
    }

    // Handle user change (rare, but possible for guest checkout conversion)
    if (updates.userId && updates.userId !== order.userId) {
      // Remove from old user index if it exists
      if (order.userId) {
        await removeFromSet(`${this.userOrdersIndex}${order.userId}`, id)
      }

      // Add to new user index
      await addToSet(`${this.userOrdersIndex}${updates.userId}`, id)
    }

    const updatedOrder: Order = {
      ...order,
      ...updates,
      statusHistory: order.statusHistory, // Preserve status history
      updatedAt: new Date().toISOString(),
    }

    await setValue(`${this.orderPrefix}${id}`, updatedOrder)

    return updatedOrder
  }

  async updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order | null> {
    const order = await this.getOrderById(id)
    if (!order) return null

    if (status !== order.status) {
      // Remove from old status index
      await removeFromSet(`${this.statusIndex}${order.status}`, id)

      // Add to new status index
      await addToSet(`${this.statusIndex}${status}`, id)

      // Add to status history
      order.statusHistory.push({
        status,
        timestamp: new Date().toISOString(),
        note,
      })

      order.status = status
      order.updatedAt = new Date().toISOString()

      await setValue(`${this.orderPrefix}${id}`, order)
    }

    return order
  }

  async addPayment(id: string, payment: Omit<OrderPayment, "id" | "createdAt">): Promise<Order | null> {
    const order = await this.getOrderById(id)
    if (!order) return null

    const paymentId = `payment_${await incrementCounter(this.paymentIdCounter)}`
    const now = new Date().toISOString()

    const newPayment: OrderPayment = {
      ...payment,
      id: paymentId,
      createdAt: now,
    }

    order.payments.push(newPayment)
    order.updatedAt = now

    await setValue(`${this.orderPrefix}${id}`, order)

    return order
  }

  async listOrdersByUser(userId: string, page = 1, limit = 20): Promise<Order[]> {
    const orderIds = await getSetMembers(`${this.userOrdersIndex}${userId}`)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = orderIds.slice(start, end)

    const orderKeys = paginatedIds.map((id) => `${this.orderPrefix}${id}`)
    const orders = await getMultipleValues<Order>(orderKeys)

    return orders.filter((order): order is Order => order !== null)
  }

  async listOrdersByStatus(status: OrderStatus, page = 1, limit = 20): Promise<Order[]> {
    const orderIds = await getSetMembers(`${this.statusIndex}${status}`)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = orderIds.slice(start, end)

    const orderKeys = paginatedIds.map((id) => `${this.orderPrefix}${id}`)
    const orders = await getMultipleValues<Order>(orderKeys)

    return orders.filter((order): order is Order => order !== null)
  }

  async listOrders(page = 1, limit = 20): Promise<Order[]> {
    const orderIds = await getSetMembers(this.orderList)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = orderIds.slice(start, end)

    const orderKeys = paginatedIds.map((id) => `${this.orderPrefix}${id}`)
    const orders = await getMultipleValues<Order>(orderKeys)

    return orders.filter((order): order is Order => order !== null)
  }

  async searchOrders(query: string): Promise<Order[]> {
    // This is a simple implementation that searches by order ID
    // In a real application, you might want to implement more sophisticated search
    const orderIds = await getSetMembers(this.orderList)
    const matchingIds = orderIds.filter((id) => id.includes(query))

    const orderKeys = matchingIds.map((id) => `${this.orderPrefix}${id}`)
    const orders = await getMultipleValues<Order>(orderKeys)

    return orders.filter((order): order is Order => order !== null)
  }
}
