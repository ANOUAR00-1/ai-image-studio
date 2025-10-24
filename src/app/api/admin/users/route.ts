import { withAdmin } from '@/backend/utils/middleware'
import { ApiResponse } from '@/backend/utils/response'
import { supabaseAdmin } from '@/lib/supabase/server'

export const GET = withAdmin(async () => {
  try {
    // Fetch all users with their generation counts
    const { data: users, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        *,
        generations:generations(count)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Format the data
    const formattedUsers = users.map(user => ({
      ...user,
      total_generations: user.generations?.[0]?.count || 0
    }))

    return ApiResponse.success({ users: formattedUsers })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return ApiResponse.serverError()
  }
})
