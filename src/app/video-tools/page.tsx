"use client"

// VIDEO TOOLS DISABLED - NO FREE VIDEO API AVAILABLE
// Replicate requires payment method, no truly free video generation exists
// Re-enable when you have revenue to pay for video API costs

import { motion } from "motion/react"
// import { VideoTools } from "@/components/pages/home/VideoTools"
// import { ProtectedRoute } from "@/components/pages/shared/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function VideoToolsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f] flex items-center justify-center p-4"
    >
      {/* VIDEO TOOLS TEMPORARILY DISABLED */}
      <div className="max-w-2xl mx-auto text-center">
        <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">
          Video Tools Coming Soon
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          We&apos;re working on bringing you amazing AI video generation features. 
          In the meantime, try our powerful image generation tools!
        </p>
        <Link href="/image-tools">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 h-auto">
            Try Image Tools Instead
          </Button>
        </Link>
      </div>

      {/* ORIGINAL CODE - COMMENTED OUT */}
      {/* <ProtectedRoute feature="AI Video Tools">
        <VideoTools />
      </ProtectedRoute> */}
    </motion.div>
  )
}
