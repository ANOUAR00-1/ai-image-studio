"use client"

import AdminDashboard from '@/components/pages/admin/AdminDashboard'
import { AdminRoute } from '@/components/pages/shared/AdminRoute'

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  )
}
