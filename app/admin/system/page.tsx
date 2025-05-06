"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Mail,
  Database,
  FileText,
  Server,
  Shield,
  Users,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react"

export default function SystemPage() {
  const [systemStatus, setSystemStatus] = useState({
    database: { status: "online", lastChecked: new Date().toISOString() },
    email: { status: "unknown", lastChecked: null },
    cache: { status: "online", lastChecked: new Date().toISOString() },
    storage: { status: "online", lastChecked: new Date().toISOString() },
  })

  const [isCheckingEmail, setIsCheckingEmail] = useState(false)

  const checkEmailStatus = async () => {
    setIsCheckingEmail(true)
    try {
      const response = await fetch("/api/email/test")
      const data = await response.json()

      setSystemStatus((prev) => ({
        ...prev,
        email: {
          status: data.success ? "online" : "offline",
          lastChecked: new Date().toISOString(),
          message: data.message,
        },
      }))
    } catch (error) {
      setSystemStatus((prev) => ({
        ...prev,
        email: {
          status: "error",
          lastChecked: new Date().toISOString(),
          message: "Connection error",
        },
      }))
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "offline":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-amber-500" />
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Management</h1>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {getStatusIcon(systemStatus.database.status)}
                    <span className="ml-2 capitalize">{systemStatus.database.status}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(systemStatus.database.lastChecked)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {getStatusIcon(systemStatus.email.status)}
                    <span className="ml-2 capitalize">{systemStatus.email.status}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={checkEmailStatus} disabled={isCheckingEmail}>
                    {isCheckingEmail ? "Checking..." : "Check"}
                  </Button>
                </div>
                {systemStatus.email.message && (
                  <p className="text-xs text-muted-foreground mt-2">{systemStatus.email.message}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Server className="h-4 w-4 mr-2" />
                  Cache
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {getStatusIcon(systemStatus.cache.status)}
                    <span className="ml-2 capitalize">{systemStatus.cache.status}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(systemStatus.cache.lastChecked)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {getStatusIcon(systemStatus.storage.status)}
                    <span className="ml-2 capitalize">{systemStatus.storage.status}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(systemStatus.storage.lastChecked)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common system management tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Link href="/admin/system/logs">
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View Logs
                  </Button>
                </Link>
                <Link href="/admin/email-settings">
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Settings
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    User Management
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Details about your system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Version</div>
                  <div className="text-sm">1.0.0</div>

                  <div className="text-sm font-medium">Environment</div>
                  <div className="text-sm">Production</div>

                  <div className="text-sm font-medium">Last Updated</div>
                  <div className="text-sm">{new Date().toLocaleDateString()}</div>

                  <div className="text-sm font-medium">Uptime</div>
                  <div className="text-sm">3 days, 5 hours</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>View and manage system logs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Access detailed system logs to monitor and troubleshoot your application.</p>
              <Link href="/admin/system/logs">
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Go to Log Management
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Manage email settings and templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Configure your email server settings and manage email templates.</p>
              <Link href="/admin/email-settings">
                <Button>
                  <Mail className="h-4 w-4 mr-2" />
                  Go to Email Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure global system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Manage global system settings and configurations.</p>
              <Link href="/admin/settings">
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Go to System Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
