"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { Users, ShoppingCart, FileText, Package, TrendingUp, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function OperatorDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    pendingOrders: 0,
    activeQuotes: 0,
    lowStockProducts: 0,
    newUsers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        setTimeout(() => {
          setStats({
            pendingOrders: 12,
            activeQuotes: 5,
            lowStockProducts: 8,
            newUsers: 3,
          })
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operator Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || "Operator"}</p>
        </div>
        <div className="flex items-center gap-x-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Activity Log
          </Button>
          <Button size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Requires processing</p>
            <Button variant="link" size="sm" className="px-0 mt-2" asChild>
              <Link href="/operator/dashboard/orders">View all orders</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.activeQuotes}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
            <Button variant="link" size="sm" className="px-0 mt-2" asChild>
              <Link href="/operator/dashboard/quotes">Manage quotes</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
            <Button variant="link" size="sm" className="px-0 mt-2" asChild>
              <Link href="/operator/dashboard/products">View inventory</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.newUsers}</div>
            <p className="text-xs text-muted-foreground">In the last 24 hours</p>
            <Button variant="link" size="sm" className="px-0 mt-2" asChild>
              <Link href="/operator/dashboard/users">Manage users</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="recent">
          <TabsList>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions and updates in the system</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 rounded-md border p-4">
                      <ShoppingCart className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">New order received</p>
                        <p className="text-sm text-muted-foreground">Order #ORD-2023-1234 from John Smith</p>
                        <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 rounded-md border p-4">
                      <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Quote accepted</p>
                        <p className="text-sm text-muted-foreground">Quote #QT-2023-0089 from Acme Corp</p>
                        <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 rounded-md border p-4">
                      <Users className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">New user registered</p>
                        <p className="text-sm text-muted-foreground">Sarah Johnson (sarah@example.com)</p>
                        <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="alerts" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Important notifications requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 rounded-md border border-amber-200 bg-amber-50 p-4">
                      <AlertCircle className="h-5 w-5 mt-0.5 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-900">Low stock alert</p>
                        <p className="text-sm text-amber-700">Business Cards (Premium) has only 15 units left</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Reorder
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 rounded-md border border-amber-200 bg-amber-50 p-4">
                      <AlertCircle className="h-5 w-5 mt-0.5 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-900">Delayed order</p>
                        <p className="text-sm text-amber-700">Order #ORD-2023-1198 is 2 days past the delivery date</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Check Status
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tasks" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Tasks requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-md border p-4">
                      <div className="flex items-center gap-4">
                        <input type="checkbox" className="h-4 w-4" />
                        <div>
                          <p className="font-medium">Process order #ORD-2023-1234</p>
                          <p className="text-sm text-muted-foreground">Due in 2 hours</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-4">
                      <div className="flex items-center gap-4">
                        <input type="checkbox" className="h-4 w-4" />
                        <div>
                          <p className="font-medium">Follow up on quote #QT-2023-0076</p>
                          <p className="text-sm text-muted-foreground">Due tomorrow</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-4">
                      <div className="flex items-center gap-4">
                        <input type="checkbox" className="h-4 w-4" />
                        <div>
                          <p className="font-medium">Update product inventory</p>
                          <p className="text-sm text-muted-foreground">Due in 3 days</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
