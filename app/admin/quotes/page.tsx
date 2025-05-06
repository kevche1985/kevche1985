import { getQuotes } from "@/app/actions/quote-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { QuoteStatus } from "@/types/supabase"
import { formatCurrency } from "@/lib/utils"
import { PlusCircle, FileText, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"
import Link from "next/link"

export default async function QuotesPage() {
  const quotes = await getQuotes()

  // Group quotes by status
  const draftQuotes = quotes.filter((q) => q.status === "draft")
  const sentQuotes = quotes.filter((q) => q.status === "sent")
  const acceptedQuotes = quotes.filter((q) => q.status === "accepted")
  const otherQuotes = quotes.filter((q) => !["draft", "sent", "accepted"].includes(q.status))

  function getStatusBadgeClass(status: QuoteStatus) {
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

  function getStatusIcon(status: QuoteStatus) {
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
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quote Management</h1>
        <Link href="/admin/quotes/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Quote
          </Button>
        </Link>
      </div>

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
                    <Link href={`/admin/quotes/${quote.id}`} className="block hover:bg-gray-50">
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
                    <Link href={`/admin/quotes/${quote.id}`} className="block hover:bg-gray-50">
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
                    <Link href={`/admin/quotes/${quote.id}`} className="block hover:bg-gray-50">
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
            )}
          </CardContent>
        </Card>
      </div>

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
                  <Link href={`/admin/quotes/${quote.id}`} className="block hover:bg-gray-50">
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
