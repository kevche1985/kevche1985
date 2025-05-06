"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Eye,
  Printer,
  MoreHorizontal,
  Mail,
  RefreshCw,
  Truck,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { OrderTrackingBar } from "@/components/order-tracking-bar"

// Sample order data to use as fallback
const sampleOrders = [
  {
    id: "ORD-001",
    customer: "John Smith",
    email: "john@example.com",
    date: "2023-05-15",
    total: "$129.99",
    status: "completed",
    items: [
      { name: "Business Cards", quantity: 500, price: "$49.99" },
      { name: "Flyers", quantity: 200, price: "$80.00" },
    ],
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    date: "2023-05-16",
    total: "$89.50",
    status: "processing",
    items: [
      { name: "T-Shirt Print", quantity: 3, price: "$59.97" },
      { name: "Stickers", quantity: 50, price: "$29.53" },
    ],
  },
]

export default function AdminOrdersPage() {
  // Replace the hardcoded orders array with a state variable
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<
    ((typeof orders)[0] & { shippingMethod?: "pickup" | "delivery" }) | null
  >(null)

  // Add useEffect to fetch orders
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)

        // Use the context API to get orders if available
        const ordersFromContext = getOrdersFromContext()
        if (ordersFromContext && ordersFromContext.length > 0) {
          console.log("Using orders from context:", ordersFromContext.length)
          setOrders(ordersFromContext)
          setLoading(false)
          return
        }

        // Try localStorage next
        const ordersFromStorage = getOrdersFromLocalStorage()
        if (ordersFromStorage && ordersFromStorage.length > 0) {
          console.log("Using orders from localStorage:", ordersFromStorage.length)
          setOrders(ordersFromStorage)
          setLoading(false)
          return
        }

        // Fall back to sample data
        console.log("Using sample orders data")
        setOrders(sampleOrders)
      } catch (error) {
        console.error("Error in fetchOrders:", error)
        setOrders(sampleOrders)
      } finally {
        setLoading(false)
      }
    }

    function getOrdersFromContext() {
      // Try to get orders from any global state/context if available
      try {
        // This is a placeholder - in a real app, you'd access your state management
        // For example: return store.getState().orders
        return null
      } catch (e) {
        console.log("No orders in context")
        return null
      }
    }

    function getOrdersFromLocalStorage() {
      try {
        // Check for orders in localStorage
        const savedOrders = localStorage.getItem("orders")
        if (!savedOrders || savedOrders === "undefined" || savedOrders === "null") {
          return null
        }

        try {
          const parsedOrders = JSON.parse(savedOrders)
          if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
            return parsedOrders
          }
        } catch (e) {
          console.log("Error parsing localStorage data:", e)
        }
        return null
      } catch (e) {
        console.log("Error accessing localStorage:", e)
        return null
      }
    }

    fetchOrders()

    // Set up an interval to refresh orders every 30 seconds
    const intervalId = setInterval(fetchOrders, 30000)

    return () => clearInterval(intervalId)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "ready_for_pickup":
        return "bg-indigo-100 text-indigo-800"
      case "picked_up":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Format status for display
  const formatStatus = (status: string) => {
    if (!status) return "Unknown"

    // Replace underscores with spaces and capitalize each word
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const resendOrderEmail = async (orderId: string) => {
    try {
      // In a real implementation, this would call your API to resend the email
      console.log(`Resending email for order ${orderId}`)

      // Call the order confirmation email API
      const response = await fetch("/api/email/order-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          customerName: selectedOrder?.customer,
          customerEmail: selectedOrder?.email,
          customerAddress: "Customer address", // In a real app, you'd have this data
          customerCity: "Customer city", // In a real app, you'd have this data
          items: selectedOrder?.items || [],
          total:
            typeof selectedOrder?.total === "string"
              ? Number.parseFloat(selectedOrder.total.replace("$", "") || "0")
              : selectedOrder?.total || 0,
          shippingMethod: "regular", // In a real app, you'd have this data
          paymentMethod: "card", // In a real app, you'd have this data
        }),
      })

      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
      }

      // Check the content type to ensure we're getting JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        // Handle non-JSON response
        const text = await response.text()
        console.log("Non-JSON response:", text)
        alert("Email sent successfully, but received non-JSON response")
        return
      }

      // Now safely parse the JSON
      let result
      try {
        result = await response.json()
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError)
        // If we can't parse JSON but the response was OK, assume success
        alert("Email appears to have been sent, but couldn't parse server response")
        return
      }

      if (result && result.success) {
        alert("Order confirmation email resent successfully")
      } else {
        alert(`Failed to resend order confirmation email: ${result?.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error resending order email:", error)
      alert(
        `An error occurred while trying to resend the email: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }

  // Function to manually refresh orders
  const refreshOrders = () => {
    setLoading(true)
    // In a real app, this would re-fetch from your API
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Check if this is a pickup order and adjust status if needed
      let adjustedStatus = newStatus

      if (selectedOrder?.shippingMethod === "pickup") {
        // For pickup orders, we might want to use different status values
        if (newStatus === "shipped") {
          adjustedStatus = "ready_for_pickup"
        } else if (newStatus === "delivered") {
          adjustedStatus = "picked_up"
        }
      }

      // Call the updateOrderStatus function to change the status
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: adjustedStatus,
          note: `Order status updated to ${adjustedStatus} by admin`,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update order status: ${response.statusText}`)
      }

      // Update the local state to reflect the change
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: adjustedStatus } : order)),
      )

      // If this is the selected order, update it too
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: adjustedStatus,
        })
      }

      alert(`Order status updated to ${formatStatus(adjustedStatus)}`)
    } catch (error) {
      console.error("Error updating order status:", error)
      alert(`Failed to update order status: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Map status values to tracking bar status values
  const mapStatusToTrackingStatus = (status: string, shippingMethod: "pickup" | "delivery" = "delivery") => {
    // For pickup orders
    if (shippingMethod === "pickup") {
      switch (status) {
        case "pending":
        case "checkout-complete":
          return "checkout-complete"
        case "processing":
          return "processing"
        case "ready_for_pickup":
          return "ready-for-pickup"
        case "picked_up":
          return "delivered"
        case "cancelled":
          return "cancelled"
        default:
          return status
      }
    }

    // For delivery orders
    switch (status) {
      case "pending":
      case "checkout-complete":
        return "checkout-complete"
      case "processing":
        return "processing"
      case "ready_for_shipping":
        return "ready-for-shipping"
      case "shipped":
        return "shipped"
      case "delivered":
        return "delivered"
      case "cancelled":
        return "cancelled"
      default:
        return status
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Order Management</h1>

        <Tabs defaultValue="all">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <div className="flex mt-4 md:mt-0 space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search orders..." className="pl-8 w-[200px] md:w-[300px]" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={refreshOrders}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order, index) => (
                        <TableRow key={order.id || `order-${index}`}>
                          <TableCell className="font-medium">{order.id || "N/A"}</TableCell>
                          <TableCell>
                            {order.customer || (order.billingAddress && order.billingAddress.name) || "N/A"}
                          </TableCell>
                          <TableCell>
                            {order.date
                              ? typeof order.date === "string"
                                ? order.date
                                : new Date(order.date).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {order.total
                              ? typeof order.total === "string"
                                ? order.total
                                : `$${typeof order.total === "number" ? order.total.toFixed(2) : order.total}`
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {order.status ? (
                              <Badge className={getStatusColor(order.status)} variant="outline">
                                {formatStatus(order.status)}
                              </Badge>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Printer className="mr-2 h-4 w-4" />
                                  Print invoice
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Update status</DropdownMenuItem>
                                <DropdownMenuItem>Contact customer</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No orders found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedOrder && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Details: {selectedOrder.id}</CardTitle>
                  <CardDescription>
                    Placed on {selectedOrder.date} by {selectedOrder.customer}
                  </CardDescription>
                  <OrderTrackingBar
                    key={`${selectedOrder.id}-${selectedOrder.status}`} // Add a key to force re-render when status changes
                    currentStatus={mapStatusToTrackingStatus(selectedOrder.status, selectedOrder.shippingMethod)}
                    shippingMethod={selectedOrder.shippingMethod || "delivery"}
                    className="mt-4"
                  />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                      <p className="text-sm">
                        <strong>Name:</strong> {selectedOrder.customer}
                      </p>
                      <p className="text-sm">
                        <strong>Email:</strong> {selectedOrder.email}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Order Summary</h3>
                      <p className="text-sm">
                        <strong>Total:</strong> {selectedOrder.total}
                      </p>
                      <p className="text-sm">
                        <strong>Status:</strong>{" "}
                        <Badge className={getStatusColor(selectedOrder.status)} variant="outline">
                          {formatStatus(selectedOrder.status)}
                        </Badge>
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => resendOrderEmail(selectedOrder.id)}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Resend Order Email
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Order Items</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items &&
                          selectedOrder.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell className="text-right">{item.price}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateOrderStatus(selectedOrder.id, "processing")}
                        disabled={selectedOrder.status === "processing"}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Processing
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateOrderStatus(selectedOrder.id, "ready_for_shipping")}
                        disabled={selectedOrder.status === "ready_for_shipping"}
                      >
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Ready for Shipping
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // For pickup orders, use ready_for_pickup status instead of shipped
                          const newStatus = selectedOrder.shippingMethod === "pickup" ? "ready_for_pickup" : "shipped"
                          updateOrderStatus(selectedOrder.id, newStatus)
                        }}
                        disabled={selectedOrder.status === "shipped" || selectedOrder.status === "ready_for_pickup"}
                      >
                        <Truck className="mr-2 h-4 w-4" />
                        {selectedOrder.shippingMethod === "pickup" ? "Ready for Pickup" : "Shipped"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateOrderStatus(selectedOrder.id, "delivered")}
                        disabled={selectedOrder.status === "delivered" || selectedOrder.status === "picked_up"}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {selectedOrder.shippingMethod === "pickup" ? "Picked Up" : "Delivered"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => updateOrderStatus(selectedOrder.id, "cancelled")}
                        disabled={selectedOrder.status === "cancelled"}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Invoice
                      </Button>
                      <Button variant="outline">Contact Customer</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Other tabs would have similar content but filtered by status */}
          <TabsContent value="pending">
            <Card>
              <CardContent className="p-6">
                <p>Pending orders will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="processing">
            <Card>
              <CardContent className="p-6">
                <p>Processing orders will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="shipped">
            <Card>
              <CardContent className="p-6">
                <p>Shipped orders will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed">
            <Card>
              <CardContent className="p-6">
                <p>Completed orders will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
