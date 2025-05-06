"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertCircle, Loader2, Info, Mail, Settings, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Helper function to detect if we're in a preview/development environment
const isPreviewEnvironment = () => {
  // Check for preview environment indicators
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.VERCEL_ENV === "development" ||
    typeof window !== "undefined" || // Browser environment
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
  )
}

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
  from: string
}

interface Template {
  key: string
  name: string
  content: string
}

// Default templates
const defaultTemplates: Template[] = [
  {
    key: "contact",
    name: "Contact Form Response",
    content: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Thank You for Contacting Us</h2>
    </div>
    <div class="content">
      <p>Dear {{name}},</p>
      <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
      <p>Here's a summary of your inquiry:</p>
      <p><strong>Subject:</strong> {{subject}}</p>
      <p><strong>Message:</strong></p>
      <p>{{message}}</p>
      <p>If you have any additional questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The Delivery on Demand Team</p>
    </div>
    <div class="footer">
      <p>© 2023 Delivery on Demand. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  },
  {
    key: "order",
    name: "Order Confirmation",
    content: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .order-details { background-color: #f8f9fa; padding: 15px; margin: 15px 0; }
    .item { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Order Confirmation</h2>
    </div>
    <div class="content">
      <p>Dear {{name}},</p>
      <p>Thank you for your order! We're pleased to confirm that we've received your order and it's being processed.</p>
      <div class="order-details">
        <p><strong>Order Number:</strong> {{orderNumber}}</p>
        <p><strong>Order Date:</strong> {{orderDate}}</p>
        <h3>Order Summary:</h3>
        <div class="items">
          {{#items}}
          <div class="item">
            <span>{{name}} x {{quantity}}</span>\
            <span>${"{{price}}"}</span>
          </div>
          {{/items}}
        </div>
        <div class="item" style="margin-top: 15px; border-top: 1px solid #ddd; padding-top: 10px;">
          <strong>Total:</strong>
          <strong>${"{{total}}"}</strong>
        </div>
      </div>
      <p>You can track your order status by logging into your account or using the tracking number provided in a separate email.</p>
      <p>If you have any questions about your order, please contact our customer service team.</p>
      <p>Thank you for choosing Delivery on Demand!</p>
      <p>Best regards,<br>The Delivery on Demand Team</p>
    </div>
    <div class="footer">
      <p>© 2023 Delivery on Demand. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  },
  {
    key: "quote",
    name: "Quote Response",
    content: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .quote-details { background-color: #f8f9fa; padding: 15px; margin: 15px 0; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Your Custom Quote</h2>
    </div>
    <div class="content">
      <p>Dear {{name}},</p>
      <p>Thank you for requesting a quote from Delivery on Demand. We're pleased to provide you with the following quote based on your requirements:</p>
      <div class="quote-details">
        <p><strong>Quote Number:</strong> {{quoteNumber}}</p>
        <p><strong>Valid Until:</strong> {{validUntil}}</p>
        <h3>Quote Details:</h3>
        <p><strong>Project Description:</strong> {{description}}</p>
        <p><strong>Estimated Cost:</strong> ${"{{total}}"}</p>
        <p><strong>Estimated Timeline:</strong> {{timeline}}</p>
      </div>
      <p>This quote is valid for 30 days from the date of this email. To proceed with this quote, please reply to this email or contact our sales team.</p>
      <p>If you have any questions or need any adjustments to this quote, please don't hesitate to let us know.</p>
      <p>We look forward to working with you!</p>
      <p>Best regards,<br>The Delivery on Demand Team</p>
    </div>
    <div class="footer">
      <p>© 2023 Delivery on Demand. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  },
]

export default function EmailSettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("test")
  const [testEmail, setTestEmail] = useState("")
  const [testSubject, setTestSubject] = useState("Test Email from Delivery on Demand")
  const [testMessage, setTestMessage] = useState("<p>This is a test email from Delivery on Demand.</p>")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [connectionMessage, setConnectionMessage] = useState("")
  const [isPreview, setIsPreview] = useState(false)

  // Email configuration state
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    host: "send.one.com",
    port: 465,
    secure: true,
    auth: {
      user: "",
      pass: "",
    },
    from: "deliveryondemand@groupdeliveryprint.com",
  })

  // Template state
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("contact")
  const [templateContent, setTemplateContent] = useState<string>("")
  const [templateName, setTemplateName] = useState<string>("")
  const [templateKey, setTemplateKey] = useState<string>("")
  const [isNewTemplate, setIsNewTemplate] = useState<boolean>(false)

  // Check if we're in a preview environment
  useEffect(() => {
    setIsPreview(isPreviewEnvironment())
  }, [])

  // Load email configuration on mount
  useEffect(() => {
    async function loadEmailConfig() {
      try {
        const response = await fetch("/api/email/config")
        const data = await response.json()

        if (data.success && data.config) {
          setEmailConfig({
            ...data.config,
            auth: {
              ...data.config.auth,
              pass: "", // Don't show the password
            },
          })
        }
      } catch (error) {
        console.error("Error loading email configuration:", error)
      }
    }

    loadEmailConfig()
  }, [])

  // Load templates on mount
  useEffect(() => {
    async function loadTemplates() {
      try {
        const response = await fetch("/api/email/templates")
        const data = await response.json()

        if (data.success && data.templates && data.templates.length > 0) {
          // Load template details for each template
          const templateDetails = await Promise.all(
            data.templates.map(async (key: string) => {
              const templateResponse = await fetch(`/api/email/templates/${key}`)
              const templateData = await templateResponse.json()

              if (templateData.success && templateData.template) {
                return {
                  key,
                  name: key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, " "),
                  content: templateData.template,
                }
              }
              return null
            }),
          )

          // Filter out any null values and combine with default templates
          const loadedTemplates = templateDetails.filter(Boolean)

          // Only use default templates for keys that don't exist in loaded templates
          const existingKeys = loadedTemplates.map((t) => t.key)
          const missingDefaultTemplates = defaultTemplates.filter((t) => !existingKeys.includes(t.key))

          setTemplates([...loadedTemplates, ...missingDefaultTemplates])
        } else {
          // If no templates found, use defaults
          setTemplates(defaultTemplates)
        }
      } catch (error) {
        console.error("Error loading templates:", error)
        // Use default templates if loading fails
        setTemplates(defaultTemplates)
      }
    }

    loadTemplates()
  }, [])

  // Update template content when selected template changes
  useEffect(() => {
    if (selectedTemplate && !isNewTemplate) {
      const template = templates.find((t) => t.key === selectedTemplate)
      if (template) {
        setTemplateContent(template.content)
        setTemplateName(template.name)
        setTemplateKey(template.key)
      }
    }
  }, [selectedTemplate, templates, isNewTemplate])

  const handleTestEmail = async () => {
    if (!testEmail) {
      setStatus("error")
      setMessage("Please enter an email address")
      return
    }

    setStatus("loading")
    setMessage("Sending test email...")

    try {
      const response = await fetch("/api/email/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testEmail,
          subject: testSubject,
          html: testMessage,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(
          isPreview
            ? `Test email simulated successfully (preview mode) to ${testEmail}`
            : `Test email sent successfully to ${testEmail}`,
        )
      } else {
        setStatus("error")
        setMessage(`Failed to send test email: ${data.message}`)
      }
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred while sending the test email")
      console.error("Error sending test email:", error)
    }
  }

  const handleTestConnection = async () => {
    setConnectionStatus("loading")
    setConnectionMessage("Testing connection...")

    try {
      const response = await fetch("/api/email/connection-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          config: emailConfig,
          forceTest: true, // Force actual connection test even in preview mode
        }),
      })

      const data = await response.json()

      if (data.success) {
        setConnectionStatus("success")
        setConnectionMessage(data.message)
      } else {
        setConnectionStatus("error")
        setConnectionMessage(data.message)
      }
    } catch (error) {
      setConnectionStatus("error")
      setConnectionMessage("An error occurred while testing the connection")
      console.error("Error testing connection:", error)
    }
  }

  const handleSaveConfig = async () => {
    try {
      const response = await fetch("/api/email/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailConfig),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Email configuration saved successfully",
        })
      } else {
        toast({
          title: "Error",
          description: `Failed to save configuration: ${data.message}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the configuration",
        variant: "destructive",
      })
      console.error("Error saving configuration:", error)
    }
  }

  const handleSaveTemplate = async () => {
    if (!templateKey || !templateName || !templateContent) {
      toast({
        title: "Error",
        description: "Template key, name, and content are required",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/email/templates/${templateKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ template: templateContent }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Email template saved successfully",
        })

        // Update templates list
        setTemplates((prev) => {
          const index = prev.findIndex((t) => t.key === templateKey)
          if (index >= 0) {
            const updated = [...prev]
            updated[index] = { key: templateKey, name: templateName, content: templateContent }
            return updated
          } else {
            return [...prev, { key: templateKey, name: templateName, content: templateContent }]
          }
        })

        setIsNewTemplate(false)
      } else {
        toast({
          title: "Error",
          description: `Failed to save template: ${data.message}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the template",
        variant: "destructive",
      })
      console.error("Error saving template:", error)
    }
  }

  const handleNewTemplate = () => {
    setIsNewTemplate(true)
    setTemplateKey("")
    setTemplateName("")
    setTemplateContent("")
  }

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return

    try {
      const response = await fetch(`/api/email/templates/${selectedTemplate}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Email template deleted successfully",
        })

        // Update templates list
        setTemplates((prev) => prev.filter((t) => t.key !== selectedTemplate))

        // Select first template or clear if none left
        if (templates.length > 1) {
          const nextTemplate = templates.find((t) => t.key !== selectedTemplate)
          if (nextTemplate) {
            setSelectedTemplate(nextTemplate.key)
          }
        } else {
          setSelectedTemplate("")
          setTemplateContent("")
          setTemplateName("")
        }
      } else {
        toast({
          title: "Error",
          description: `Failed to delete template: ${data.message}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the template",
        variant: "destructive",
      })
      console.error("Error deleting template:", error)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Email Server Settings</h1>

      {isPreview && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Preview Mode Detected</AlertTitle>
          <AlertDescription>
            You are currently in preview mode. Email functionality will be simulated, and no actual emails will be sent.
            All operations will return success responses for testing purposes.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="test" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Test Email
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Email Configuration</CardTitle>
              <CardDescription>Send a test email to verify your mail service configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="testEmail">Recipient Email</Label>
                  <Input
                    id="testEmail"
                    type="email"
                    placeholder="Enter recipient email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="testSubject">Subject</Label>
                  <Input
                    id="testSubject"
                    type="text"
                    placeholder="Enter email subject"
                    value={testSubject}
                    onChange={(e) => setTestSubject(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="testMessage">Message (HTML)</Label>
                  <Textarea
                    id="testMessage"
                    placeholder="Enter email content (HTML supported)"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>

                {status !== "idle" && (
                  <Alert variant={status === "error" ? "destructive" : status === "success" ? "default" : "outline"}>
                    {status === "success" && <CheckCircle className="h-4 w-4" />}
                    {status === "error" && <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>
                      {status === "success" ? "Success" : status === "error" ? "Error" : "Sending"}
                    </AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleTestConnection} variant="outline" disabled={connectionStatus === "loading"}>
                {connectionStatus === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Test Mail Server Connection
              </Button>
              <Button onClick={handleTestEmail} disabled={status === "loading"}>
                {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Test Email
              </Button>
            </CardFooter>
          </Card>

          {connectionStatus !== "idle" && (
            <Alert
              variant={
                connectionStatus === "error" ? "destructive" : connectionStatus === "success" ? "default" : "outline"
              }
            >
              {connectionStatus === "success" && <CheckCircle className="h-4 w-4" />}
              {connectionStatus === "error" && <AlertCircle className="h-4 w-4" />}
              <AlertTitle>
                {connectionStatus === "success"
                  ? "Configuration Valid"
                  : connectionStatus === "error"
                    ? "Configuration Error"
                    : "Testing"}
              </AlertTitle>
              <AlertDescription>{connectionMessage}</AlertDescription>
              {isPreview && connectionStatus === "success" && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4 inline mr-1" />
                  Note: In preview mode, only the configuration format is validated. Actual server connection cannot be
                  tested.
                </div>
              )}
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mail Server Configuration</CardTitle>
              <CardDescription>Configure your email service settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="host">SMTP Server</Label>
                    <Input
                      id="host"
                      value={emailConfig.host}
                      onChange={(e) => setEmailConfig({ ...emailConfig, host: e.target.value })}
                      placeholder="e.g., send.one.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="port">SMTP Port</Label>
                    <Input
                      id="port"
                      type="number"
                      value={emailConfig.port}
                      onChange={(e) => setEmailConfig({ ...emailConfig, port: Number.parseInt(e.target.value) })}
                      placeholder="e.g., 465"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secure">Connection Security</Label>
                  <Select
                    value={emailConfig.secure ? "true" : "false"}
                    onValueChange={(value) => setEmailConfig({ ...emailConfig, secure: value === "true" })}
                  >
                    <SelectTrigger id="secure">
                      <SelectValue placeholder="Select security option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">SSL/TLS (Secure)</SelectItem>
                      <SelectItem value="false">None (Insecure)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="from">From Email Address</Label>
                  <Input
                    id="from"
                    value={emailConfig.from}
                    onChange={(e) => setEmailConfig({ ...emailConfig, from: e.target.value })}
                    placeholder="e.g., deliveryondemand@groupdeliveryprint.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={emailConfig.auth.user}
                      onChange={(e) =>
                        setEmailConfig({ ...emailConfig, auth: { ...emailConfig.auth, user: e.target.value } })
                      }
                      placeholder="SMTP username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={emailConfig.auth.pass}
                      onChange={(e) =>
                        setEmailConfig({ ...emailConfig, auth: { ...emailConfig.auth, pass: e.target.value } })
                      }
                      placeholder="SMTP password"
                    />
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Configuration Information</AlertTitle>
                  <AlertDescription>
                    These settings will be used for all emails sent from the application. Make sure to use the correct
                    SMTP settings provided by your email service provider.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveConfig}>Save Configuration</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Manage email templates for different purposes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex gap-4">
                  <div className="w-1/3">
                    <Label htmlFor="templateSelect" className="mb-2 block">
                      Select Template
                    </Label>
                    <Select
                      value={isNewTemplate ? "" : selectedTemplate}
                      onValueChange={setSelectedTemplate}
                      disabled={isNewTemplate}
                    >
                      <SelectTrigger id="templateSelect">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.key} value={template.key}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="mt-4 flex gap-2">
                      <Button onClick={handleNewTemplate} variant="outline" size="sm">
                        New Template
                      </Button>
                      {!isNewTemplate && selectedTemplate && (
                        <Button onClick={handleDeleteTemplate} variant="destructive" size="sm">
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="w-2/3">
                    {(selectedTemplate || isNewTemplate) && (
                      <>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label htmlFor="templateName">Template Name</Label>
                            <Input
                              id="templateName"
                              value={templateName}
                              onChange={(e) => setTemplateName(e.target.value)}
                              placeholder="e.g., Order Confirmation"
                            />
                          </div>
                          <div>
                            <Label htmlFor="templateKey">Template Key</Label>
                            <Input
                              id="templateKey"
                              value={templateKey}
                              onChange={(e) => setTemplateKey(e.target.value)}
                              placeholder="e.g., order-confirmation"
                              disabled={!isNewTemplate}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="templateContent">Template Content (HTML)</Label>
                          <Textarea
                            id="templateContent"
                            value={templateContent}
                            onChange={(e) => setTemplateContent(e.target.value)}
                            className="min-h-[400px] font-mono text-sm"
                            placeholder="Enter HTML template content with placeholders like {{name}}"
                          />
                        </div>

                        <div className="mt-4">
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Template Variables</AlertTitle>
                            <AlertDescription>
                              Use double curly braces to insert variables, e.g., <code>{"{{name}}"}</code>,{" "}
                              <code>{"{{email}}"}</code>, <code>{"{{message}}"}</code>
                            </AlertDescription>
                          </Alert>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {(selectedTemplate || isNewTemplate) && (
                <Button onClick={handleSaveTemplate}>{isNewTemplate ? "Create Template" : "Save Template"}</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
