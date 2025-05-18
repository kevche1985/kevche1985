"use client"

import { useDbConnection } from "@/hooks/use-db-connection"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, RefreshCw, WifiOff } from "lucide-react"
import { useState } from "react"

export function DbConnectionStatus() {
  const { status, ensureConnection } = useDbConnection()
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetryConnection = async () => {
    setIsRetrying(true)
    try {
      await ensureConnection()
    } catch (error) {
      console.error("Failed to reconnect:", error)
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <div className="flex items-center gap-2 p-2 text-sm rounded-md bg-muted/50">
      {status === "connected" && (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>Database connected</span>
        </>
      )}

      {status === "connecting" && (
        <>
          <RefreshCw className="h-4 w-4 text-amber-500 animate-spin" />
          <span>Connecting to database...</span>
        </>
      )}

      {status === "disconnected" && (
        <>
          <WifiOff className="h-4 w-4 text-gray-500" />
          <span>Database disconnected</span>
          <Button variant="outline" size="sm" onClick={handleRetryConnection} disabled={isRetrying} className="ml-2">
            {isRetrying ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect"
            )}
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>Connection error</span>
          <Button variant="outline" size="sm" onClick={handleRetryConnection} disabled={isRetrying} className="ml-2">
            {isRetrying ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Retrying...
              </>
            ) : (
              "Retry"
            )}
          </Button>
        </>
      )}
    </div>
  )
}
