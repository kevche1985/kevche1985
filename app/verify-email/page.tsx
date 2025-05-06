"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const supabase = createClientSupabaseClient()

        // Check if we have a token in the URL
        const token = searchParams.get("token_hash")
        const type = searchParams.get("type")

        if (token && type === "email_change") {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "email_change",
          })

          if (error) {
            setVerificationStatus("error")
            setErrorMessage(error.message)
            return
          }

          setVerificationStatus("success")
          // Redirect after a short delay
          setTimeout(() => router.push("/login"), 3000)
        } else if (token && type === "signup") {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "signup",
          })

          if (error) {
            setVerificationStatus("error")
            setErrorMessage(error.message)
            return
          }

          setVerificationStatus("success")
          // Redirect after a short delay
          setTimeout(() => router.push("/login"), 3000)
        } else {
          setVerificationStatus("error")
          setErrorMessage("Invalid verification link")
        }
      } catch (error) {
        console.error("Verification error:", error)
        setVerificationStatus("error")
        setErrorMessage("An unexpected error occurred")
      }
    }

    verifyEmail()
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === "loading" && "Verifying your email..."}
            {verificationStatus === "success" && "Your email has been verified!"}
            {verificationStatus === "error" && "Verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {verificationStatus === "loading" && (
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          )}
          {verificationStatus === "success" && <CheckCircle className="h-16 w-16 text-green-500" />}
          {verificationStatus === "error" && <XCircle className="h-16 w-16 text-red-500" />}
        </CardContent>
        {verificationStatus === "error" && (
          <CardContent>
            <p className="text-center text-red-500">{errorMessage}</p>
          </CardContent>
        )}
        <CardFooter className="flex justify-center">
          {verificationStatus === "success" && (
            <p className="text-center text-sm text-gray-500">Redirecting to login page...</p>
          )}
          {verificationStatus === "error" && <Button onClick={() => router.push("/login")}>Go to Login</Button>}
        </CardFooter>
      </Card>
    </div>
  )
}
