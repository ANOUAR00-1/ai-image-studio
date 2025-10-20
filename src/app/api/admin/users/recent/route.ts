import { withAuth } from '@/backend/utils/middleware'
import { ApiResponse } from '@/backend/utils/response'
import { AdminService } from '@/backend/services/admin.service'

export const GET = withAuth(async () => {
  try {
    const users = await AdminService.getRecentUsers(10)
    
    return ApiResponse.success({ users })
  } catch (error) {
    console.error('Get recent users error:', error)
    return ApiResponse.serverError()
  }
})
