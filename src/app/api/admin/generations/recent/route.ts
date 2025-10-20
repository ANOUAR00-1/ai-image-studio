import { withAuth } from '@/backend/utils/middleware'
import { ApiResponse } from '@/backend/utils/response'
import { AdminService } from '@/backend/services/admin.service'

export const GET = withAuth(async () => {
  try {
    const generations = await AdminService.getRecentGenerations(10)
    
    return ApiResponse.success({ generations })
  } catch (error) {
    console.error('Get recent generations error:', error)
    return ApiResponse.serverError()
  }
})
