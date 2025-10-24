"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  label?: string
  fallbackUrl?: string
  className?: string
  variant?: "default" | "ghost" | "outline" | "secondary"
}

export function BackButton({ 
  label = "Back", 
  fallbackUrl = "/",
  className = "",
  variant = "ghost"
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to home or specified URL
      router.push(fallbackUrl)
    }
  }

  return (
    <Button
      variant={variant}
      onClick={handleBack}
      className={`gap-2 hover:scale-105 transition-all duration-150 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  )
}
