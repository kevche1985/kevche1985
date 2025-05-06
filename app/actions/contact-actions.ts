"use server"

import { mailService } from "@/lib/mail"
import { logger } from "@/lib/logger"
import { z } from "zod"

// Define validation schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  subject: z.string().min(2, { message: "Subject must be at least 2 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export async function submitContactForm(formData: FormData) {
  try {
    // Extract form data
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || "",
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    }

    // Validate form data
    const validationResult = contactFormSchema.safeParse(data)

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors
      return { success: false, errors }
    }

    // Log the contact request
    await logger.info("contact", "New contact form submission", {
      name: data.name,
      email: data.email,
      subject: data.subject,
    })

    // Try to get the contact template
    let template = await mailService.getTemplate("contact")

    // If no template found, use a default one
    if (!template) {
      template = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {{name}}</p>
        <p><strong>Email:</strong> {{email}}</p>
        <p><strong>Phone:</strong> {{phone}}</p>
        <p><strong>Subject:</strong> {{subject}}</p>
        <h3>Message:</h3>
        <p>{{message}}</p>
      `
    }

    // Replace template variables
    const html = template
      .replace(/{{name}}/g, data.name)
      .replace(/{{email}}/g, data.email)
      .replace(/{{phone}}/g, data.phone || "Not provided")
      .replace(/{{subject}}/g, data.subject)
      .replace(/{{message}}/g, data.message.replace(/\n/g, "<br>"))

    // Send email to admin
    const emailSent = await mailService.sendEmail({
      to: "deliveryondemand@groupdeliveryprint.com",
      subject: `Contact Form: ${data.subject}`,
      html,
      text: `
        New Contact Form Submission
        
        Name: ${data.name}
        Email: ${data.email}
        Phone: ${data.phone || "Not provided"}
        Subject: ${data.subject}
        
        Message:
        ${data.message}
      `,
    })

    if (!emailSent) {
      await logger.error("contact", "Failed to send contact form email", {
        email: data.email,
        subject: data.subject,
      })
      return {
        success: false,
        errors: { form: ["Failed to send your message. Please try again later."] },
      }
    }

    // Send confirmation email to the customer
    try {
      // Try to get the contact response template
      let responseTemplate = await mailService.getTemplate("contact-response")

      // If no template found, use a default one
      if (!responseTemplate) {
        responseTemplate = `
          <h2>Thank You for Contacting Us</h2>
          <p>Dear {{name}},</p>
          <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
          <p>Here's a summary of your inquiry:</p>
          <p><strong>Subject:</strong> {{subject}}</p>
          <p><strong>Message:</strong></p>
          <p>{{message}}</p>
          <p>If you have any additional questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>The Delivery on Demand Team</p>
        `
      }

      // Replace template variables
      const responseHtml = responseTemplate
        .replace(/{{name}}/g, data.name)
        .replace(/{{email}}/g, data.email)
        .replace(/{{subject}}/g, data.subject)
        .replace(/{{message}}/g, data.message.replace(/\n/g, "<br>"))

      // Send confirmation email
      await mailService.sendEmail({
        to: data.email,
        subject: "Thank You for Contacting Delivery on Demand",
        html: responseHtml,
      })
    } catch (error) {
      // Log error but don't fail the whole process if confirmation email fails
      await logger.error("contact", "Failed to send confirmation email", {
        error: error instanceof Error ? error.message : String(error),
        email: data.email,
      })
    }

    return { success: true }
  } catch (error) {
    await logger.error("contact", "Error processing contact form", {
      error: error instanceof Error ? error.message : String(error),
    })
    return {
      success: false,
      errors: { form: ["An unexpected error occurred. Please try again later."] },
    }
  }
}
