import { NextRequest } from 'next/server'
import { withAuth } from '@/backend/utils/middleware'
import { ApiResponse } from '@/backend/utils/response'
import { GenerationService } from '@/backend/services/generation.service'

export const GET = withAuth(async (_request: NextRequest, { userId }) => {
  try {
    const generations = await GenerationService.getUserGenerations(userId, 50, 0)
    
    return ApiResponse.success({
      generations,
      total: generations.length,
    })
  } catch (error) {
    console.error('Get generations error:', error)
    return ApiResponse.serverError()
  }
})
