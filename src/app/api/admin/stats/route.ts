import { withAdmin } from '@/backend/utils/middleware'
import { ApiResponse } from '@/backend/utils/response'
import { AdminService } from '@/backend/services/admin.service'

export const GET = withAdmin(async () => {
  try {
    const stats = await AdminService.getStats()
    
    return ApiResponse.success(stats)
  } catch (error) {
    console.error('Get admin stats error:', error)
    return ApiResponse.serverError()
  }
})
