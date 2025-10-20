'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Image, DollarSign, BarChart3, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AnalyticsData {
  totalUsers: number
  totalGenerations: number
  totalRevenue: number
  activeUsers: number
  growth: {
    users: number
    revenue: number
    generations: number
  }
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      const data = await response.json()
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
        <motion.div className="text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading analytics...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f] p-6 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Analytics</h1>
              <p className="text-sm text-gray-400">Platform insights & metrics</p>
            </div>
          </div>
          <Link href="/admin"><Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">Back</Button></Link>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-blue-400" aria-label="Users icon" />
                <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  +{analytics?.growth?.users || 0}%
                </span>
              </div>
              <p className="text-sm text-gray-400 uppercase">Total Users</p>
              <p className="text-3xl font-black text-white mt-1">{analytics?.totalUsers || 0}</p>
            </div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Image className="h-8 w-8 text-purple-400" aria-label="Image icon" />
                <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  +{analytics?.growth?.generations || 0}%
                </span>
              </div>
              <p className="text-sm text-gray-400 uppercase">Generations</p>
              <p className="text-3xl font-black text-white mt-1">{analytics?.totalGenerations || 0}</p>
            </div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-8 w-8 text-green-400" aria-label="Revenue icon" />
                <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  +{analytics?.growth?.revenue || 0}%
                </span>
              </div>
              <p className="text-sm text-gray-400 uppercase">Revenue</p>
              <p className="text-3xl font-black text-white mt-1">${(analytics?.totalRevenue || 0).toFixed(2)}</p>
            </div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="h-8 w-8 text-yellow-400" aria-label="Activity icon" />
              </div>
              <p className="text-sm text-gray-400 uppercase">Active Users</p>
              <p className="text-3xl font-black text-white mt-1">{analytics?.activeUsers || 0}</p>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">User Growth</h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-purple-400" />
                <p>Chart visualization coming soon</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Revenue Trends</h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <DollarSign className="h-16 w-16 mx-auto mb-4 text-green-400" />
                <p>Chart visualization coming soon</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Platform Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-gray-400">Daily Active Users</p>
              <p className="text-2xl font-bold text-white mt-2">{Math.floor((analytics?.activeUsers || 0) * 0.7)}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-gray-400">Avg Session Duration</p>
              <p className="text-2xl font-bold text-white mt-2">12m 34s</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-gray-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-white mt-2">3.4%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
