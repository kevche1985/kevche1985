"use client"

import type React from "react"

import { useState, useRef, useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ImageIcon, Check, ShoppingCart, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/context/cart-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QuoteRequestModal } from "@/components/quote-request-modal"

export default function DigitalPrintingPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [selectedPrintType, setSelectedPrintType] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [paperType, setPaperType] = useState("foldcotte")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [showQuoteAlert, setShowQuoteAlert] = useState(false)
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const content = {
    en: {
      title: "Digital Printing",
      subtitle: "High-quality digital printing for small and medium runs with fast delivery times.",
      features: "Features",
      featuresList: [
        "High resolution printing up to 1200 dpi",
        "Full color CMYK printing",
        "Various paper types and finishes",
        "Fast delivery times",
        "No minimum order quantity",
      ],
      orderForm: "Digital Printing Order Form",
      productType: "Product Type",
      productOptions: {
        placeholder: "Select a product",
        flyers: "Flyers",
        brochures: "Brochures",
        posters: "Posters",
        businessCards: "Business Cards",
        catalogs: "Catalogs",
      },
      uploadFile: "Upload File",
      dragHere: "Drag & drop your file here or click to browse",
      acceptedFormats: "Accepted formats: PDF, JPG, PNG (max 20MB)",
      preview: "Preview",
      editImage: "Edit Image",
      parameters: "Printing Parameters",
      size: "Size",
      sizeOptions: {
        placeholder: "Select a size",
        letter: 'Letter (8.5" x 11")',
        legal: 'Legal (8.5" x 14")',
        tabloid: 'Tabloid (12" x 18")',
        custom: "Custom",
      },
      printType: "Print Type",
      printTypeOptions: {
        placeholder: "Select print type",
        singleSided: "Single-sided",
        doubleSided: "Double-sided",
      },
      paperType: "Paper Type",
      paperOptions: {
        foldcotte: "Foldcotte",
        cuche: "Couche",
        adhesivo: "Adhesivo",
        tornasol: "Tornasol",
      },
      quantity: "Quantity",
      bulkOrderAlert: "For orders of 1000+ copies, please request a quote for better pricing",
      requestQuote: "Request Quote",
      priceEstimator: "Price Estimator",
      pricePerPage: "Price per page:",
      totalEstimated: "Total Estimated:",
      addToCart: "Add to Cart",
      addingToCart: "Adding to Cart...",
      addedToCart: "Added to Cart!",
      pleaseSelect: "Please select a product, size and upload a file",
      selectProductAndUpload: "Please select a product and upload a file",
    },
    es: {
      title: "Impresión Digital",
      subtitle: "Impresión digital de alta calidad para tiradas pequeñas y medianas con tiempos de entrega rápidos.",
      features: "Características",
      featuresList: [
        "Impresión de alta resolución hasta 1200 dpi",
        "Impresión a todo color CMYK",
        "Varios tipos de papel y acabados",
        "Tiempos de entrega rápidos",
        "Sin cantidad mínima de pedido",
      ],
      orderForm: "Formulario de Pedido de Impresión Digital",
      productType: "Tipo de Producto",
      productOptions: {
        placeholder: "Selecciona un producto",
        flyers: "Volantes",
        brochures: "Folletos",
        posters: "Pósters",
        businessCards: "Tarjetas de Presentación",
        catalogs: "Catálogos",
      },
      uploadFile: "Subir Archivo",
      dragHere: "Arrastra y suelta tu archivo aquí o haz clic para buscar",
      acceptedFormats: "Formatos aceptados: PDF, JPG, PNG (máx 20MB)",
      preview: "Vista Previa",
      editImage: "Editar Imagen",
      parameters: "Parámetros de Impresión",
      size: "Tamaño",
      sizeOptions: {
        placeholder: "Selecciona un tamaño",
        letter: 'Carta (8.5" x 11")',
        legal: 'Legal (8.5" x 14")',
        tabloid: 'Tabloide (12" x 18")',
        custom: "Personalizado",
      },
      printType: "Tipo de Impresión",
      printTypeOptions: {
        placeholder: "Selecciona tipo de impresión",
        singleSided: "Una cara",
        doubleSided: "Doble cara",
      },
      paperType: "Tipo de Papel",
      paperOptions: {
        foldcotte: "Foldcotte",
        cuche: "Couche",
        adhesivo: "Adhesivo",
        tornasol: "Tornasol",
      },
      quantity: "Cantidad",
      bulkOrderAlert: "Para pedidos de 1000+ copias, solicite una cotización para obtener mejor precio",
      requestQuote: "Solicitar Cotización",
      priceEstimator: "Estimador de Precio",
      pricePerPage: "Precio por página:",
      totalEstimated: "Total Estimado:",
      addToCart: "Añadir al Carrito",
      addingToCart: "Añadiendo al Carrito...",
      addedToCart: "¡Añadido al Carrito!",
      pleaseSelect: "Por favor selecciona un producto, tamaño y sube un archivo",
      selectProductAndUpload: "Por favor selecciona un producto y sube un archivo",
    },
  }

  const t = language === "en" ? content.en : content.es

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "application/pdf"]
    if (!validTypes.includes(file.type)) {
      alert(language === "en" ? "Please upload a PDF, JPG, or PNG file" : "Por favor sube un archivo PDF, JPG o PNG")
      return
    }

    // Check file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      alert(language === "en" ? "File size must be less than 20MB" : "El tamaño del archivo debe ser menor a 20MB")
      return
    }

    setUploadedFile(file)

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    } else {
      // For PDFs, use a placeholder
      setUploadedImage("/placeholder.svg?height=400&width=600&text=PDF+Preview")
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    const file = e.dataTransfer.files[0]
    if (!file) return

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "application/pdf"]
    if (!validTypes.includes(file.type)) {
      alert(language === "en" ? "Please upload a PDF, JPG, or PNG file" : "Por favor sube un archivo PDF, JPG o PNG")
      return
    }

    // Check file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      alert(language === "en" ? "File size must be less than 20MB" : "El tamaño del archivo debe ser menor a 20MB")
      return
    }

    setUploadedFile(file)

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    } else {
      // For PDFs, use a placeholder
      setUploadedImage("/placeholder.svg?height=400&width=600&text=PDF+Preview")
    }
  }

  // Check if quantity is over 1000 and show alert
  const handleQuantityChange = (value: number) => {
    setQuantity(value)
    setShowQuoteAlert(value >= 1000)
  }

  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedSize || !uploadedFile || !selectedPrintType) {
      alert(t.pleaseSelect)
      return
    }

    setIsSubmitting(true)

    // Create a unique ID for the digital printing item
    const itemId = `digital-print-${Date.now()}`

    // Create the cart item
    const cartItem = {
      id: itemId,
      name: `${t.title} - ${selectedProduct} (${selectedSize})`,
      price: totalPrice,
      quantity: quantity,
      image: uploadedImage || "/placeholder.svg?height=300&width=300&text=Digital+Print",
      category: "digital-printing",
      customization: {
        product: selectedProduct,
        size: selectedSize,
        printType: selectedPrintType,
        paperType: paperType,
        filename: uploadedFile.name,
      },
    }

    // Add the item to the cart
    addItem(cartItem)

    // Update UI state
    setIsSubmitting(false)
    setIsAddedToCart(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setIsAddedToCart(false)
    }, 3000)
  }

  // Calculate price
  const basePrice = 1.25
  const paperTypeMultiplier =
    {
      foldcotte: 1,
      couche: 1.3,
      adhesivo: 1.5,
      tornasol: 2,
    }[paperType] || 1

  const printTypeMultiplier = selectedPrintType === "doubleSided" ? 1.8 : 1

  const totalPrice = basePrice * quantity * paperTypeMultiplier * printTypeMultiplier

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
            <p className="text-gray-300 mb-6">{t.subtitle}</p>

            <h2 className="text-xl font-semibold mb-3">{t.features}</h2>
            <ul className="space-y-2">
              {t.featuresList.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative h-[300px] lg:h-[400px]">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Impresion-digital.jpg-GOCXkRf9e1BBqiPNcYEMn3n8nVTEXI.jpeg"
              alt="Digital Printing Machine with Color Samples"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      </div>

      {/* Order Form Section */}
      <div className="bg-zinc-900 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">{t.orderForm}</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left column - Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="product-type" className="text-base">
                  {t.productType}
                </Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder={t.productOptions.placeholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="flyers">{t.productOptions.flyers}</SelectItem>
                    <SelectItem value="brochures">{t.productOptions.brochures}</SelectItem>
                    <SelectItem value="posters">{t.productOptions.posters}</SelectItem>
                    <SelectItem value="businessCards">{t.productOptions.businessCards}</SelectItem>
                    <SelectItem value="catalogs">{t.productOptions.catalogs}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size" className="text-base">
                  {t.size}
                </Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder={t.sizeOptions.placeholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="letter">{t.sizeOptions.letter}</SelectItem>
                    <SelectItem value="legal">{t.sizeOptions.legal}</SelectItem>
                    <SelectItem value="tabloid">{t.sizeOptions.tabloid}</SelectItem>
                    <SelectItem value="custom">{t.sizeOptions.custom}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="print-type" className="text-base">
                  {t.printType}
                </Label>
                <Select value={selectedPrintType} onValueChange={setSelectedPrintType}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder={t.printTypeOptions.placeholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="singleSided">{t.printTypeOptions.singleSided}</SelectItem>
                    <SelectItem value="doubleSided">{t.printTypeOptions.doubleSided}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base">{t.uploadFile}</Label>
                <div
                  className="border-2 border-dashed border-zinc-600 rounded-lg p-6 text-center cursor-pointer hover:bg-zinc-800 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {uploadedFile ? (
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
                        <Check className="h-6 w-6 text-red-500" />
                      </div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-400">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-400">{t.dragHere}</p>
                      <p className="text-xs text-gray-500 mt-2">{t.acceptedFormats}</p>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">{t.parameters}</h3>

                <div className="space-y-2">
                  <Label htmlFor="paper-type" className="text-base">
                    {t.paperType}
                  </Label>
                  <RadioGroup value={paperType} onValueChange={setPaperType} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="foldcotte" id="foldcotte" className="text-red-500" />
                      <Label htmlFor="foldcotte">{t.paperOptions.foldcotte}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cuche" id="cuche" className="text-red-500" />
                      <Label htmlFor="cuche">{t.paperOptions.cuche}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="adhesivo" id="adhesivo" className="text-red-500" />
                      <Label htmlFor="adhesivo">{t.paperOptions.adhesivo}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tornasol" id="tornasol" className="text-red-500" />
                      <Label htmlFor="tornasol">{t.paperOptions.tornasol}</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-base">
                    {t.quantity}
                  </Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                      className="w-24 bg-zinc-800 border-zinc-700 text-white"
                    />
                    <Slider
                      value={[quantity]}
                      min={1}
                      max={1000}
                      step={1}
                      onValueChange={(value) => handleQuantityChange(value[0])}
                      className="flex-1"
                    />
                  </div>
                </div>

                {showQuoteAlert && (
                  <Alert className="bg-amber-900/30 border-amber-500 text-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <AlertDescription className="text-amber-200">{t.bulkOrderAlert}</AlertDescription>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-amber-500 text-amber-200 hover:bg-amber-900/50 hover:text-amber-100"
                      onClick={() => setIsQuoteModalOpen(true)}
                    >
                      {t.requestQuote}
                    </Button>
                  </Alert>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-700">
                <h3 className="text-lg font-medium">{t.priceEstimator}</h3>
                <div className="text-sm text-gray-300">
                  <p>
                    {t.pricePerPage} ${basePrice.toFixed(2)}
                  </p>
                  <p className="text-xl font-bold mt-2">
                    {t.totalEstimated} <span className="text-red-500">${totalPrice.toFixed(2)}</span>
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleAddToCart}
                  disabled={
                    isSubmitting ||
                    isAddedToCart ||
                    !selectedProduct ||
                    !selectedSize ||
                    !selectedPrintType ||
                    !uploadedFile
                  }
                >
                  {isSubmitting ? (
                    <>{t.addingToCart}</>
                  ) : isAddedToCart ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> {t.addedToCart}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" /> {t.addToCart}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right column - Preview */}
            <div className="lg:col-span-7">
              <div className="bg-zinc-800 rounded-lg overflow-hidden shadow-md h-full">
                <div className="flex justify-between p-4 border-b border-zinc-700">
                  <h3 className="font-medium">{t.preview}</h3>
                  <span className="text-gray-400">{t.editImage}</span>
                </div>
                <div className="bg-zinc-700 h-[500px] relative">
                  {uploadedImage ? (
                    <Image src={uploadedImage || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400 text-center px-4">{t.selectProductAndUpload}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quote Request Modal */}
      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        serviceType={`${t.title} - ${t.bulkOrderAlert}`}
      />
    </div>
  )
}
