"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import { usePaymentMethods, type PaymentMethod, type ApiConfig } from "@/context/payment-method-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentMethodsPage() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const {
    paymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    togglePaymentMethod,
    testApiConnection,
  } = usePaymentMethods()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isTestingApi, setIsTestingApi] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)

  // Form state for new payment method
  const [newMethod, setNewMethod] = useState<Partial<PaymentMethod>>({
    name: "",
    description: "",
    type: "custom",
    enabled: true,
    icon: "credit-card",
    testMode: true,
    requiresShipping: true,
    supportedCurrencies: ["USD"],
    apiConfig: {
      sandbox: true,
    },
  })

  const translations = {
    en: {
      title: "Payment Methods",
      description: "Manage payment methods and integrations for your store.",
      addNew: "Add New Payment Method",
      edit: "Edit",
      delete: "Delete",
      enable: "Enable",
      disable: "Disable",
      testApi: "Test API Connection",
      name: "Name",
      description: "Description",
      type: "Type",
      icon: "Icon",
      processingFee: "Processing Fee",
      requiresShipping: "Requires Shipping",
      supportedCurrencies: "Supported Currencies",
      apiConfiguration: "API Configuration",
      apiKey: "API Key",
      secretKey: "Secret Key",
      clientId: "Client ID",
      merchantId: "Merchant ID",
      endpoint: "API Endpoint",
      sandbox: "Sandbox Mode",
      testMode: "Test Mode",
      save: "Save",
      cancel: "Cancel",
      confirmDelete: "Are you sure you want to delete this payment method?",
      deleteWarning: "This action cannot be undone.",
      testing: "Testing connection...",
      connectionSuccess: "Connection successful!",
      connectionFailed: "Connection failed.",
      paymentMethodAdded: "Payment method added successfully.",
      paymentMethodUpdated: "Payment method updated successfully.",
      paymentMethodDeleted: "Payment method deleted successfully.",
      paymentMethodToggled: "Payment method status updated.",
    },
    es: {
      title: "Métodos de Pago",
      description: "Administre los métodos de pago e integraciones para su tienda.",
      addNew: "Agregar Nuevo Método de Pago",
      edit: "Editar",
      delete: "Eliminar",
      enable: "Habilitar",
      disable: "Deshabilitar",
      testApi: "Probar Conexión API",
      name: "Nombre",
      description: "Descripción",
      type: "Tipo",
      icon: "Icono",
      processingFee: "Tarifa de Procesamiento",
      requiresShipping: "Requiere Envío",
      supportedCurrencies: "Monedas Soportadas",
      apiConfiguration: "Configuración de API",
      apiKey: "Clave API",
      secretKey: "Clave Secreta",
      clientId: "ID de Cliente",
      merchantId: "ID de Comerciante",
      endpoint: "Endpoint de API",
      sandbox: "Modo Sandbox",
      testMode: "Modo de Prueba",
      save: "Guardar",
      cancel: "Cancelar",
      confirmDelete: "¿Está seguro de que desea eliminar este método de pago?",
      deleteWarning: "Esta acción no se puede deshacer.",
      testing: "Probando conexión...",
      connectionSuccess: "¡Conexión exitosa!",
      connectionFailed: "Conexión fallida.",
      paymentMethodAdded: "Método de pago agregado con éxito.",
      paymentMethodUpdated: "Método de pago actualizado con éxito.",
      paymentMethodDeleted: "Método de pago eliminado con éxito.",
      paymentMethodToggled: "Estado del método de pago actualizado.",
    },
  }

  const t = translations[language]

  const handleAddMethod = () => {
    if (!newMethod.name || !newMethod.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    addPaymentMethod(newMethod as Omit<PaymentMethod, "id" | "createdAt" | "updatedAt">)
    setIsAddDialogOpen(false)
    setNewMethod({
      name: "",
      description: "",
      type: "custom",
      enabled: true,
      icon: "credit-card",
      testMode: true,
      requiresShipping: true,
      supportedCurrencies: ["USD"],
      apiConfig: {
        sandbox: true,
      },
    })

    toast({
      title: "Success",
      description: t.paymentMethodAdded,
    })
  }

  const handleEditMethod = () => {
    if (!selectedMethod) return

    updatePaymentMethod(selectedMethod.id, selectedMethod)
    setIsEditDialogOpen(false)
    setSelectedMethod(null)

    toast({
      title: "Success",
      description: t.paymentMethodUpdated,
    })
  }

  const handleDeleteMethod = () => {
    if (!selectedMethod) return

    deletePaymentMethod(selectedMethod.id)
    setIsDeleteDialogOpen(false)
    setSelectedMethod(null)

    toast({
      title: "Success",
      description: t.paymentMethodDeleted,
    })
  }

  const handleToggleMethod = (id: string) => {
    togglePaymentMethod(id)

    toast({
      title: "Success",
      description: t.paymentMethodToggled,
    })
  }

  const handleTestApiConnection = async (apiConfig: ApiConfig) => {
    setIsTestingApi(true)
    setTestResult(null)

    try {
      const result = await testApiConnection(apiConfig)
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: "An unexpected error occurred during testing.",
      })
    } finally {
      setIsTestingApi(false)
    }
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "credit-card":
        return <CreditCard className="h-5 w-5" />
      case "dollar-sign":
        return <DollarSign className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="text-muted-foreground">{t.description}</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t.addNew}
          </Button>
        </div>

        <div className="grid gap-6">
          {paymentMethods.map((method) => (
            <Card key={method.id} className={!method.enabled ? "opacity-70" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">{getIconComponent(method.icon)}</div>
                  <div>
                    <CardTitle className="text-xl">{method.name}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={method.enabled}
                    onCheckedChange={() => handleToggleMethod(method.id)}
                    aria-label={method.enabled ? t.disable : t.enable}
                  />
                  <Badge variant={method.enabled ? "default" : "outline"}>
                    {method.enabled ? t.enable : t.disable}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <h3 className="font-medium mb-2">Details</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.type}:</span>
                        <span>{method.type}</span>
                      </div>
                      {method.processingFee && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t.processingFee}:</span>
                          <span>{method.processingFee}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.requiresShipping}:</span>
                        <span>{method.requiresShipping ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.testMode}:</span>
                        <span>{method.testMode ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">{t.apiConfiguration}</h3>
                    {method.apiConfig ? (
                      <div className="space-y-1 text-sm">
                        {method.apiConfig.endpoint && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t.endpoint}:</span>
                            <span className="truncate max-w-[200px]">{method.apiConfig.endpoint}</span>
                          </div>
                        )}
                        {method.apiConfig.clientId && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t.clientId}:</span>
                            <span>{"•".repeat(10)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t.sandbox}:</span>
                          <span>{method.apiConfig.sandbox ? "Yes" : "No"}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No API configuration required</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMethod(method)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t.edit}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setSelectedMethod(method)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t.delete}
                  </Button>
                </div>
                {method.apiConfig && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedMethod(method)
                      handleTestApiConnection(method.apiConfig!)
                    }}
                    disabled={isTestingApi}
                  >
                    {isTestingApi ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.testing}
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {t.testApi}
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Add Payment Method Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t.addNew}</DialogTitle>
              <DialogDescription>Fill in the details to add a new payment method to your store.</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="api">API Configuration</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.name} *</Label>
                    <Input
                      id="name"
                      value={newMethod.name || ""}
                      onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                      placeholder="e.g. Credit Card"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">{t.type} *</Label>
                    <Select
                      value={newMethod.type}
                      onValueChange={(value) => setNewMethod({ ...newMethod, type: value as PaymentMethod["type"] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Credit/Debit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="cash">Cash on Delivery</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t.description}</Label>
                  <Textarea
                    id="description"
                    value={newMethod.description || ""}
                    onChange={(e) => setNewMethod({ ...newMethod, description: e.target.value })}
                    placeholder="Describe this payment method"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon">{t.icon}</Label>
                    <Select
                      value={newMethod.icon}
                      onValueChange={(value) => setNewMethod({ ...newMethod, icon: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit-card">Credit Card</SelectItem>
                        <SelectItem value="dollar-sign">Dollar Sign</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="processingFee">{t.processingFee}</Label>
                    <Input
                      id="processingFee"
                      value={newMethod.processingFee || ""}
                      onChange={(e) => setNewMethod({ ...newMethod, processingFee: e.target.value })}
                      placeholder="e.g. 2.9% + $0.30"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="requiresShipping"
                    checked={newMethod.requiresShipping}
                    onCheckedChange={(checked) => setNewMethod({ ...newMethod, requiresShipping: checked })}
                  />
                  <Label htmlFor="requiresShipping">{t.requiresShipping}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="testMode"
                    checked={newMethod.testMode}
                    onCheckedChange={(checked) => setNewMethod({ ...newMethod, testMode: checked })}
                  />
                  <Label htmlFor="testMode">{t.testMode}</Label>
                </div>
              </TabsContent>

              <TabsContent value="api" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">{t.apiKey}</Label>
                  <Input
                    id="apiKey"
                    value={newMethod.apiConfig?.apiKey || ""}
                    onChange={(e) =>
                      setNewMethod({
                        ...newMethod,
                        apiConfig: { ...newMethod.apiConfig, apiKey: e.target.value },
                      })
                    }
                    placeholder="Enter API key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secretKey">{t.secretKey}</Label>
                  <Input
                    id="secretKey"
                    type="password"
                    value={newMethod.apiConfig?.secretKey || ""}
                    onChange={(e) =>
                      setNewMethod({
                        ...newMethod,
                        apiConfig: { ...newMethod.apiConfig, secretKey: e.target.value },
                      })
                    }
                    placeholder="Enter secret key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientId">{t.clientId}</Label>
                  <Input
                    id="clientId"
                    value={newMethod.apiConfig?.clientId || ""}
                    onChange={(e) =>
                      setNewMethod({
                        ...newMethod,
                        apiConfig: { ...newMethod.apiConfig, clientId: e.target.value },
                      })
                    }
                    placeholder="Enter client ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endpoint">{t.endpoint}</Label>
                  <Input
                    id="endpoint"
                    value={newMethod.apiConfig?.endpoint || ""}
                    onChange={(e) =>
                      setNewMethod({
                        ...newMethod,
                        apiConfig: { ...newMethod.apiConfig, endpoint: e.target.value },
                      })
                    }
                    placeholder="e.g. https://api.example.com/v1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sandbox"
                    checked={newMethod.apiConfig?.sandbox}
                    onCheckedChange={(checked) =>
                      setNewMethod({
                        ...newMethod,
                        apiConfig: { ...newMethod.apiConfig, sandbox: checked },
                      })
                    }
                  />
                  <Label htmlFor="sandbox">{t.sandbox}</Label>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleAddMethod}>{t.save}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Payment Method Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {t.edit}: {selectedMethod?.name}
              </DialogTitle>
              <DialogDescription>Update the details of this payment method.</DialogDescription>
            </DialogHeader>

            {selectedMethod && (
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="api">API Configuration</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">{t.name} *</Label>
                      <Input
                        id="edit-name"
                        value={selectedMethod.name}
                        onChange={(e) => setSelectedMethod({ ...selectedMethod, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-type">{t.type} *</Label>
                      <Select
                        value={selectedMethod.type}
                        onValueChange={(value) =>
                          setSelectedMethod({ ...selectedMethod, type: value as PaymentMethod["type"] })
                        }
                      >
                        <SelectTrigger id="edit-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit_card">Credit/Debit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="cash">Cash on Delivery</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">{t.description}</Label>
                    <Textarea
                      id="edit-description"
                      value={selectedMethod.description}
                      onChange={(e) => setSelectedMethod({ ...selectedMethod, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-icon">{t.icon}</Label>
                      <Select
                        value={selectedMethod.icon}
                        onValueChange={(value) => setSelectedMethod({ ...selectedMethod, icon: value })}
                      >
                        <SelectTrigger id="edit-icon">
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit-card">Credit Card</SelectItem>
                          <SelectItem value="dollar-sign">Dollar Sign</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-processingFee">{t.processingFee}</Label>
                      <Input
                        id="edit-processingFee"
                        value={selectedMethod.processingFee || ""}
                        onChange={(e) => setSelectedMethod({ ...selectedMethod, processingFee: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-requiresShipping"
                      checked={selectedMethod.requiresShipping}
                      onCheckedChange={(checked) => setSelectedMethod({ ...selectedMethod, requiresShipping: checked })}
                    />
                    <Label htmlFor="edit-requiresShipping">{t.requiresShipping}</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-testMode"
                      checked={selectedMethod.testMode}
                      onCheckedChange={(checked) => setSelectedMethod({ ...selectedMethod, testMode: checked })}
                    />
                    <Label htmlFor="edit-testMode">{t.testMode}</Label>
                  </div>
                </TabsContent>

                <TabsContent value="api" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-apiKey">{t.apiKey}</Label>
                    <Input
                      id="edit-apiKey"
                      value={selectedMethod.apiConfig?.apiKey || ""}
                      onChange={(e) =>
                        setSelectedMethod({
                          ...selectedMethod,
                          apiConfig: { ...selectedMethod.apiConfig, apiKey: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-secretKey">{t.secretKey}</Label>
                    <Input
                      id="edit-secretKey"
                      type="password"
                      value={selectedMethod.apiConfig?.secretKey || ""}
                      onChange={(e) =>
                        setSelectedMethod({
                          ...selectedMethod,
                          apiConfig: { ...selectedMethod.apiConfig, secretKey: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-clientId">{t.clientId}</Label>
                    <Input
                      id="edit-clientId"
                      value={selectedMethod.apiConfig?.clientId || ""}
                      onChange={(e) =>
                        setSelectedMethod({
                          ...selectedMethod,
                          apiConfig: { ...selectedMethod.apiConfig, clientId: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-endpoint">{t.endpoint}</Label>
                    <Input
                      id="edit-endpoint"
                      value={selectedMethod.apiConfig?.endpoint || ""}
                      onChange={(e) =>
                        setSelectedMethod({
                          ...selectedMethod,
                          apiConfig: { ...selectedMethod.apiConfig, endpoint: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-sandbox"
                      checked={selectedMethod.apiConfig?.sandbox}
                      onCheckedChange={(checked) =>
                        setSelectedMethod({
                          ...selectedMethod,
                          apiConfig: { ...selectedMethod.apiConfig, sandbox: checked },
                        })
                      }
                    />
                    <Label htmlFor="edit-sandbox">{t.sandbox}</Label>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleEditMethod}>{t.save}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Payment Method Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t.delete}: {selectedMethod?.name}
              </DialogTitle>
              <DialogDescription>{t.confirmDelete}</DialogDescription>
            </DialogHeader>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>{t.deleteWarning}</AlertDescription>
            </Alert>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                {t.cancel}
              </Button>
              <Button variant="destructive" onClick={handleDeleteMethod}>
                {t.delete}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* API Test Result Dialog */}
        {testResult && (
          <Dialog open={!!testResult} onOpenChange={() => setTestResult(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>API Connection Test Result</DialogTitle>
              </DialogHeader>

              <Alert variant={testResult.success ? "default" : "destructive"}>
                {testResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{testResult.success ? t.connectionSuccess : t.connectionFailed}</AlertTitle>
                <AlertDescription>{testResult.message}</AlertDescription>
              </Alert>

              <DialogFooter>
                <Button onClick={() => setTestResult(null)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </ProtectedRoute>
  )
}
