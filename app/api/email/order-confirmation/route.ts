import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/mail"
import { logInfo, logError } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    logInfo("order", "Processing order confirmation email request")

    const data = await request.json()
    const {
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      items,
      total,
      shippingMethod,
      paymentMethod,
    } = data

    logInfo("order", `Received order confirmation request for order ${orderId}`, {
      orderId,
      customerName,
    })

    // Use the correct supplier email for Delivery Print
    const supplierEmail = "deliveryondemand@groupdeliveryprint.com"

    logInfo("order", `Sending order confirmation to supplier: ${supplierEmail}`)

    // Format items for email with detailed product information
    const itemsList = items
      .map((item: any) => {
        // Build a detailed description of the item including customization details
        let customizationDetails = ""
        if (item.customization) {
          const customization = item.customization

          if (customization.text) {
            customizationDetails += `<br>- Custom Text: ${customization.text}`
          }

          if (customization.color) {
            customizationDetails += `<br>- Color: ${customization.color}`
          }

          if (customization.design) {
            customizationDetails += `<br>- Design: ${customization.design}`
          }

          if (customization.aiGenerated) {
            customizationDetails += `<br>- AI-Generated Design`

            if (customization.originalUrl) {
              customizationDetails += `<br>- Original Image URL: ${customization.originalUrl}`
            }
          }
        }

        return `
          <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
            <strong>${item.name}</strong> - $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}
            <br>
            <span style="font-size: 14px; color: #666;">
              Category: ${item.category}
              ${customizationDetails}
            </span>
          </div>
        `
      })
      .join("")

    // Create HTML email content with more detailed information
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
          New Order: ${orderId}
        </h2>
        
        <p>A new order has been placed and requires your attention.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #d32f2f;">
          <h3 style="margin-top: 0;">Order Details:</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Amount:</strong> $${total.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p><strong>Shipping Method:</strong> ${shippingMethod}</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #4caf50;">
          <h3 style="margin-top: 0;">Customer Information:</h3>
          <p><strong>Name:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail || "Not provided"}</p>
          <p><strong>Phone:</strong> ${customerPhone || "Not provided"}</p>
          <p><strong>Address:</strong> ${customerAddress}</p>
          <p><strong>City:</strong> ${customerCity}</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #2196f3;">
          <h3 style="margin-top: 0;">Order Items:</h3>
          ${itemsList}
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #ff9800;">
          <h3 style="margin-top: 0;">Order Summary:</h3>
          <p><strong>Subtotal:</strong> $${(total - (shippingMethod === "pickup" ? 0 : getShippingCost(shippingMethod))).toFixed(2)}</p>
          <p><strong>Shipping:</strong> $${shippingMethod === "pickup" ? "0.00" : getShippingCost(shippingMethod).toFixed(2)}</p>
          <p style="font-size: 18px; font-weight: bold; color: #d32f2f;"><strong>Order Total:</strong> $${total.toFixed(2)}</p>
        </div>
        
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        
        <p>Please process this order as soon as possible.</p>
        <p style="font-size: 12px; color: #666; margin-top: 30px;">
          This is an automated message from DeliveryOnDemand.
        </p>
      </div>
    `

    // Send email to supplier
    const emailSent = await sendEmail({
      to: supplierEmail,
      subject: `New Order: ${orderId}`,
      html,
    })

    logInfo("order", `Email sending result for order ${orderId}: ${emailSent ? "Success" : "Failed"}`)

    return NextResponse.json({
      success: true,
      message: "Order confirmation email sent",
      emailSent,
    })
  } catch (error) {
    logError("order", "Error sending order confirmation email", {
      error: error instanceof Error ? error.message : String(error),
    })

    console.error("Error sending order confirmation email:", error)

    // Ensure we always return a properly formatted JSON response
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Helper function to get shipping cost
function getShippingCost(method: string): number {
  switch (method) {
    case "urgent":
      return 10
    case "priority":
      return 5
    case "regular":
      return 3
    default:
      return 0
  }
}
