"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Info } from "lucide-react"

interface TestResult {
  success: boolean
  message: string
  details?: string
  token?: string
  tokenType?: string
  expiresIn?: number
  raw?: string
  htmlDetected?: boolean
  statusCode?: number
  endpoint?: string
  method?: string
}

export default function WompiOAuthTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [endpoint, setEndpoint] = useState("https://id.wompi.sv/connect/token")
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [useSandbox, setUseSandbox] = useState(true)
  const [method, setMethod] = useState<"POST" | "GET">("POST")
  const [contentType, setContentType] = useState("application/x-www-form-urlencoded")
  const [grantType, setGrantType] = useState("client_credentials")
  const [audience, setAudience] = useState("wompi_api")
  const [showRawResponse, setShowRawResponse] = useState(false)

  const handleTest = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/payments/wompi/oauth-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint,
          clientId,
          clientSecret,
          sandbox: useSandbox,
          method,
          contentType,
          grantType,
          audience,
        }),
      })

      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      console.error("Test error:", error)
      setTestResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Wompi OAuth Connection Test</CardTitle>
        <CardDescription>Test the connection to Wompi API using the standard OAuth endpoint format</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="endpoint">OAuth Endpoint</Label>
              <Input
                id="endpoint"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://id.wompi.sv/connect/token"
              />
              <p className="text-xs text-muted-foreground">
                The standard OAuth token endpoint for Wompi authentication
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter your Wompi Client ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input
                id="clientSecret"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Enter your Wompi Client Secret"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="sandbox" checked={useSandbox} onCheckedChange={setUseSandbox} />
              <Label htmlFor="sandbox">Use Sandbox Environment</Label>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="method">Request Method</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="methodPost"
                    name="method"
                    checked={method === "POST"}
                    onChange={() => setMethod("POST")}
                  />
                  <Label htmlFor="methodPost">POST</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="methodGet"
                    name="method"
                    checked={method === "GET"}
                    onChange={() => setMethod("GET")}
                  />
                  <Label htmlFor="methodGet">GET</Label>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                OAuth typically uses POST, but some implementations may support GET
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <select
                id="contentType"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">-- Select Content Type --</option>
                <option value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</option>
                <option value="application/json">application/json</option>
              </select>
              <p className="text-xs text-muted-foreground">
                OAuth typically uses form-urlencoded, but some APIs accept JSON
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grantType">Grant Type</Label>
              <Input
                id="grantType"
                value={grantType}
                onChange={(e) => setGrantType(e.target.value)}
                placeholder="client_credentials"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Audience</Label>
              <Input
                id="audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="wompi_api"
              />
            </div>
          </TabsContent>
        </Tabs>

        {testResult && (
          <div className="mt-6 space-y-4">
            <Alert variant={testResult.success ? "default" : "destructive"}>
              {testResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{testResult.success ? "Connection Successful" : "Connection Failed"}</AlertTitle>
              <AlertDescription>{testResult.message}</AlertDescription>
            </Alert>

            {testResult.htmlDetected && (
              <Alert variant="warning" className="bg-amber-50 border-amber-200">
                <Info className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">HTML Response Detected</AlertTitle>
                <AlertDescription className="text-amber-700">
                  <p>The API returned HTML instead of JSON. This usually means:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>The endpoint URL might be incorrect</li>
                    <li>You might need to use a different authentication method</li>
                    <li>The API might be redirecting to a login page</li>
                  </ul>
                  <p className="mt-2">
                    Try using the exact endpoint:{" "}
                    <code className="bg-amber-100 px-1 py-0.5 rounded">https://id.wompi.sv/connect/token</code>
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {testResult.success && testResult.token && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="font-medium text-green-800 mb-2">Access Token Received</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Token:</span>
                    <span className="font-mono text-sm truncate max-w-[300px]">
                      {testResult.token.substring(0, 20)}...
                    </span>
                  </div>
                  {testResult.tokenType && (
                    <div className="flex justify-between">
                      <span className="font-medium">Token Type:</span>
                      <span>{testResult.tokenType}</span>
                    </div>
                  )}
                  {testResult.expiresIn && (
                    <div className="flex justify-between">
                      <span className="font-medium">Expires In:</span>
                      <span>{testResult.expiresIn} seconds</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!testResult.success && testResult.statusCode && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <h3 className="font-medium mb-2">Request Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Status Code:</span>
                    <span>{testResult.statusCode}</span>
                  </div>
                  {testResult.endpoint && (
                    <div className="flex justify-between">
                      <span className="font-medium">Endpoint:</span>
                      <span className="font-mono text-sm truncate max-w-[300px]">{testResult.endpoint}</span>
                    </div>
                  )}
                  {testResult.method && (
                    <div className="flex justify-between">
                      <span className="font-medium">Method:</span>
                      <span>{testResult.method}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {testResult.details && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Response Details</h3>
                  <Button variant="outline" size="sm" onClick={() => setShowRawResponse(!showRawResponse)}>
                    {showRawResponse ? "Hide Raw Response" : "Show Raw Response"}
                  </Button>
                </div>
                <div className="p-4 bg-gray-100 rounded-md text-sm font-mono overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-all text-black">
                    {showRawResponse && testResult.raw ? testResult.raw : testResult.details}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button onClick={handleTest} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test Connection"
          )}
        </Button>

        <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-md w-full">
          <h4 className="font-medium mb-2">Troubleshooting Tips:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Make sure you're using the correct Client ID and Client Secret</li>
            <li>
              The standard endpoint is{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded">https://id.wompi.sv/connect/token</code>
            </li>
            <li>OAuth typically requires POST method with form-urlencoded content type</li>
            <li>Check if you need to use a specific grant type or audience value</li>
            <li>Verify that your IP is allowed to access the Wompi API</li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  )
}
