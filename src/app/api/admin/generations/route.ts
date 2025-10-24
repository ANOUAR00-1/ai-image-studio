import { withAdmin } from '@/backend/utils/middleware'
import { ApiResponse } from '@/backend/utils/response'
import { supabaseAdmin } from '@/lib/supabase/server'

export const GET = withAdmin(async () => {
  try {
    // Fetch all generations with user info
    const { data: generations, error } = await supabaseAdmin
      .from('generations')
      .select(`
        *,
        profiles:user_id (
          email,
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    // Format the data
    const formattedGenerations = generations.map(gen => ({
      ...gen,
      user_email: gen.profiles?.email || 'Unknown',
      user_name: gen.profiles?.name || 'Unknown'
    }))

    return ApiResponse.success({ generations: formattedGenerations })
  } catch (error) {
    console.error('Failed to fetch generations:', error)
    return ApiResponse.serverError()
  }
})
