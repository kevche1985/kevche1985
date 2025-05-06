"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { PlusCircle, FileText, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Sample quote data
const sampleQuotes = [
  {
    id: "1",
    quote_number: "QT-2023-0001",
    customer_name: "Acme Corp",
    customer_email: "contact@acmecorp.com",
    total: 1250.0,
    status: "draft",
    created_at: "2023-05-10",
    valid_until: "2023-06-10",
  },
  {
    id: "2",
    quote_number: "QT-2023-0002",
    customer_name: "TechStart Inc",
    customer_email: "info@techstart.com",
    total: 3750.5,
    status: "sent",
    created_at: "2023-05-12",
    valid_until: "2023-06-12",
  },
  {
    id: "3",
    quote_number: "QT-2023-0003",
    customer_name: "Global Solutions",
    customer_email: "orders@globalsolutions.com",
    total: 5200.0,
    status: "accepted",
    created_at: "2023-05-15",
    valid_until: "2023-06-15",
  },
  {
    id: "4",
    quote_number: "QT-2023-0004",
    customer_name: "Local Business",
    customer_email: "contact@localbusiness.com",
    total: 950.75,
    status: "declined",
    created_at: "2023-05-18",
    valid_until: "2023-06-18",
  },
  {
    id: "5",
    quote_number: "QT-2023-0005",
    customer_name: "Creative Agency",
    customer_email: "projects@creativeagency.com",
    total: 2800.25,
    status: "expired",
    created_at: "2023-04-20",
    valid_until: "2023-05-20",
  },
  {
    id: "6",
    quote_number: "QT-2023-0006",
    customer_name: "Retail Chain",
    customer_email: "procurement@retailchain.com",
    total: 8500.0,
    status: "converted",
    created_at: "2023-05-05",
    valid_until: "2023-06-05",
  },
]

export default function OperatorQuotesPage() {
  const { toast } = useToast()
  const [quotes, setQuotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // For now, we'll use sample data
      setTimeout(() => {
        setQuotes(sampleQuotes)
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching quotes:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching quotes",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Group quotes by status
  const draftQuotes = quotes.filter((q) => q.status === "draft")
  const sentQuotes = quotes.filter((q) => q.status === "sent")
  const acceptedQuotes = quotes.filter((q) => q.status === "accepted")
  const otherQuotes = quotes.filter((q) => !["draft", "sent", "accepted"].includes(q.status))

  function getStatusBadgeClass(status) {
    switch (status) {
      case "draft":
        return "bg-gray-200 text-gray-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "declined":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-yellow-100 text-yellow-800"
      case "converted":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case "draft":
        return <FileText className="h-4 w-4" />
      case "sent":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "declined":
        return <XCircle className="h-4 w-4" />
      case "expired":
        return <Clock className="h-4 w-4" />
      case "converted":
        return <RefreshCw className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quote Management</h1>
        <Link href="/operator/dashboard/quotes/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Quote
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Draft Quotes */}
          <Card>
            <CardHeader>
              <CardTitle>Draft Quotes</CardTitle>
              <CardDescription>Quotes that are still being prepared</CardDescription>
            </CardHeader>
            <CardContent>
              {draftQuotes.length === 0 ? (
                <p className="text-sm text-gray-500">No draft quotes</p>
              ) : (
                <ul className="space-y-3">
                  {draftQuotes.map((quote) => (
                    <li key={quote.id} className="border rounded-md p-3">
                      <Link href={`/operator/dashboard/quotes/${quote.id}`} className="block hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{quote.quote_number}</p>
                            <p className="text-sm text-gray-600">{quote.customer_name}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">{formatCurrency(quote.total)}</span>
                            <span
                              className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(quote.status)}`}
                            >
                              {getStatusIcon(quote.status)}
                              <span className="ml-1">{quote.status}</span>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Sent Quotes */}
          <Card>
            <CardHeader>
              <CardTitle>Sent Quotes</CardTitle>
              <CardDescription>Quotes that have been sent to customers</CardDescription>
            </CardHeader>
            <CardContent>
              {sentQuotes.length === 0 ? (
                <p className="text-sm text-gray-500">No sent quotes</p>
              ) : (
                <ul className="space-y-3">
                  {sentQuotes.map((quote) => (
                    <li key={quote.id} className="border rounded-md p-3">
                      <Link href={`/operator/dashboard/quotes/${quote.id}`} className="block hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{quote.quote_number}</p>
                            <p className="text-sm text-gray-600">{quote.customer_name}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">{formatCurrency(quote.total)}</span>
                            <span
                              className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(quote.status)}`}
                            >
                              {getStatusIcon(quote.status)}
                              <span className="ml-1">{quote.status}</span>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Accepted Quotes */}
          <Card>
            <CardHeader>
              <CardTitle>Accepted Quotes</CardTitle>
              <CardDescription>Quotes that have been accepted by customers</CardDescription>
            </CardHeader>
            <CardContent>
              {acceptedQuotes.length === 0 ? (
                <p className="text-sm text-gray-500">No accepted quotes</p>
              ) : (
                <ul className="space-y-3">
                  {acceptedQuotes.map((quote) => (
                    <li key={quote.id} className="border rounded-md p-3">
                      <Link href={`/operator/dashboard/quotes/${quote.id}`} className="block hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{quote.quote_number}</p>
                            <p className="text-sm text-gray-600">{quote.customer_name}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">{formatCurrency(quote.total)}</span>
                            <span
                              className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(quote.status)}`}
                            >
                              {getStatusIcon(quote.status)}
                              <span className="ml-1">{quote.status}</span>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Other Quotes */}
      {otherQuotes.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Other Quotes</CardTitle>
            <CardDescription>Declined, expired, and converted quotes</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {otherQuotes.map((quote) => (
                <li key={quote.id} className="border rounded-md p-3">
                  <Link href={`/operator/dashboard/quotes/${quote.id}`} className="block hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{quote.quote_number}</p>
                        <p className="text-sm text-gray-600">{quote.customer_name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">{formatCurrency(quote.total)}</span>
                        <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(quote.status)}`}>
                          {getStatusIcon(quote.status)}
                          <span className="ml-1">{quote.status}</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
