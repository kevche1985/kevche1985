"use client"

import type React from "react"

import { useState, useRef, useEffect, useContext } from "react"
import { LanguageContext } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, ImageIcon, Type, Move, Crop, RotateCw, ZoomIn, Square, Trash2 } from "lucide-react"
import { ShapePresets } from "./shape-presets"
// Add this import at the top of the file
import { ShapeLayers } from "./shape-layers"

interface ProductCustomizerProps {
  productImage: string
  productName: string
  productDescription?: string
  price: number
  onCustomizationChange?: (customization: any) => void
}

// Update the Shape interface to include opacity
interface Shape {
  id: string
  type: "circle" | "square" | "triangle"
  x: number
  y: number
  width: number
  height: number
  color: string
  borderWidth: number
  borderColor: string
  opacity: number // Add this new property
  rotation: number
  isDragging?: boolean
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
  const [shapes, setShapes] = useState<Shape[]>([])
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null)
  const [shapeColor, setShapeColor] = useState("#ff0000")
  const [shapeSize, setShapeSize] = useState(50)
  const [isDraggingShape, setIsDraggingShape] = useState(false)
  const [draggedShapeId, setDraggedShapeId] = useState<string | null>(null)
  const [resizingShapeId, setResizingShapeId] = useState<string | null>(null)
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 })
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null)
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null)
  const [isCropping, setIsCropping] = useState(false)
  const [originalImage, setOriginalImage] = useState<string | null>(null)

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
      shapesLabel: "Shapes", // Changed from shapes to shapesLabel
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
      shapesTab: {
        // Changed from shapes to shapesTab
        selectShape: "Select Shape",
        circle: "Circle",
        square: "Square",
        triangle: "Triangle",
        color: "Color",
        size: "Size",
        addShape: "Add Shape",
      },
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
      shapesLabel: "Formas", // Changed from shapes to shapesLabel
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
      shapesTab: {
        // Changed from shapes to shapesTab
        selectShape: "Seleccionar Forma",
        circle: "Círculo",
        square: "Cuadrado",
        triangle: "Triángulo",
        color: "Color",
        size: "Tamaño",
        addShape: "Añadir Forma",
      },
    },
  }

  const t = language === "en" ? content.en : content.es

  // Add these functions to handle layer operations
  const moveShapeUp = (id: string) => {
    const index = shapes.findIndex((s) => s.id === id)
    if (index < shapes.length - 1) {
      const newShapes = [...shapes]
      ;[newShapes[index], newShapes[index + 1]] = [newShapes[index + 1], newShapes[index]]
      setShapes(newShapes)
    }
  }

  const moveShapeDown = (id: string) => {
    const index = shapes.findIndex((s) => s.id === id)
    if (index > 0) {
      const newShapes = [...shapes]
      ;[newShapes[index], newShapes[index - 1]] = [newShapes[index - 1], newShapes[index]]
      setShapes(newShapes)
    }
  }

  const deleteShape = (id: string) => {
    setShapes(shapes.filter((s) => s.id !== id))
    if (selectedShape?.id === id) {
      setSelectedShape(null)
    }
  }

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
        const imageData = event.target.result as string
        setUploadedImage(imageData)
        setOriginalImage(imageData) // Store the original image
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
        const imageData = event.target.result as string
        setUploadedImage(imageData)
        setOriginalImage(imageData) // Store the original image
      }
    }
    reader.readAsDataURL(file)
  }

  // Canvas mouse events for dragging and shape manipulation
  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Handle crop tool
    if (selectedTool === "crop" && uploadedImage) {
      setCropStart({ x, y })
      setCropEnd(null)
      setIsCropping(true)
      return
    }

    // Check if we're clicking on a shape
    const clickedShapeIndex = shapes.findIndex((shape) => {
      if (shape.type === "circle") {
        const radius = shape.width / 2
        const centerX = shape.x + radius
        const centerY = shape.y + radius
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
        return distance <= radius
      } else if (shape.type === "square") {
        return x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height
      } else if (shape.type === "triangle") {
        // Simple triangle hit detection
        return x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height
      }
      return false
    })

    if (clickedShapeIndex !== -1) {
      // We clicked on a shape
      const clickedShape = shapes[clickedShapeIndex]
      setSelectedShape(clickedShape)
      setDraggedShapeId(clickedShape.id)
      setIsDraggingShape(true)

      // Check if we're near the edge (for resizing)
      const isNearRightEdge = Math.abs(x - (clickedShape.x + clickedShape.width)) < 10
      const isNearBottomEdge = Math.abs(y - (clickedShape.y + clickedShape.height)) < 10

      if (isNearRightEdge && isNearBottomEdge) {
        // We're near the bottom-right corner (for resizing)
        setResizingShapeId(clickedShape.id)
        setResizeStartPos({ x, y })
      }

      lastPositionRef.current = { x, y }
      return
    }

    // If we're not clicking on a shape, handle regular image dragging
    if (selectedTool === "move" && uploadedImage) {
      isDraggingRef.current = true
      lastPositionRef.current = { x, y }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Handle crop selection
    if (isCropping && cropStart) {
      setCropEnd({ x, y })
      return
    }

    const deltaX = x - lastPositionRef.current.x
    const deltaY = y - lastPositionRef.current.y

    // Handle shape resizing
    if (resizingShapeId) {
      const updatedShapes = shapes.map((shape) => {
        if (shape.id === resizingShapeId) {
          return {
            ...shape,
            width: Math.max(20, shape.width + deltaX),
            height: Math.max(20, shape.height + deltaY),
          }
        }
        return shape
      })
      setShapes(updatedShapes)
      lastPositionRef.current = { x, y }
      return
    }

    // Handle shape dragging
    if (isDraggingShape && draggedShapeId) {
      const updatedShapes = shapes.map((shape) => {
        if (shape.id === draggedShapeId) {
          return {
            ...shape,
            x: shape.x + deltaX,
            y: shape.y + deltaY,
          }
        }
        return shape
      })
      setShapes(updatedShapes)
      lastPositionRef.current = { x, y }
      return
    }

    // Handle image dragging
    if (isDraggingRef.current && selectedTool === "move") {
      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }))
      lastPositionRef.current = { x, y }
    }
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
    setIsDraggingShape(false)
    setDraggedShapeId(null)
    setResizingShapeId(null)

    // Handle crop completion
    if (isCropping && cropStart && cropEnd && uploadedImage && originalImage) {
      applyCrop()
      setIsCropping(false)
      setCropStart(null)
      setCropEnd(null)
    }
  }

  const applyCrop = () => {
    if (!cropStart || !cropEnd || !originalImage) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      // Calculate the actual crop coordinates relative to the image
      const canvasEl = canvasRef.current
      if (!canvasEl) return

      const canvasWidth = canvasEl.width
      const canvasHeight = canvasEl.height

      // Calculate scale factors
      const scaleX = img.width / canvasWidth
      const scaleY = img.height / canvasHeight

      // Calculate crop area in the original image coordinates
      const startX = Math.min(cropStart.x, cropEnd!.x) * scaleX
      const startY = Math.min(cropStart.y, cropEnd!.y) * scaleY
      const width = Math.abs(cropEnd!.x - cropStart.x) * scaleX
      const height = Math.abs(cropEnd!.y - cropStart.y) * scaleY

      // Set canvas size to the crop size
      canvas.width = width
      canvas.height = height

      // Draw the cropped portion
      ctx.drawImage(img, startX, startY, width, height, 0, 0, width, height)

      // Convert to data URL and update the image
      const croppedImageData = canvas.toDataURL("image/png")
      setUploadedImage(croppedImageData)
    }
    img.src = originalImage
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
        shapes,
      }

      // Use a ref to track previous values and only update when something actually changes
      const customizationStr = JSON.stringify(currentCustomization)
      if (customizationRef.current !== customizationStr) {
        customizationRef.current = customizationStr
        onCustomizationChange(currentCustomization)
      }
    }
  }, [text, textColor, fontSize, rotation, scale, position, uploadedImage, onCustomizationChange, shapes])

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

          // Draw text AFTER the image is drawn to ensure it appears on top
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

          // Always draw shapes last to ensure they're on top
          drawShapes(ctx)

          // Draw crop overlay if in crop mode
          if (selectedTool === "crop" && cropStart && cropEnd) {
            ctx.save()

            // Draw semi-transparent overlay
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Clear the crop area
            ctx.globalCompositeOperation = "destination-out"
            const cropX = Math.min(cropStart.x, cropEnd.x)
            const cropY = Math.min(cropStart.y, cropEnd.y)
            const cropWidth = Math.abs(cropEnd.x - cropStart.x)
            const cropHeight = Math.abs(cropEnd.y - cropStart.y)
            ctx.fillRect(cropX, cropY, cropWidth, cropHeight)

            // Draw crop border
            ctx.globalCompositeOperation = "source-over"
            ctx.strokeStyle = "#ffffff"
            ctx.lineWidth = 2
            ctx.strokeRect(cropX, cropY, cropWidth, cropHeight)

            ctx.restore()
          }
        }
        img.src = uploadedImage
      } else {
        // If there's no uploaded image, still draw the text
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

        // Always draw shapes last to ensure they're on top
        drawShapes(ctx)
      }
    }
    productImg.src = productImage

    // Separate function for drawing shapes
    function drawShapes(ctx: CanvasRenderingContext2D) {
      shapes.forEach((shape) => {
        // Save the current context state
        ctx.save()

        // Set the global alpha (opacity)
        ctx.globalAlpha = shape.opacity

        ctx.fillStyle = shape.color
        ctx.strokeStyle = shape.borderColor
        ctx.lineWidth = shape.borderWidth

        // Add a highlight effect for the selected shape
        if (selectedShape?.id === shape.id) {
          ctx.shadowColor = "rgba(0, 123, 255, 0.5)"
          ctx.shadowBlur = 10
        }

        if (shape.type === "circle") {
          const radius = shape.width / 2
          ctx.beginPath()
          ctx.arc(shape.x + radius, shape.y + radius, radius, 0, Math.PI * 2)
          ctx.fill()
          if (shape.borderWidth > 0) {
            ctx.stroke()
          }
        } else if (shape.type === "square") {
          ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
          if (shape.borderWidth > 0) {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
          }
        } else if (shape.type === "triangle") {
          ctx.beginPath()
          ctx.moveTo(shape.x + shape.width / 2, shape.y)
          ctx.lineTo(shape.x + shape.width, shape.y + shape.height)
          ctx.lineTo(shape.x, shape.y + shape.height)
          ctx.closePath()
          ctx.fill()
          if (shape.borderWidth > 0) {
            ctx.stroke()
          }
        }

        // Restore the context state
        ctx.restore()
      })
    }
  }, [
    uploadedImage,
    text,
    textColor,
    fontSize,
    rotation,
    scale,
    position,
    productImage,
    shapes,
    selectedShape,
    cropStart,
    cropEnd,
    selectedTool,
  ])

  const addShape = (type: "circle" | "square" | "triangle") => {
    const canvas = canvasRef.current
    if (!canvas) return

    const centerX = canvas.width / 2 - 50
    const centerY = canvas.height / 2 - 50

    const newShape: Shape = {
      id: `shape-${Date.now()}`,
      type,
      x: centerX,
      y: centerY,
      width: 100,
      height: 100,
      color: shapeColor || "#FF5733",
      borderWidth: 2,
      borderColor: "#000000",
      opacity: 1,
      rotation: 0,
    }

    const newShapes = [...shapes, newShape]
    setShapes(newShapes)
    setSelectedShape(newShape)
  }

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
            <span className="text-xs">{t.shapesLabel}</span> {/* Changed from t.shapes to t.shapesLabel */}
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setUploadedImage(null)
              setText("")
              setShapes([])
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
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                {t.uploadImage}
              </TabsTrigger>
              <TabsTrigger value="text">
                <Type className="h-4 w-4 mr-2" />
                {t.text}
              </TabsTrigger>
              <TabsTrigger value="shapes">
                <Square className="h-4 w-4 mr-2" />
                {t.shapesLabel} {/* Changed from t.shapes to t.shapesLabel */}
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
            <TabsContent value="shapes">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">{t.shapesTab.selectShape}</label>{" "}
                  {/* Changed from t.shapes.selectShape to t.shapesTab.selectShape */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={selectedShape?.type === "circle" ? "default" : "outline"}
                      size="sm"
                      onClick={() => addShape("circle")}
                      className="flex items-center justify-center h-10"
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-current" />
                      <span className="ml-1">{t.shapesTab.circle}</span>{" "}
                      {/* Changed from t.shapes.circle to t.shapesTab.circle */}
                    </Button>
                    <Button
                      variant={selectedShape?.type === "square" ? "default" : "outline"}
                      size="sm"
                      onClick={() => addShape("square")}
                      className="flex items-center justify-center h-10"
                    >
                      <div className="w-6 h-6 border-2 border-current" />
                      <span className="ml-1">{t.shapesTab.square}</span>{" "}
                      {/* Changed from t.shapes.square to t.shapesTab.square */}
                    </Button>
                    <Button
                      variant={selectedShape?.type === "triangle" ? "default" : "outline"}
                      size="sm"
                      onClick={() => addShape("triangle")}
                      className="flex items-center justify-center h-10"
                    >
                      <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-transparent border-b-current" />
                      <span className="ml-1">{t.shapesTab.triangle}</span>{" "}
                      {/* Changed from t.shapes.triangle to t.shapesTab.triangle */}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">{t.shapesTab.color}</label>{" "}
                  {/* Changed from t.shapes.color to t.shapesTab.color */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={shapeColor}
                      onChange={(e) => setShapeColor(e.target.value)}
                      className="w-10 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={shapeColor}
                      onChange={(e) => setShapeColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {t.shapesTab.size}: {shapeSize}px
                  </label>{" "}
                  {/* Changed from t.shapes.size to t.shapesTab.size */}
                  <Slider
                    value={[shapeSize]}
                    min={10}
                    max={200}
                    step={1}
                    onValueChange={(value) => setShapeSize(value[0])}
                  />
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
        {selectedTool === "crop" && uploadedImage && originalImage && (
          <div className="mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUploadedImage(originalImage)
                setCropStart(null)
                setCropEnd(null)
              }}
              className="w-full"
            >
              Reset to Original Image
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {language === "en"
                ? "Click and drag on the image to crop."
                : "Haz clic y arrastra en la imagen para recortar."}
            </p>
          </div>
        )}
        {selectedShape && (
          <>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Border</h3>
              <div className="flex items-center mb-2">
                <label className="w-24 text-sm">Color:</label>
                <input
                  type="color"
                  value={selectedShape.borderColor}
                  onChange={(e) => {
                    const updatedShapes = shapes.map((s) =>
                      s.id === selectedShape.id ? { ...s, borderColor: e.target.value } : s,
                    )
                    setShapes(updatedShapes)
                  }}
                  className="w-10 h-10 border rounded"
                />
              </div>
              <div className="flex items-center">
                <label className="w-24 text-sm">Width:</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={selectedShape.borderWidth}
                  onChange={(e) => {
                    const updatedShapes = shapes.map((s) =>
                      s.id === selectedShape.id ? { ...s, borderWidth: Number.parseInt(e.target.value) } : s,
                    )
                    setShapes(updatedShapes)
                  }}
                  className="w-32"
                />
                <span className="ml-2 text-sm">{selectedShape.borderWidth}px</span>
              </div>
            </div>

            <div className="mt-2">
              <div className="flex items-center">
                <label className="w-24 text-sm">Opacity:</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selectedShape.opacity}
                  onChange={(e) => {
                    const updatedShapes = shapes.map((s) =>
                      s.id === selectedShape.id ? { ...s, opacity: Number.parseFloat(e.target.value) } : s,
                    )
                    setShapes(updatedShapes)
                  }}
                  className="w-32"
                />
                <span className="ml-2 text-sm">{Math.round(selectedShape.opacity * 100)}%</span>
              </div>
            </div>

            <ShapePresets
              onSelectPreset={(preset) => {
                const updatedShapes = shapes.map((s) =>
                  s.id === selectedShape.id
                    ? {
                        ...s,
                        color: preset.color,
                        borderColor: preset.borderColor,
                        borderWidth: preset.borderWidth,
                      }
                    : s,
                )
                setShapes(updatedShapes)
              }}
            />
            {/* Add the ShapeLayers component */}
            <ShapeLayers
              shapes={shapes}
              selectedShapeId={selectedShape?.id || null}
              onSelectShape={(id) => {
                const shape = shapes.find((s) => s.id === id)
                if (shape) {
                  setSelectedShape(shape)
                }
              }}
              onMoveUp={moveShapeUp}
              onMoveDown={moveShapeDown}
              onDelete={deleteShape}
            />
          </>
        )}
      </div>

      {/* Center - Canvas */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className={`w-full h-auto ${isDraggingShape || resizingShapeId ? "cursor-grabbing" : selectedTool === "move" ? "cursor-move" : "cursor-default"}`}
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
