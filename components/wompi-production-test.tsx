"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function WompiProductionTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: string
  } | null>(null)
  const [useEnvVars, setUseEnvVars] = useState(true)
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [endpoint, setEndpoint] = useState("https://id.wompi.sv/")

  const handleTest = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/payments/wompi/test-production", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: useEnvVars ? undefined : clientId,
          secretKey: useEnvVars ? undefined : clientSecret,
          endpoint,
        }),
      })

      const data = await response.json()

      setResult({
        success: data.success,
        message: data.message,
        details: data.success
          ? `Token type: ${data.token_type}, Expires in: ${data.expires_in} seconds`
          : data.error_description || data.error,
      })
    } catch (error) {
      console.error("Production test error:", error)
      setResult({
        success: false,
        message: "Connection test failed. Please check the console for details.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Production Connection Test</CardTitle>
        <CardDescription>Test your Wompi API connection in the production environment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="useEnvVars" checked={useEnvVars} onCheckedChange={setUseEnvVars} />
          <Label htmlFor="useEnvVars">Use environment variables</Label>
        </div>

        {!useEnvVars && (
          <>
            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter your Wompi Client ID"
                required={!useEnvVars}
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
                required={!useEnvVars}
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="endpoint">Authentication Endpoint</Label>
          <Input
            id="endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="https://id.wompi.sv/"
          />
        </div>

        <Button onClick={handleTest} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Test Production Connection
            </>
          )}
        </Button>

        {useEnvVars && (
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Using Environment Variables</AlertTitle>
            <AlertDescription>
              This test will use the WOMPI_CLIENT_ID and WOMPI_CLIENT_SECRET environment variables configured in your
              production environment.
            </AlertDescription>
          </Alert>
        )}
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
              {result.details && <div className="mt-2 text-sm font-mono bg-muted p-2 rounded">{result.details}</div>}
            </AlertDescription>
          </Alert>
        </CardFooter>
      )}
    </Card>
  )
}
