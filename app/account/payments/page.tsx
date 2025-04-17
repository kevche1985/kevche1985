"use client"

import { useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Download, Eye } from "lucide-react"
import Link from "next/link"

export default function PaymentHistoryPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }

  const content = {
    en: {
      title: "Payment History",
      description: "View your past transactions and payment details",
      noPayments: "You don't have any payment history yet.",
      table: {
        date: "Date",
        orderId: "Order ID",
        amount: "Amount",
        status: "Status",
        method: "Payment Method",
        actions: "Actions",
      },
      status: {
        completed: "Completed",
        pending: "Pending",
        failed: "Failed",
        refunded: "Refunded",
      },
      viewDetails: "View Details",
      downloadReceipt: "Download Receipt",
    },
    es: {
      title: "Historial de Pagos",
      description: "Ver tus transacciones pasadas y detalles de pago",
      noPayments: "Aún no tienes historial de pagos.",
      table: {
        date: "Fecha",
        orderId: "ID de Pedido",
        amount: "Monto",
        status: "Estado",
        method: "Método de Pago",
        actions: "Acciones",
      },
      status: {
        completed: "Completado",
        pending: "Pendiente",
        failed: "Fallido",
        refunded: "Reembolsado",
      },
      viewDetails: "Ver Detalles",
      downloadReceipt: "Descargar Recibo",
    },
  }

  const t = language === "en" ? content.en : content.es

  // Mock payment data
  const payments = [
    {
      id: "pay-1",
      date: "2025-03-15",
      orderId: "ORD-1234",
      amount: 124.99,
      status: "completed",
      method: "Credit Card",
    },
    {
      id: "pay-2",
      date: "2025-02-28",
      orderId: "ORD-1189",
      amount: 89.5,
      status: "completed",
      method: "PayPal",
    },
    {
      id: "pay-3",
      date: "2025-02-10",
      orderId: "ORD-1156",
      amount: 45.75,
      status: "refunded",
      method: "Credit Card",
    },
    {
      id: "pay-4",
      date: "2025-01-22",
      orderId: "ORD-1098",
      amount: 199.99,
      status: "completed",
      method: "Bank Transfer",
    },
    {
      id: "pay-5",
      date: "2025-01-05",
      orderId: "ORD-1042",
      amount: 67.25,
      status: "completed",
      method: "Credit Card",
    },
  ]

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "pending":
        return "warning"
      case "failed":
        return "destructive"
      case "refunded":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
            <p className="text-muted-foreground">{t.description}</p>
          </div>
          <CreditCard className="h-8 w-8 text-primary" />
        </div>

        {payments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t.noPayments}</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.table.date}</TableHead>
                    <TableHead>{t.table.orderId}</TableHead>
                    <TableHead>{t.table.amount}</TableHead>
                    <TableHead>{t.table.status}</TableHead>
                    <TableHead>{t.table.method}</TableHead>
                    <TableHead className="text-right">{t.table.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {new Date(payment.date).toLocaleDateString(language === "en" ? "en-US" : "es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Link href={`/my-print/orders/${payment.orderId}`} className="font-medium hover:underline">
                          {payment.orderId}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(payment.status) as any}>
                          {t.status[payment.status as keyof typeof t.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/account/payments/${payment.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">{t.viewDetails}</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">{t.downloadReceipt}</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
