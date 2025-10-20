import { NextRequest } from 'next/server'
import { withAuth } from '@/backend/utils/middleware'
import { ApiResponse } from '@/backend/utils/response'
import { GenerationService } from '@/backend/services/generation.service'

export const DELETE = withAuth(
  async (request: NextRequest, { userId }: { userId: string }) => {
    try {
      // Get id from URL
      const url = new URL(request.url)
      const id = url.pathname.split('/').pop()
      
      if (!id) {
        return ApiResponse.validationError('Generation ID required')
      }
      
      await GenerationService.deleteGeneration(id, userId)
      
      return ApiResponse.success({ message: 'Generation deleted successfully' })
    } catch (error) {
      console.error('Delete generation error:', error)
      return ApiResponse.serverError()
    }
  }
)
