"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuoteForm } from "../_components/quote-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CreateQuotePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/admin/quotes" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Quotes
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Create New Quote</h1>

      <Card>
        <CardHeader>
          <CardTitle>Quote Details</CardTitle>
          <CardDescription>Create a new quote for a customer</CardDescription>
        </CardHeader>
        <CardContent>
          <QuoteForm />
        </CardContent>
      </Card>
    </div>
  )
}
