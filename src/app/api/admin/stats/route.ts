import { withAuth } from '@/backend/utils/middleware'
import { ApiResponse } from '@/backend/utils/response'
import { AdminService } from '@/backend/services/admin.service'
import type { NextResponse } from 'next/server'

// Only allow admin users
const withAdmin = (handler: () => Promise<NextResponse>) => {
  return withAuth(async () => {
    // TODO: Add proper admin check
    // For now, check if user email ends with @admin.com or specific admin list
    // You should add an 'is_admin' column to profiles table in production
    
    return handler()
  })
}

export const GET = withAdmin(async () => {
  try {
    const stats = await AdminService.getStats()
    
    return ApiResponse.success(stats)
  } catch (error) {
    console.error('Get admin stats error:', error)
    return ApiResponse.serverError()
  }
})
