"use client"

import OptimizedPageWrapper from "@/components/OptimizedPageWrapper"
import { ProtectedRoute } from "@/components/pages/shared/ProtectedRoute"
import { ModernDashboard } from "@/components/pages/dashboard/ModernDashboard"

export default function DashboardPage() {
  return (
    <OptimizedPageWrapper className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f]">
      <ProtectedRoute feature="Dashboard">
        <ModernDashboard />
      </ProtectedRoute>
    </OptimizedPageWrapper>
  )
}