import { supabaseAdmin } from '@/lib/supabase/server'

export class AdminService {
  // Get platform stats
  static async getStats() {
    try {
      // Total users
      const { count: totalUsers } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // New users today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const { count: newUsersToday } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

      // Total generations
      const { count: totalGenerations } = await supabaseAdmin
        .from('generations')
        .select('*', { count: 'exact', head: true })

      // Images vs Videos
      const { count: totalImages } = await supabaseAdmin
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'image')

      const { count: totalVideos } = await supabaseAdmin
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'video')

      // Total credits used
      const { data: creditsData } = await supabaseAdmin
        .from('credit_transactions')
        .select('amount')
        .eq('type', 'generation')

      const totalCreditsUsed = creditsData?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0

      // Total revenue (from purchases)
      const { data: revenueData } = await supabaseAdmin
        .from('credit_transactions')
        .select('amount')
        .eq('type', 'purchase')

      const totalRevenue = (revenueData?.reduce((sum, t) => sum + t.amount, 0) || 0) * 0.01 // Assuming $0.01 per credit

      return {
        totalUsers: totalUsers || 0,
        newUsersToday: newUsersToday || 0,
        totalGenerations: totalGenerations || 0,
        totalImages: totalImages || 0,
        totalVideos: totalVideos || 0,
        totalCreditsUsed,
        totalRevenue,
        activeToday: newUsersToday || 0,
      }
    } catch (error) {
      console.error('Get stats error:', error)
      throw error
    }
  }

  // Get recent users
  static async getRecentUsers(limit = 10) {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, email, name, plan, credits, created_at')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get recent users error:', error)
      throw error
    }
  }

  // Get recent generations
  static async getRecentGenerations(limit = 10) {
    try {
      const { data, error} = await supabaseAdmin
        .from('generations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      
      return data || []
    } catch (error) {
      console.error('Get recent generations error:', error)
      throw error
    }
  }

  // Get all users with pagination
  static async getAllUsers(page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit

      const { data, error, count } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      
      return {
        users: data,
        total: count,
        page,
        totalPages: Math.ceil((count || 0) / limit),
      }
    } catch (error) {
      console.error('Get all users error:', error)
      throw error
    }
  }

  // Update user plan
  static async updateUserPlan(userId: string, plan: 'free' | 'pro' | 'business') {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ plan })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Update user plan error:', error)
      throw error
    }
  }

  // Grant bonus credits
  static async grantBonusCredits(userId: string, amount: number, description: string) {
    try {
      // Add credits using RPC function
      const { error: profileError } = await supabaseAdmin
        .rpc('add_credits', { user_id: userId, credit_amount: amount })

      if (profileError) throw profileError

      // Log transaction
      const { error: transactionError } = await supabaseAdmin
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount,
          type: 'bonus',
          description,
        })

      if (transactionError) throw transactionError

      return { success: true }
    } catch (error) {
      console.error('Grant bonus credits error:', error)
      throw error
    }
  }

  // Ban/unban user
  static async toggleUserBan(userId: string, banned: boolean) {
    // This would require adding a 'banned' column to profiles table
    // For now, we can use auth metadata
    try {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { ban_duration: banned ? '876000h' : 'none' } // 100 years or none
      )

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Toggle user ban error:', error)
      throw error
    }
  }
}
