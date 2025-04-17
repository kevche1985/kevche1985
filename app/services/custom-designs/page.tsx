"use client"

import type React from "react"

import { useState, useRef, useContext } from "react"
import { ServiceDetailTemplate } from "@/components/service-detail-template"
import { LanguageContext } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ImageIcon, Check, ShoppingCart } from "lucide-react"
import Image from "next/image"

export default function CustomDesignsPage() {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const [designType, setDesignType] = useState("")
  const [designDescription, setDesignDescription] = useState("")
  const [referenceFiles, setReferenceFiles] = useState<File[]>([])
  const [referenceImages, setReferenceImages] = useState<string[]>([])
  const [designUse, setDesignUse] = useState("")
  const [revisions, setRevisions] = useState("standard")
  const [timeline, setTimeline] = useState("standard")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const content = {
    en: {
      title: "Custom Design Request Form",
      designType: "Design Type",
      designTypeOptions: {
        placeholder: "Select design type",
        logo: "Logo Design",
        branding: "Brand Identity",
        packaging: "Packaging Design",
        flyer: "Flyer/Poster Design",
        brochure: "Brochure Design",
        social: "Social Media Graphics",
        illustration: "Custom Illustration",
        other: "Other (specify in description)",
      },
      designDescription: "Design Description",
      designDescriptionPlaceholder:
        "Describe your design needs in detail. Include information about your brand, target audience, preferred style, colors, and any specific requirements.",
      uploadReferences: "Upload Reference Files",
      dragHere: "Drag & drop your reference files here or click to browse",
      acceptedFormats: "Accepted formats: JPG, PNG, PDF (max 5 files, 10MB each)",
      references: "References",
      designUse: "Design Use",
      designUseOptions: {
        placeholder: "Select primary use",
        print: "Print Materials",
        digital: "Digital/Web",
        both: "Both Print and Digital",
        merchandise: "Merchandise",
        signage: "Signage",
        other: "Other",
      },
      revisions: "Revision Package",
      revisionOptions: {
        standard: "Standard (2 revisions)",
        premium: "Premium (5 revisions)",
        unlimited: "Unlimited (within 30 days)",
      },
      timeline: "Timeline",
      timelineOptions: {
        standard: "Standard (7-10 business days)",
        expedited: "Expedited (3-5 business days)",
        rush: "Rush (1-2 business days)",
      },
      additionalNotes: "Additional Notes",
      additionalNotesPlaceholder: "Any other information that might help our designers understand your needs better.",
      confirmOrder: "Confirm Order",
      addToCart: "Add to Cart",
      addingToCart: "Adding to Cart...",
      addedToCart: "Added to Cart!",
      required: "Required",
      pleaseComplete: "Please complete the required fields",
      filesUploaded: "files uploaded",
    },
    es: {
      title: "Formulario de Solicitud de Diseño Personalizado",
      designType: "Tipo de Diseño",
      designTypeOptions: {
        placeholder: "Selecciona tipo de diseño",
        logo: "Diseño de Logo",
        branding: "Identidad de Marca",
        packaging: "Diseño de Empaque",
        flyer: "Diseño de Volante/Póster",
        brochure: "Diseño de Folleto",
        social: "Gráficos para Redes Sociales",
        illustration: "Ilustración Personalizada",
        other: "Otro (especificar en descripción)",
      },
      designDescription: "Descripción del Diseño",
      designDescriptionPlaceholder:
        "Describe tus necesidades de diseño en detalle. Incluye información sobre tu marca, público objetivo, estilo preferido, colores y cualquier requisito específico.",
      uploadReferences: "Subir Archivos de Referencia",
      dragHere: "Arrastra y suelta tus archivos de referencia aquí o haz clic para buscar",
      acceptedFormats: "Formatos aceptados: JPG, PNG, PDF (máx 5 archivos, 10MB cada uno)",
      references: "Referencias",
      designUse: "Uso del Diseño",
      designUseOptions: {
        placeholder: "Selecciona uso principal",
        print: "Materiales Impresos",
        digital: "Digital/Web",
        both: "Impreso y Digital",
        merchandise: "Mercancía",
        signage: "Señalización",
        other: "Otro",
      },
      revisions: "Paquete de Revisiones",
      revisionOptions: {
        standard: "Estándar (2 revisiones)",
        premium: "Premium (5 revisiones)",
        unlimited: "Ilimitado (dentro de 30 días)",
      },
      timeline: "Tiempo de Entrega",
      timelineOptions: {
        standard: "Estándar (7-10 días hábiles)",
        expedited: "Acelerado (3-5 días hábiles)",
        rush: "Urgente (1-2 días hábiles)",
      },
      additionalNotes: "Notas Adicionales",
      additionalNotesPlaceholder:
        "Cualquier otra información que pueda ayudar a nuestros diseñadores a entender mejor tus necesidades.",
      confirmOrder: "Confirmar Pedido",
      addToCart: "Añadir al Carrito",
      addingToCart: "Añadiendo al Carrito...",
      addedToCart: "¡Añadido al Carrito!",
      required: "Requerido",
      pleaseComplete: "Por favor completa los campos requeridos",
      filesUploaded: "archivos subidos",
    },
  }

  const t = language === "en" ? content.en : content.es

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed the 5 file limit
    if (referenceFiles.length + files.length > 5) {
      alert(language === "en" ? "Maximum 5 files allowed" : "Máximo 5 archivos permitidos")
      return
    }

    const newFiles: File[] = []
    const newImages: string[] = []

    Array.from(files).forEach((file) => {
      // Check file type
      const validTypes = ["image/jpeg", "image/png", "application/pdf"]
      if (!validTypes.includes(file.type)) {
        alert(language === "en" ? "Please upload JPG, PNG, or PDF files" : "Por favor sube archivos JPG, PNG o PDF")
        return
      }

      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert(language === "en" ? "File size must be less than 10MB" : "El tamaño del archivo debe ser menor a 10MB")
        return
      }

      newFiles.push(file)

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string)
            if (newImages.length === newFiles.length) {
              setReferenceImages([...referenceImages, ...newImages])
            }
          }
        }
        reader.readAsDataURL(file)
      } else {
        // For PDFs, use a placeholder
        newImages.push("/placeholder.svg?height=200&width=200&text=PDF")
        if (newImages.length === newFiles.length) {
          setReferenceImages([...referenceImages, ...newImages])
        }
      }
    })

    setReferenceFiles([...referenceFiles, ...newFiles])
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed the 5 file limit
    if (referenceFiles.length + files.length > 5) {
      alert(language === "en" ? "Maximum 5 files allowed" : "Máximo 5 archivos permitidos")
      return
    }

    const newFiles: File[] = []
    const newImages: string[] = []

    Array.from(files).forEach((file) => {
      // Check file type
      const validTypes = ["image/jpeg", "image/png", "application/pdf"]
      if (!validTypes.includes(file.type)) {
        alert(language === "en" ? "Please upload JPG, PNG, or PDF files" : "Por favor sube archivos JPG, PNG o PDF")
        return
      }

      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert(language === "en" ? "File size must be less than 10MB" : "El tamaño del archivo debe ser menor a 10MB")
        return
      }

      newFiles.push(file)

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string)
            if (newImages.length === newFiles.length) {
              setReferenceImages([...referenceImages, ...newImages])
            }
          }
        }
        reader.readAsDataURL(file)
      } else {
        // For PDFs, use a placeholder
        newImages.push("/placeholder.svg?height=200&width=200&text=PDF")
        if (newImages.length === newFiles.length) {
          setReferenceImages([...referenceImages, ...newImages])
        }
      }
    })

    setReferenceFiles([...referenceFiles, ...newFiles])
  }

  const handleAddToCart = () => {
    if (!designType || !designDescription) {
      alert(t.pleaseComplete)
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsAddedToCart(true)

      // Reset after 3 seconds
      setTimeout(() => {
        setIsAddedToCart(false)
      }, 3000)
    }, 1500)
  }

  return (
    <ServiceDetailTemplate serviceId="custom-designs">
      <h2 className="text-2xl font-bold mb-6">{t.title}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="design-type">
              {t.designType} <span className="text-destructive">*</span>
            </Label>
            <Select value={designType} onValueChange={setDesignType}>
              <SelectTrigger>
                <SelectValue placeholder={t.designTypeOptions.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="logo">{t.designTypeOptions.logo}</SelectItem>
                <SelectItem value="branding">{t.designTypeOptions.branding}</SelectItem>
                <SelectItem value="packaging">{t.designTypeOptions.packaging}</SelectItem>
                <SelectItem value="flyer">{t.designTypeOptions.flyer}</SelectItem>
                <SelectItem value="brochure">{t.designTypeOptions.brochure}</SelectItem>
                <SelectItem value="social">{t.designTypeOptions.social}</SelectItem>
                <SelectItem value="illustration">{t.designTypeOptions.illustration}</SelectItem>
                <SelectItem value="other">{t.designTypeOptions.other}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="design-description">
              {t.designDescription} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="design-description"
              placeholder={t.designDescriptionPlaceholder}
              rows={5}
              value={designDescription}
              onChange={(e) => setDesignDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.uploadReferences}</Label>
            <div
              className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {referenceFiles.length > 0 ? (
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium">
                    {referenceFiles.length} {t.filesUploaded}
                  </p>
                </div>
              ) : (
                <>
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t.dragHere}</p>
                  <p className="text-xs text-muted-foreground mt-2">{t.acceptedFormats}</p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                multiple
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="design-use">{t.designUse}</Label>
            <Select value={designUse} onValueChange={setDesignUse}>
              <SelectTrigger>
                <SelectValue placeholder={t.designUseOptions.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="print">{t.designUseOptions.print}</SelectItem>
                <SelectItem value="digital">{t.designUseOptions.digital}</SelectItem>
                <SelectItem value="both">{t.designUseOptions.both}</SelectItem>
                <SelectItem value="merchandise">{t.designUseOptions.merchandise}</SelectItem>
                <SelectItem value="signage">{t.designUseOptions.signage}</SelectItem>
                <SelectItem value="other">{t.designUseOptions.other}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="revisions">{t.revisions}</Label>
            <RadioGroup value={revisions} onValueChange={setRevisions}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard">{t.revisionOptions.standard}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium">{t.revisionOptions.premium}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unlimited" id="unlimited" />
                <Label htmlFor="unlimited">{t.revisionOptions.unlimited}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">{t.timeline}</Label>
            <RadioGroup value={timeline} onValueChange={setTimeline}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="timeline-standard" />
                <Label htmlFor="timeline-standard">{t.timelineOptions.standard}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expedited" id="expedited" />
                <Label htmlFor="expedited">{t.timelineOptions.expedited}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rush" id="rush" />
                <Label htmlFor="rush">{t.timelineOptions.rush}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional-notes">{t.additionalNotes}</Label>
            <Textarea id="additional-notes" placeholder={t.additionalNotesPlaceholder} rows={3} />
          </div>

          <div className="pt-4">
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={isSubmitting || isAddedToCart || !designType || !designDescription}
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

        {/* Right column - References and Timeline */}
        <div>
          <Tabs defaultValue="references">
            <TabsList className="w-full">
              <TabsTrigger value="references" className="flex-1">
                {t.references}
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex-1">
                {t.timeline}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="references" className="mt-4">
              {referenceImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {referenceImages.map((image, index) => (
                    <div key={index} className="aspect-square relative rounded-md overflow-hidden border">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Reference ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/20 rounded-lg p-8 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {language === "en"
                      ? "Upload reference files to help our designers understand your vision"
                      : "Sube archivos de referencia para ayudar a nuestros diseñadores a entender tu visión"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              <div className="space-y-8">
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-xl font-bold">{language === "en" ? "Order Submission" : "Envío de Pedido"}</h3>
                  <p className="text-muted-foreground">
                    {language === "en"
                      ? "Complete the form and submit your design request"
                      : "Completa el formulario y envía tu solicitud de diseño"}
                  </p>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-xl font-bold">
                    {language === "en" ? "Designer Assignment" : "Asignación de Diseñador"}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === "en"
                      ? "A designer will be assigned to your project within 24 hours"
                      : "Un diseñador será asignado a tu proyecto dentro de 24 horas"}
                  </p>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <h3 className="text-xl font-bold">{language === "en" ? "Initial Concept" : "Concepto Inicial"}</h3>
                  <p className="text-muted-foreground">
                    {language === "en"
                      ? "First design concepts delivered based on your timeline selection"
                      : "Primeros conceptos de diseño entregados según tu selección de tiempo"}
                  </p>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    4
                  </div>
                  <h3 className="text-xl font-bold">{language === "en" ? "Revisions" : "Revisiones"}</h3>
                  <p className="text-muted-foreground">
                    {language === "en"
                      ? "Provide feedback and receive revisions based on your selected package"
                      : "Proporciona comentarios y recibe revisiones según el paquete seleccionado"}
                  </p>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    5
                  </div>
                  <h3 className="text-xl font-bold">{language === "en" ? "Final Delivery" : "Entrega Final"}</h3>
                  <p className="text-muted-foreground">
                    {language === "en"
                      ? "Receive your completed design files in all requested formats"
                      : "Recibe tus archivos de diseño completados en todos los formatos solicitados"}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ServiceDetailTemplate>
  )
}
