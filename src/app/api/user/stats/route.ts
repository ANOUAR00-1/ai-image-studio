import { NextRequest } from 'next/server'
import { ApiResponse } from '@/backend/utils/response'
import { supabaseAdmin } from '@/lib/supabase/server'
import { verifyAuth } from '@/backend/utils/middleware'

export const dynamic = 'force-dynamic'

// GET /api/user/stats - Get user usage statistics
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success || !authResult.userId) {
      return ApiResponse.unauthorized()
    }

    const userId = authResult.userId

    // Get current month start date
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Count images generated this month
    const { count: imagesCount } = await supabaseAdmin
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('type', 'image')
      .gte('created_at', monthStart.toISOString())

    // Count videos generated this month
    const { count: videosCount } = await supabaseAdmin
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('type', 'video')
      .gte('created_at', monthStart.toISOString())

    // Calculate credits used this month
    const { data: generations } = await supabaseAdmin
      .from('generations')
      .select('credits_used')
      .eq('user_id', userId)
      .gte('created_at', monthStart.toISOString())

    const creditsUsed = generations?.reduce((sum, gen) => sum + (gen.credits_used || 0), 0) || 0

    // Calculate days active this month
    const { data: activeDays } = await supabaseAdmin
      .from('generations')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', monthStart.toISOString())

    const uniqueDays = new Set(
      activeDays?.map(gen => new Date(gen.created_at).toDateString()) || []
    )

    return ApiResponse.success({
      imagesGenerated: imagesCount || 0,
      videosGenerated: videosCount || 0,
      creditsUsed,
      daysActive: uniqueDays.size
    })

  } catch (error) {
    console.error('Get user stats error:', error)
    return ApiResponse.serverError()
  }
}
