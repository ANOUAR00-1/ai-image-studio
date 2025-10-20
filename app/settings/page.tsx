'use client'

import { Settings } from '@/components/pages/settings/SettingsPage'
import { ProtectedRoute } from '@/components/pages/shared/ProtectedRoute'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f]"
    >
      <ProtectedRoute feature="Settings">
        <Settings />
      </ProtectedRoute>
    </motion.div>
  )
}
