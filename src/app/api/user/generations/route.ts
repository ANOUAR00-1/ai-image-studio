import { NextRequest } from 'next/server'
import { ApiResponse } from '@/backend/utils/response'
import { supabaseAdmin } from '@/lib/supabase/server'
import { verifyAuth } from '@/backend/utils/middleware'

export const dynamic = 'force-dynamic'

// GET /api/user/generations - Get user's recent generations
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success || !authResult.userId) {
      return ApiResponse.unauthorized()
    }

    const userId = authResult.userId
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Fetch recent generations
    const { data: generations, error } = await supabaseAdmin
      .from('generations')
      .select('id, type, prompt, url, created_at, credits_used')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return ApiResponse.success({
      generations: generations || []
    })

  } catch (error) {
    console.error('Get user generations error:', error)
    return ApiResponse.serverError()
  }
}
