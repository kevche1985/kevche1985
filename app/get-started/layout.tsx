import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Get Started - Print On Demand",
  description: "Start your journey with our print on demand services",
}

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen">{children}</div>
}
