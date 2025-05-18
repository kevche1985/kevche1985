"use client"

import { useState } from "react"
import { CheckCircle2, Circle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
}

export function DeploymentChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "wompi-credentials",
      title: "Wompi Production Credentials",
      description: "Obtain production Client ID and Client Secret from Wompi",
      completed: false,
      required: true,
    },
    {
      id: "env-variables",
      title: "Environment Variables",
      description: "Set WOMPI_CLIENT_ID, WOMPI_CLIENT_SECRET, and WOMPI_WEBHOOK_SECRET in production",
      completed: false,
      required: true,
    },
    {
      id: "webhook-url",
      title: "Configure Webhook URL",
      description: "Register your production webhook URL in Wompi dashboard",
      completed: false,
      required: true,
    },
    {
      id: "redirect-url",
      title: "Configure Redirect URL",
      description: "Register your production redirect URL in Wompi dashboard",
      completed: false,
      required: true,
    },
    {
      id: "test-transaction",
      title: "Test Transaction",
      description: "Perform a test transaction with a real card in production",
      completed: false,
      required: true,
    },
    {
      id: "error-logging",
      title: "Error Logging",
      description: "Ensure payment errors are properly logged",
      completed: false,
      required: true,
    },
    {
      id: "monitoring",
      title: "Transaction Monitoring",
      description: "Set up monitoring for payment transactions",
      completed: false,
      required: false,
    },
    {
      id: "backup",
      title: "Database Backup",
      description: "Create a backup of your database before going live",
      completed: false,
      required: false,
    },
  ])

  const toggleItem = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const incompleteRequiredItems = items.filter((item) => item.required && !item.completed)
  const readyForProduction = incompleteRequiredItems.length === 0

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Wompi Production Deployment Checklist</CardTitle>
        <CardDescription>Complete these items before deploying Wompi payments to production</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <button
                onClick={() => toggleItem(item.id)}
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
              >
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="sr-only">{item.completed ? "Completed" : "Mark as complete"}</span>
              </button>
              <div>
                <div className="font-medium">
                  {item.title}
                  {item.required && <span className="ml-2 text-sm text-red-500">*</span>}
                </div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        {!readyForProduction && (
          <Alert variant="warning" className="w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not ready for production</AlertTitle>
            <AlertDescription>
              You have {incompleteRequiredItems.length} required items to complete before going live.
            </AlertDescription>
          </Alert>
        )}
        {readyForProduction && (
          <Alert className="w-full bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Ready for production</AlertTitle>
            <AlertDescription>All required items are completed. You're ready to deploy to production.</AlertDescription>
          </Alert>
        )}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setItems(items.map((item) => ({ ...item, completed: false })))}>
            Reset
          </Button>
          <Button variant="default" onClick={() => setItems(items.map((item) => ({ ...item, completed: true })))}>
            Mark All Complete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
