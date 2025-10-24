import { withAdmin } from '@/backend/utils/middleware'
import { ApiResponse } from '@/backend/utils/response'
import { supabaseAdmin } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export const GET = withAdmin(async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const range = searchParams.get('range') || '7d'

    // Calculate date range
    const now = new Date()
    const daysAgo = range === '24h' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 90
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)

    // Fetch users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('profiles')
      .select('*')

    if (usersError) throw usersError

    // Fetch generations
    const { data: generations, error: genError } = await supabaseAdmin
      .from('generations')
      .select('*')
      .gte('created_at', startDate.toISOString())

    if (genError) throw genError

    // Fetch credit transactions
    const { data: transactions, error: transError } = await supabaseAdmin
      .from('credit_transactions')
      .select('*')
      .in('type', ['purchase', 'subscription'])
      .gte('created_at', startDate.toISOString())

    if (transError) throw transError

    // Calculate overview stats
    const totalUsers = users.length
    const activeUsers = users.filter(u => {
      const lastActive = new Date(u.updated_at || u.created_at)
      return lastActive > startDate
    }).length

    const totalGenerations = generations.length
    const totalRevenue = transactions.reduce((sum, t) => sum + Math.abs(t.amount) * 0.10, 0)
    const avgCreditsPerUser = totalUsers > 0 ? users.reduce((sum, u) => sum + (u.credits || 0), 0) / totalUsers : 0
    const paidUsers = users.filter(u => u.plan !== 'free').length
    const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0

    // Calculate growth (mock data for now)
    const usersGrowth = 15.5
    const revenueGrowth = 23.2
    const generationsGrowth = 18.7

    // Top models
    const modelCounts: Record<string, number> = {}
    generations.forEach(gen => {
      modelCounts[gen.model] = (modelCounts[gen.model] || 0) + 1
    })
    const topModels = Object.entries(modelCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalGenerations > 0 ? (count / totalGenerations) * 100 : 0
      }))

    // Users by plan
    const planCounts: Record<string, number> = {
      free: 0,
      pro: 0,
      business: 0
    }
    users.forEach(user => {
      planCounts[user.plan] = (planCounts[user.plan] || 0) + 1
    })
    const usersByPlan = Object.entries(planCounts).map(([plan, count]) => ({
      plan,
      count,
      percentage: totalUsers > 0 ? (count / totalUsers) * 100 : 0
    }))

    return ApiResponse.success({
      overview: {
        totalUsers,
        activeUsers,
        totalGenerations,
        totalRevenue,
        avgCreditsPerUser,
        conversionRate
      },
      growth: {
        usersGrowth,
        revenueGrowth,
        generationsGrowth
      },
      topModels,
      usersByPlan
    })
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return ApiResponse.serverError()
  }
})
