"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CreditCard, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function WompiTestCards() {
  const [testCards, setTestCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestCards = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/payments/wompi/test-cards")

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text()
          console.error("Non-JSON response:", text)
          throw new Error("Response is not JSON")
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Unknown error")
        }

        setTestCards(data.testCards || [])
      } catch (err) {
        console.error("Error fetching test cards:", err)
        setError(err instanceof Error ? err.message : "Failed to load test cards")
      } finally {
        setLoading(false)
      }
    }

    fetchTestCards()
  }, [])

  const copyCardInfo = (card: any) => {
    const cardInfo = `Card: ${card.type}
Number: ${card.number}
CVV: ${card.cvv}
Expiration: ${card.expirationMonth}/${card.expirationYear}`

    navigator.clipboard
      .writeText(cardInfo)
      .then(() => {
        alert("Card info copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy card info:", err)
      })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Wompi Test Cards
        </CardTitle>
        <CardDescription>
          Use these test cards to simulate different payment scenarios in the Wompi sandbox environment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading test cards...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : testCards.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No test cards found</AlertTitle>
            <AlertDescription>No test cards are available at this time.</AlertDescription>
          </Alert>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Card Type</TableHead>
                <TableHead>Card Number</TableHead>
                <TableHead>CVV</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Description</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testCards.map((card, index) => (
                <TableRow key={index}>
                  <TableCell>{card.type}</TableCell>
                  <TableCell className="font-mono">{card.number}</TableCell>
                  <TableCell>{card.cvv}</TableCell>
                  <TableCell>
                    {card.expirationMonth}/{card.expirationYear}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        card.result === "Approved"
                          ? "bg-green-100 text-green-800"
                          : card.result === "Declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {card.result}
                    </span>
                  </TableCell>
                  <TableCell>{card.description}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => copyCardInfo(card)}>
                      Copy
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
