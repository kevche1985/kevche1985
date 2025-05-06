"use client"

import { updateQuoteStatus, convertQuoteToOrder, deleteQuote } from "@/app/actions/quote-actions"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { QuoteStatus } from "@/types/supabase"
import { FileText, Send, CheckCircle, XCircle, Trash2, RefreshCw, MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

interface QuoteActionsProps {
  quote: {
    id: string
    status: QuoteStatus
    converted_to_order_id: string | null
  }
}

export function QuoteActions({ quote }: QuoteActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false)

  const handleStatusUpdate = async (status: QuoteStatus) => {
    try {
      setIsLoading(true)
      await updateQuoteStatus(quote.id, status)
      toast({
        title: "Quote updated",
        description: `Quote status changed to ${status}`,
      })
    } catch (error) {
      console.error("Error updating quote status:", error)
      toast({
        title: "Error",
        description: "Failed to update quote status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConvertToOrder = async () => {
    try {
      setIsLoading(true)
      const order = await convertQuoteToOrder(quote.id)
      setIsConvertDialogOpen(false)
      toast({
        title: "Quote converted",
        description: "Quote has been converted to an order",
      })
      router.push(`/admin/orders/${order.id}`)
    } catch (error) {
      console.error("Error converting quote to order:", error)
      toast({
        title: "Error",
        description: "Failed to convert quote to order",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await deleteQuote(quote.id)
      setIsDeleteDialogOpen(false)
      toast({
        title: "Quote deleted",
        description: "Quote has been permanently deleted",
      })
      router.push("/admin/quotes")
    } catch (error) {
      console.error("Error deleting quote:", error)
      toast({
        title: "Error",
        description: "Failed to delete quote",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {quote.status === "draft" && (
        <Button variant="outline" onClick={() => handleStatusUpdate("sent")} disabled={isLoading}>
          <Send className="mr-2 h-4 w-4" />
          Send Quote
        </Button>
      )}

      {quote.status === "sent" && (
        <>
          <Button variant="outline" onClick={() => handleStatusUpdate("accepted")} disabled={isLoading}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Accepted
          </Button>
          <Button variant="outline" onClick={() => handleStatusUpdate("declined")} disabled={isLoading}>
            <XCircle className="mr-2 h-4 w-4" />
            Mark as Declined
          </Button>
        </>
      )}

      {quote.status === "accepted" && !quote.converted_to_order_id && (
        <Button onClick={() => setIsConvertDialogOpen(true)} disabled={isLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Convert to Order
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {quote.status !== "draft" && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("draft")}>
              <FileText className="mr-2 h-4 w-4" />
              Mark as Draft
            </DropdownMenuItem>
          )}

          {quote.status !== "sent" && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("sent")}>
              <Send className="mr-2 h-4 w-4" />
              Mark as Sent
            </DropdownMenuItem>
          )}

          {quote.status !== "accepted" && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("accepted")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Accepted
            </DropdownMenuItem>
          )}

          {quote.status !== "declined" && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("declined")}>
              <XCircle className="mr-2 h-4 w-4" />
              Mark as Declined
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Quote
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quote and all its items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Convert to Order</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a new order based on this quote. The quote status will be changed to 'converted'.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConvertToOrder} disabled={isLoading}>
              Convert
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
