import { getQuoteById } from "@/app/actions/quote-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { QuoteActions } from "../_components/quote-actions"

export default async function QuoteDetailPage({ params }: { params: { id: string } }) {
  const { quote, items } = await getQuoteById(params.id)

  function getStatusBadgeClass(status: string) {
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

  const validUntilDate = new Date(quote.valid_until).toLocaleDateString()
  const createdAtDate = new Date(quote.created_at).toLocaleDateString()

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/admin/quotes" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Quotes
        </Link>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quote {quote.quote_number}</h1>
          <p className="text-gray-600">Created on {createdAtDate}</p>
        </div>
        <div className="flex space-x-2">
          <QuoteActions quote={quote} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quote Details</CardTitle>
              <CardDescription>Items and pricing information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Description</th>
                      <th className="text-right py-2">Quantity</th>
                      <th className="text-right py-2">Unit Price</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2">{item.description}</td>
                        <td className="text-right py-2">{item.quantity}</td>
                        <td className="text-right py-2">{formatCurrency(item.unit_price)}</td>
                        <td className="text-right py-2">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-b">
                      <td colSpan={3} className="text-right py-2 font-medium">
                        Subtotal
                      </td>
                      <td className="text-right py-2">{formatCurrency(quote.subtotal)}</td>
                    </tr>
                    {quote.discount > 0 && (
                      <tr className="border-b">
                        <td colSpan={3} className="text-right py-2 font-medium">
                          Discount
                        </td>
                        <td className="text-right py-2">-{formatCurrency(quote.discount)}</td>
                      </tr>
                    )}
                    <tr className="border-b">
                      <td colSpan={3} className="text-right py-2 font-medium">
                        Tax
                      </td>
                      <td className="text-right py-2">{formatCurrency(quote.tax)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-right py-2 font-bold">
                        Total
                      </td>
                      <td className="text-right py-2 font-bold">{formatCurrency(quote.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {quote.notes && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Notes</h3>
                  <p className="text-gray-700 whitespace-pre-line">{quote.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{quote.customer_name}</p>
                  <p className="text-sm text-gray-600">{quote.customer_email}</p>
                  {quote.customer_phone && <p className="text-sm text-gray-600">{quote.customer_phone}</p>}
                </div>

                <div>
                  <p className="text-sm font-medium">Status</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full ${getStatusBadgeClass(quote.status)}`}>
                    {quote.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium">Valid Until</p>
                  <p className="text-sm">{validUntilDate}</p>
                </div>

                {quote.converted_to_order_id && (
                  <div>
                    <p className="text-sm font-medium">Converted to Order</p>
                    <Link
                      href={`/admin/orders/${quote.converted_to_order_id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Order
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
