"use client"

import type React from "react"

import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, FileImage, FileText, FileCode } from "lucide-react"
import { LanguageContext } from "@/context/language-context"

interface AIToolTemplateProps {
  title: string
  description: string
  placeholder: string
  generateFunction: (prompt: string) => Promise<any>
  resultComponent: React.ReactNode
}

export function AIToolTemplate({
  title,
  description,
  placeholder,
  generateFunction,
  resultComponent,
}: AIToolTemplateProps) {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<any>(null)

  const translations = {
    en: {
      generate: "Generate",
      generating: "Generating...",
      downloadAs: "Download as",
      png: "PNG",
      pdf: "PDF",
      svg: "SVG",
      enterPrompt: "Enter your prompt",
      result: "Result",
    },
    es: {
      generate: "Generar",
      generating: "Generando...",
      downloadAs: "Descargar como",
      png: "PNG",
      pdf: "PDF",
      svg: "SVG",
      enterPrompt: "Ingresa tu instrucción",
      result: "Resultado",
    },
  }

  const t = language === "en" ? translations.en : translations.es

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const result = await generateFunction(prompt)
      setResult(result)
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = (format: string) => {
    // Implementation would depend on the specific tool and result format
    console.log(`Downloading as ${format}`)
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground mb-8">{description}</p>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <Textarea
              placeholder={placeholder}
              className="min-h-32 mb-4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.generating}
                </>
              ) : (
                t.generate
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">{t.result}</h2>

            <div className="border rounded-lg p-6 bg-muted/20">{resultComponent}</div>

            <div>
              <h3 className="text-sm font-medium mb-2">{t.downloadAs}</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload("png")}>
                  <FileImage className="mr-2 h-4 w-4" />
                  {t.png}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload("pdf")}>
                  <FileText className="mr-2 h-4 w-4" />
                  {t.pdf}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload("svg")}>
                  <FileCode className="mr-2 h-4 w-4" />
                  {t.svg}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
