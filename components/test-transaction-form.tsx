"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CreditCard, CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function TestTransactionForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    transactionId?: string
  } | null>(null)
  const [amount, setAmount] = useState("1.00")
  const [cardNumber, setCardNumber] = useState("4242424242424242")
  const [expiryMonth, setExpiryMonth] = useState("12")
  const [expiryYear, setExpiryYear] = useState("2025")
  const [cvv, setCvv] = useState("123")
  const [cardholderName, setCardholderName] = useState("Test User")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, you would call your API endpoint
      // const response = await fetch("/api/payments/wompi/test-transaction", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     amount,
      //     card: {
      //       number: cardNumber,
      //       expMonth: expiryMonth,
      //       expYear: expiryYear,
      //       cvv,
      //       holderName: cardholderName,
      //     },
      //   }),
      // })
      // const data = await response.json()

      // Simulate successful response
      setResult({
        success: true,
        message: "Test transaction completed successfully!",
        transactionId: "test_" + Math.random().toString(36).substring(2, 15),
      })
    } catch (error) {
      console.error("Test transaction error:", error)
      setResult({
        success: false,
        message: "Transaction failed. Please check the console for details.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Test Transaction</CardTitle>
        <CardDescription>Process a test transaction to verify your Wompi integration</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1.00"
              required
            />
            <p className="text-xs text-muted-foreground">Use a small amount for testing purposes</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242424242424242"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryMonth">Expiry Month</Label>
              <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                <SelectTrigger id="expiryMonth">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = (i + 1).toString().padStart(2, "0")
                    return (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryYear">Expiry Year</Label>
              <Select value={expiryYear} onValueChange={setExpiryYear}>
                <SelectTrigger id="expiryYear">
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = (new Date().getFullYear() + i).toString()
                    return (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                required
                maxLength={4}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Process Test Transaction
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>

      {result && (
        <CardFooter className="flex flex-col items-start">
          <Alert
            variant={result.success ? "default" : "destructive"}
            className={result.success ? "bg-green-50 border-green-200 text-green-800 w-full" : "w-full"}
          >
            {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>
              {result.message}
              {result.transactionId && (
                <div className="mt-2">
                  <span className="font-medium">Transaction ID:</span> {result.transactionId}
                </div>
              )}
            </AlertDescription>
          </Alert>
        </CardFooter>
      )}
    </Card>
  )
}
