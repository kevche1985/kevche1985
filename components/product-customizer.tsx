"use client"

import type React from "react"

import { useState, useRef, useEffect, useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, ImageIcon, Type, Move, Crop, RotateCw, ZoomIn, Square, Trash2 } from "lucide-react"

interface ProductCustomizerProps {
  productImage: string
  productName: string
  productDescription?: string
  price: number
  onCustomizationChange?: (customization: any) => void
}

export function ProductCustomizer({
  productImage,
  productName,
  productDescription,
  price,
  onCustomizationChange,
}: ProductCustomizerProps) {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedTool, setSelectedTool] = useState<string>("move")
  const [text, setText] = useState("")
  const [textColor, setTextColor] = useState("#ffffff")
  const [fontSize, setFontSize] = useState(24)
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isDraggingRef = useRef(false)
  const lastPositionRef = useRef({ x: 0, y: 0 })
  const customizationRef = useRef<string>("")

  const content = {
    en: {
      uploadImage: "Upload Image",
      dragHere: "Drag & drop your image here or click to browse",
      tools: "Tools",
      move: "Move",
      crop: "Crop",
      rotate: "Rotate",
      zoom: "Zoom",
      text: "Text",
      shapes: "Shapes",
      delete: "Delete",
      textTab: {
        addText: "Add Text",
        enterText: "Enter your text",
        fontSize: "Font Size",
        color: "Color",
      },
      rotateTab: {
        rotation: "Rotation",
      },
      zoomTab: {
        scale: "Scale",
      },
      acceptedFormats: "Accepted formats: PNG",
      price: "Price",
    },
    es: {
      uploadImage: "Subir Imagen",
      dragHere: "Arrastra y suelta tu imagen aquí o haz clic para buscar",
      tools: "Herramientas",
      move: "Mover",
      crop: "Recortar",
      rotate: "Rotar",
      zoom: "Zoom",
      text: "Texto",
      shapes: "Formas",
      delete: "Eliminar",
      textTab: {
        addText: "Añadir Texto",
        enterText: "Ingresa tu texto",
        fontSize: "Tamaño de Fuente",
        color: "Color",
      },
      rotateTab: {
        rotation: "Rotación",
      },
      zoomTab: {
        scale: "Escala",
      },
      acceptedFormats: "Formatos aceptados: PNG",
      price: "Precio",
    },
  }

  const t = language === "en" ? content.en : content.es

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is PNG
    if (file.type !== "image/png") {
      alert("Please upload a PNG image")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    const file = e.dataTransfer.files[0]
    if (!file) return

    // Check if file is PNG
    if (file.type !== "image/png") {
      alert("Please upload a PNG image")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  // Canvas mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === "move" && uploadedImage) {
      isDraggingRef.current = true
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      lastPositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current && selectedTool === "move") {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const deltaX = x - lastPositionRef.current.x
      const deltaY = y - lastPositionRef.current.y

      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }))

      lastPositionRef.current = { x, y }
    }
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  // Update customization when relevant state changes
  useEffect(() => {
    if (onCustomizationChange) {
      const currentCustomization = {
        text,
        textColor,
        fontSize,
        rotation,
        scale,
        position,
        uploadedImage,
      }

      // Use a ref to track previous values and only update when something actually changes
      const customizationStr = JSON.stringify(currentCustomization)
      if (customizationRef.current !== customizationStr) {
        customizationRef.current = customizationStr
        onCustomizationChange(currentCustomization)
      }
    }
  }, [text, textColor, fontSize, rotation, scale, position, uploadedImage, onCustomizationChange])

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw product image as background
    const productImg = new Image()
    productImg.crossOrigin = "anonymous"
    productImg.onload = () => {
      ctx.drawImage(productImg, 0, 0, canvas.width, canvas.height)

      // Draw uploaded image if available
      if (uploadedImage) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          // Save context state
          ctx.save()

          // Move to position
          ctx.translate(canvas.width / 2 + position.x, canvas.height / 2 + position.y)

          // Rotate
          ctx.rotate((rotation * Math.PI) / 180)

          // Scale
          ctx.scale(scale, scale)

          // Draw image centered
          ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height)

          // Restore context state
          ctx.restore()
        }
        img.src = uploadedImage
      }

      // Draw text if available
      if (text) {
        ctx.save()
        ctx.translate(canvas.width / 2 + position.x, canvas.height / 2 + position.y)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.scale(scale, scale)

        ctx.font = `${fontSize}px Arial`
        ctx.fillStyle = textColor
        ctx.textAlign = "center"
        ctx.fillText(text, 0, 0)

        ctx.restore()
      }
    }
    productImg.src = productImage
  }, [uploadedImage, text, textColor, fontSize, rotation, scale, position, productImage])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left sidebar - Tools */}
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-medium mb-4">{t.tools}</h3>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <Button
            variant={selectedTool === "move" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool("move")}
            className="flex flex-col items-center justify-center h-16"
          >
            <Move className="h-5 w-5 mb-1" />
            <span className="text-xs">{t.move}</span>
          </Button>

          <Button
            variant={selectedTool === "crop" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool("crop")}
            className="flex flex-col items-center justify-center h-16"
          >
            <Crop className="h-5 w-5 mb-1" />
            <span className="text-xs">{t.crop}</span>
          </Button>

          <Button
            variant={selectedTool === "rotate" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool("rotate")}
            className="flex flex-col items-center justify-center h-16"
          >
            <RotateCw className="h-5 w-5 mb-1" />
            <span className="text-xs">{t.rotate}</span>
          </Button>

          <Button
            variant={selectedTool === "zoom" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool("zoom")}
            className="flex flex-col items-center justify-center h-16"
          >
            <ZoomIn className="h-5 w-5 mb-1" />
            <span className="text-xs">{t.zoom}</span>
          </Button>

          <Button
            variant={selectedTool === "text" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool("text")}
            className="flex flex-col items-center justify-center h-16"
          >
            <Type className="h-5 w-5 mb-1" />
            <span className="text-xs">{t.text}</span>
          </Button>

          <Button
            variant={selectedTool === "shapes" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool("shapes")}
            className="flex flex-col items-center justify-center h-16"
          >
            <Square className="h-5 w-5 mb-1" />
            <span className="text-xs">{t.shapes}</span>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setUploadedImage(null)
              setText("")
            }}
            className="flex flex-col items-center justify-center h-16 col-span-2"
          >
            <Trash2 className="h-5 w-5 mb-1" />
            <span className="text-xs">{t.delete}</span>
          </Button>
        </div>

        {/* Tool options */}
        <div className="mt-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                {t.uploadImage}
              </TabsTrigger>
              <TabsTrigger value="text">
                <Type className="h-4 w-4 mr-2" />
                {t.text}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div
                className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t.dragHere}</p>
                <p className="text-xs text-muted-foreground mt-2">{t.acceptedFormats}</p>
                <input type="file" ref={fileInputRef} className="hidden" accept=".png" onChange={handleFileUpload} />
              </div>
            </TabsContent>

            <TabsContent value="text">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">{t.textTab.enterText}</label>
                  <Input value={text} onChange={(e) => setText(e.target.value)} placeholder={t.textTab.enterText} />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {t.textTab.fontSize}: {fontSize}px
                  </label>
                  <Slider
                    value={[fontSize]}
                    min={8}
                    max={72}
                    step={1}
                    onValueChange={(value) => setFontSize(value[0])}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">{t.textTab.color}</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {selectedTool === "rotate" && (
          <div className="mt-6">
            <label className="text-sm font-medium mb-1 block">
              {t.rotateTab.rotation}: {rotation}°
            </label>
            <Slider value={[rotation]} min={0} max={360} step={1} onValueChange={(value) => setRotation(value[0])} />
          </div>
        )}

        {selectedTool === "zoom" && (
          <div className="mt-6">
            <label className="text-sm font-medium mb-1 block">
              {t.zoomTab.scale}: {scale.toFixed(1)}x
            </label>
            <Slider value={[scale * 10]} min={5} max={20} step={1} onValueChange={(value) => setScale(value[0] / 10)} />
          </div>
        )}
      </div>

      {/* Center - Canvas */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="w-full h-auto cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{productName}</h2>
            {productDescription && <p className="text-muted-foreground">{productDescription}</p>}
            <p className="text-lg font-bold mt-2">
              {t.price}: ${price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
