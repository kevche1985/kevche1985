"use client"

import type React from "react"

import { useState, useContext } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { LanguageContext } from "@/context/language-context"

interface JourneySpotProps {
  title: string
  description: string
  icon: React.ReactNode
  link: string
  isActive?: boolean
  onClick?: () => void
}

export function JourneySpot({ title, description, icon, link, isActive = false, onClick }: JourneySpotProps) {
  const { language } = useContext(LanguageContext) || { language: "es" }
  const [isHovered, setIsHovered] = useState(false)

  const exploreText = language === "en" ? "Explore" : "Explorar"

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer"
    >
      <Card
        className={`relative overflow-hidden transition-all duration-300 h-full bg-card ${
          isActive ? "ring-2 ring-primary shadow-lg" : ""
        }`}
      >
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex flex-col items-center text-center h-full">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
                isActive || isHovered ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-4 flex-grow">{description}</p>
            <Button asChild variant="outline" className="w-full mt-auto">
              <Link href={link}>{exploreText}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
