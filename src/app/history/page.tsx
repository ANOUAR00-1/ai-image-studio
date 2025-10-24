"use client"

import { motion } from "motion/react"
import { HistoryPage } from "@/components/pages/history/HistoryPage"
import { ProtectedRoute } from "@/components/pages/shared/ProtectedRoute"

export default function History() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f]"
    >
      <ProtectedRoute feature="Generation History">
        <HistoryPage />
      </ProtectedRoute>
    </motion.div>
  )
}
