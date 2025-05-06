export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type QuoteStatus = "draft" | "sent" | "accepted" | "declined" | "expired" | "converted"
export type OrderStatus =
  | "cart"
  | "checkout"
  | "payment_pending"
  | "payment_completed"
  | "processing"
  | "ready_for_shipping"
  | "ready_for_pickup"
  | "shipped"
  | "picked_up"
  | "delivered"
  | "cancelled"
  | "refunded"
export type ShippingMethod = "delivery" | "pickup"
export type UserRole = "admin" | "operator" | "user"

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: UserRole
          is_active: boolean
          avatar_url: string | null
          created_at: string
          updated_at: string
          last_login_at: string | null
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: UserRole
          is_active?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: UserRole
          is_active?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
      }
      quotes: {
        Row: {
          id: string
          quote_number: string
          customer_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          subtotal: number
          tax: number
          discount: number
          total: number
          currency: string
          status: QuoteStatus
          valid_until: string
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
          converted_to_order_id: string | null
        }
        Insert: {
          id?: string
          quote_number: string
          customer_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          subtotal: number
          tax?: number
          discount?: number
          total: number
          currency?: string
          status?: QuoteStatus
          valid_until: string
          notes?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          converted_to_order_id?: string | null
        }
        Update: {
          id?: string
          quote_number?: string
          customer_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          subtotal?: number
          tax?: number
          discount?: number
          total?: number
          currency?: string
          status?: QuoteStatus
          valid_until?: string
          notes?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          converted_to_order_id?: string | null
        }
      }
      quote_items: {
        Row: {
          id: string
          quote_id: string
          product_id: string | null
          variant_id: string | null
          description: string
          quantity: number
          unit_price: number
          total: number
          customizations: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          product_id?: string | null
          variant_id?: string | null
          description: string
          quantity: number
          unit_price: number
          total: number
          customizations?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          quote_id?: string
          product_id?: string | null
          variant_id?: string | null
          description?: string
          quantity?: number
          unit_price?: number
          total?: number
          customizations?: Json | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          email: string
          subtotal: number
          tax: number
          shipping: number
          discount: number
          total: number
          currency: string
          status: OrderStatus
          shipping_method: ShippingMethod
          shipping_address: Json | null
          billing_address: Json | null
          payment_method: string | null
          notes: string | null
          metadata: Json | null
          quote_id: string | null
          supplier_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          email: string
          subtotal: number
          tax?: number
          shipping?: number
          discount?: number
          total: number
          currency?: string
          status?: OrderStatus
          shipping_method?: ShippingMethod
          shipping_address?: Json | null
          billing_address?: Json | null
          payment_method?: string | null
          notes?: string | null
          metadata?: Json | null
          quote_id?: string | null
          supplier_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          email?: string
          subtotal?: number
          tax?: number
          shipping?: number
          discount?: number
          total?: number
          currency?: string
          status?: OrderStatus
          shipping_method?: ShippingMethod
          shipping_address?: Json | null
          billing_address?: Json | null
          payment_method?: string | null
          notes?: string | null
          metadata?: Json | null
          quote_id?: string | null
          supplier_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
