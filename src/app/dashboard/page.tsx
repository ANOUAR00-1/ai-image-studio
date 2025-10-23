"use client"

import dynamic from 'next/dynamic'
import OptimizedPageWrapper from "@/components/OptimizedPageWrapper"
import { ProtectedRoute } from "@/components/pages/shared/ProtectedRoute"

// Dynamic import for dashboard - it's a heavy component
const ModernDashboard = dynamic(() => import("@/components/pages/dashboard/ModernDashboard").then(mod => ({ default: mod.ModernDashboard })), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f] flex items-center justify-center">
      <div className="text-white text-xl">Loading dashboard...</div>
    </div>
  ),
  ssr: false, // Dashboard requires client-side auth
})

export default function DashboardPage() {
  return (
    <OptimizedPageWrapper className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f]">
      <ProtectedRoute feature="Dashboard">
        <ModernDashboard />
      </ProtectedRoute>
    </OptimizedPageWrapper>
  )
}