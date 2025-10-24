'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Image, DollarSign, Activity, Zap, BarChart3, PieChart } from 'lucide-react'
import { motion } from 'framer-motion'
import SpotlightCard from '@/components/ui/SpotlightCard'
import { Badge } from '@/components/ui/badge'

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    totalGenerations: number
    totalRevenue: number
    avgCreditsPerUser: number
    conversionRate: number
  }
  growth: {
    usersGrowth: number
    revenueGrowth: number
    generationsGrowth: number
  }
  topModels: Array<{
    name: string
    count: number
    percentage: number
  }>
  usersByPlan: Array<{
    plan: string
    count: number
    percentage: number
  }>
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/admin/analytics?range=${timeRange}`)
      const data = await res.json()
      if (data.success) {
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
      </div>
    )
  }

  const overview = analytics?.overview || {
    totalUsers: 0,
    activeUsers: 0,
    totalGenerations: 0,
    totalRevenue: 0,
    avgCreditsPerUser: 0,
    conversionRate: 0,
  }

  const growth = analytics?.growth || {
    usersGrowth: 0,
    revenueGrowth: 0,
    generationsGrowth: 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f] p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-purple-400" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Track performance and insights</p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg transition-all ${
                timeRange === range
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            label: 'Total Users',
            value: overview.totalUsers,
            growth: growth.usersGrowth,
            icon: Users,
            color: 'purple',
          },
          {
            label: 'Active Users',
            value: overview.activeUsers,
            growth: 0,
            icon: Activity,
            color: 'blue',
          },
          {
            label: 'Generations',
            value: overview.totalGenerations,
            growth: growth.generationsGrowth,
            icon: Image,
            color: 'pink',
          },
          {
            label: 'Total Revenue',
            value: `$${overview.totalRevenue.toFixed(2)}`,
            growth: growth.revenueGrowth,
            icon: DollarSign,
            color: 'green',
          },
          {
            label: 'Avg Credits/User',
            value: overview.avgCreditsPerUser.toFixed(1),
            growth: 0,
            icon: Zap,
            color: 'yellow',
          },
          {
            label: 'Conversion Rate',
            value: `${overview.conversionRate.toFixed(1)}%`,
            growth: 0,
            icon: TrendingUp,
            color: 'emerald',
          },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SpotlightCard className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-xs">{stat.label}</p>
                    <Icon className={`h-4 w-4 text-${stat.color}-400`} />
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  {stat.growth !== 0 && (
                    <div className="flex items-center gap-1">
                      <TrendingUp
                        className={`h-3 w-3 ${
                          stat.growth > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          stat.growth > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {stat.growth > 0 ? '+' : ''}
                        {stat.growth.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Models */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SpotlightCard className="p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Top Models</h2>
            </div>
            <div className="space-y-4">
              {(analytics?.topModels || []).map((model) => (
                <div key={model.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">{model.name}</span>
                    <span className="text-purple-400 font-medium">{model.count}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all"
                      style={{ width: `${model.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {(!analytics?.topModels || analytics.topModels.length === 0) && (
                <p className="text-gray-500 text-center py-8">No data available</p>
              )}
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Users by Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SpotlightCard className="p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Users by Plan</h2>
            </div>
            <div className="space-y-4">
              {(analytics?.usersByPlan || []).map((plan) => (
                <div key={plan.plan} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          plan.plan === 'business'
                            ? 'bg-green-500/20 text-green-300'
                            : plan.plan === 'pro'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-gray-500/20 text-gray-300'
                        }
                      >
                        {plan.plan.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-white font-medium">{plan.count}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        plan.plan === 'business'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : plan.plan === 'pro'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          : 'bg-gradient-to-r from-gray-500 to-gray-600'
                      }`}
                      style={{ width: `${plan.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {(!analytics?.usersByPlan || analytics.usersByPlan.length === 0) && (
                <p className="text-gray-500 text-center py-8">No data available</p>
              )}
            </div>
          </SpotlightCard>
        </motion.div>
      </div>

      {/* Revenue Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <SpotlightCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="h-6 w-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">Revenue Over Time</h2>
          </div>
          <div className="h-64 flex items-center justify-center bg-white/5 rounded-lg">
            <p className="text-gray-500">Chart visualization coming soon...</p>
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  )
}
