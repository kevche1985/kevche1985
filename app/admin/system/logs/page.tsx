"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info, AlertCircle, Bug, RefreshCw, Search, Trash2, Calendar, X, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { logger } from "@/lib/logger"

// Define the LogEntry type locally to avoid import issues
interface LogEntry {
  id: string
  timestamp: number
  level: "info" | "warning" | "error" | "debug"
  category: string
  message: string
  details?: any
  source?: string
}

export default function LogsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [logs, setLogs] = useState<LogEntry[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [filters, setFilters] = useState({
    level: (searchParams.get("level") as "info" | "warning" | "error" | "debug" | "") || "",
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  })
  const [pagination, setPagination] = useState({
    offset: Number.parseInt(searchParams.get("offset") || "0", 10),
    limit: Number.parseInt(searchParams.get("limit") || "50", 10),
    hasMore: false,
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [pagination.offset, pagination.limit])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      queryParams.set("offset", pagination.offset.toString())
      queryParams.set("limit", pagination.limit.toString())

      if (filters.level) queryParams.set("level", filters.level)
      if (filters.category) queryParams.set("category", filters.category)
      if (filters.search) queryParams.set("search", filters.search)
      if (filters.startDate) queryParams.set("startDate", filters.startDate)
      if (filters.endDate) queryParams.set("endDate", filters.endDate)

      const response = await fetch(`/api/logs?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const text = await response.text()

      // Check if the response is empty
      if (!text) {
        setLogs([])
        setCategories([])
        return
      }

      // Try to parse the JSON
      let data
      try {
        data = JSON.parse(text)
      } catch (e) {
        console.error("Failed to parse response:", text)
        throw new Error(`Invalid JSON response: ${e.message}`)
      }

      // Check if data has the expected structure
      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format")
      }

      setLogs(Array.isArray(data.logs) ? data.logs : [])
      setCategories(Array.isArray(data.categories) ? data.categories : [])
      setPagination((prev) => ({
        ...prev,
        hasMore: Array.isArray(data.logs) && data.logs.length === pagination.limit,
      }))
    } catch (error) {
      console.error("Failed to fetch logs:", error)
      setError(`Failed to fetch logs: ${error.message}`)
      setLogs([])
      setCategories([])
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchLogs()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination((prev) => ({ ...prev, offset: 0 }))
    fetchLogs()

    // Update URL with search params
    const params = new URLSearchParams()
    if (filters.level) params.set("level", filters.level)
    if (filters.category) params.set("category", filters.category)
    if (filters.search) params.set("search", filters.search)
    if (filters.startDate) params.set("startDate", filters.startDate)
    if (filters.endDate) params.set("endDate", filters.endDate)

    router.push(`/admin/system/logs?${params.toString()}`)
  }

  const handleClearFilters = () => {
    setFilters({
      level: "",
      category: "",
      search: "",
      startDate: "",
      endDate: "",
    })
    setPagination((prev) => ({ ...prev, offset: 0 }))
    router.push("/admin/system/logs")
    fetchLogs()
  }

  const handleViewLog = (log: LogEntry) => {
    setSelectedLog(log)
    setIsDialogOpen(true)
  }

  const handleClearLogs = async () => {
    try {
      setError(null)
      const response = await fetch("/api/logs", { method: "DELETE" })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      setLogs([])
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to clear logs:", error)
      setError(`Failed to clear logs: ${error.message}`)
    }
  }

  const handleExportLogs = () => {
    const jsonString = JSON.stringify(logs, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `system-logs-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "debug":
        return <Bug className="h-4 w-4 text-purple-500" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Info
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Warning
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Error
          </Badge>
        )
      case "debug":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Debug
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Logs</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportLogs} disabled={logs.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={logs.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Logs
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Log Filters</CardTitle>
          <CardDescription>Filter logs by level, category, or search for specific content</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="level" className="text-sm font-medium">
                  Log Level
                </label>
                <Select
                  value={filters.level}
                  onValueChange={(value) =>
                    setFilters({ ...filters, level: value as "info" | "warning" | "error" | "debug" | "" })
                  }
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="search" className="text-sm font-medium">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search logs..."
                    className="pl-8"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="datetime-local"
                    className="pl-8"
                    value={filters.startDate}
                    onChange={(e) => {
                      const date = new Date(e.target.value).getTime()
                      setFilters({ ...filters, startDate: date.toString() })
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="datetime-local"
                    className="pl-8"
                    value={filters.endDate}
                    onChange={(e) => {
                      const date = new Date(e.target.value).getTime()
                      setFilters({ ...filters, endDate: date.toString() })
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="ghost" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Log Entries</CardTitle>
          <CardDescription>
            {logs.length === 0 ? "No logs found" : `Showing ${logs.length} log entries`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No logs found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {error ? "An error occurred while fetching logs" : "Try adjusting your filters or check back later"}
              </p>
              {!error && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => logger.info("system", "First log entry created")}
                >
                  Create Test Log
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Level</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="w-[40%]">Message</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow
                        key={log.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewLog(log)}
                      >
                        <TableCell>
                          <div className="flex items-center">
                            {getLevelIcon(log.level)}
                            <span className="ml-2 hidden md:inline">{log.level}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{formatDate(log.timestamp)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.category}</Badge>
                        </TableCell>
                        <TableCell className="truncate max-w-[300px]">{log.message}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewLog(log)
                            }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {pagination.offset + 1} to {pagination.offset + logs.length}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.offset === 0}
                    onClick={() => {
                      setPagination((prev) => ({
                        ...prev,
                        offset: Math.max(0, prev.offset - prev.limit),
                      }))
                    }}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasMore}
                    onClick={() => {
                      setPagination((prev) => ({
                        ...prev,
                        offset: prev.offset + prev.limit,
                      }))
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Create a test log entry
              fetch("/api/logs/test", { method: "POST" })
                .then(() => handleRefresh())
                .catch((err) => console.error("Failed to create test log:", err))
            }}
          >
            Create Test Log Entry
          </Button>
        </CardFooter>
      </Card>

      {/* Log Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLog && (
                <>
                  {getLevelIcon(selectedLog.level)}
                  <span>Log Details</span>
                  {getLevelBadge(selectedLog.level)}
                </>
              )}
            </DialogTitle>
            <DialogDescription>{selectedLog && formatDate(selectedLog.timestamp)}</DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
                <TabsTrigger value="source">Source</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                    <p className="text-sm">{selectedLog.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Level</h3>
                    <p className="text-sm">{selectedLog.level}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Message</h3>
                  <p className="text-sm mt-1 p-2 bg-muted rounded-md">{selectedLog.message}</p>
                </div>

                {selectedLog.details && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Details</h3>
                    <pre className="text-xs mt-1 p-2 bg-muted rounded-md overflow-auto max-h-[200px]">
                      {typeof selectedLog.details === "object"
                        ? JSON.stringify(selectedLog.details, null, 2)
                        : selectedLog.details}
                    </pre>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="json">
                <pre className="text-xs p-4 bg-muted rounded-md overflow-auto max-h-[400px]">
                  {JSON.stringify(selectedLog, null, 2)}
                </pre>
              </TabsContent>

              <TabsContent value="source">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Source</h3>
                  <pre className="text-xs mt-1 p-2 bg-muted rounded-md overflow-auto max-h-[200px]">
                    {selectedLog.source || "Source information not available"}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Logs</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all logs? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearLogs}>
              Clear All Logs
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
