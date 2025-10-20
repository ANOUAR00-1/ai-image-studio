'use client'

import { useState, useEffect } from 'react'
import { Users, Image, DollarSign, TrendingUp, Activity, Zap, CreditCard, RefreshCw, Sparkles, Crown, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/animations'

interface AdminStats {
  totalUsers: number
  totalGenerations: number
  totalImages: number
  totalVideos: number
  totalCreditsUsed: number
  totalRevenue: number
  activeToday: number
  newUsersToday: number
}

interface RecentUser {
  id: string
  email: string
  name: string
  plan: string
  credits: number
  created_at: string
}

interface RecentGeneration {
  id: string
  user_email: string
  type: string
  model: string
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [recentGenerations, setRecentGenerations] = useState<RecentGeneration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, generationsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users/recent'),
        fetch('/api/admin/generations/recent'),
      ])

      const [statsData, usersData, generationsData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        generationsRes.json(),
      ])

      if (statsData.success) setStats(statsData.data)
      if (usersData.success) setRecentUsers(usersData.data.users)
      if (generationsData.success) setRecentGenerations(generationsData.data.generations)
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f]">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 mx-auto mb-4"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-400 animate-pulse" />
          </div>
          <p className="text-gray-300 font-medium">Loading admin dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f] p-6 space-y-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Header */}
      <motion.div 
        className="flex items-center justify-between relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-400">Manage your PixFusion AI platform</p>
          </div>
        </div>
        <motion.button
          onClick={fetchAdminData}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/50 font-semibold"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={staggerItem}>
          <StatCard
            icon={<Users className="h-6 w-6" />}
            title="Total Users"
            value={stats?.totalUsers || 0}
            subtitle={`+${stats?.newUsersToday || 0} today`}
            color="blue"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            icon={<Image className="h-6 w-6" aria-label="Generations icon" />}
            title="Total Generations"
            value={stats?.totalGenerations || 0}
            subtitle={`${stats?.totalImages || 0} images, ${stats?.totalVideos || 0} videos`}
            color="purple"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            icon={<Zap className="h-6 w-6" />}
            title="Credits Used"
            value={stats?.totalCreditsUsed || 0}
            subtitle="All time"
            color="yellow"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            title="Revenue"
            value={`$${(stats?.totalRevenue || 0).toFixed(2)}`}
            subtitle="Total earned"
            color="green"
          />
        </motion.div>
      </motion.div>

      {/* Activity */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {/* Recent Users */}
        <motion.div 
          className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 hover:border-purple-500/30 transition-all duration-300"
          whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              Recent Users
            </h2>
            <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
              {recentUsers.length} users
            </span>
          </div>
          <div className="space-y-3">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-purple-500/30 group"
                >
                  <div>
                    <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.plan === 'pro' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                      user.plan === 'business' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                      'bg-white/10 text-gray-300'
                    }`}>
                      {user.plan === 'pro' && <Crown className="inline h-3 w-3 mr-1" />}
                      {user.plan}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {user.credits} credits
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No users yet</p>
            )}
          </div>
        </motion.div>

        {/* Recent Generations */}
        <motion.div 
          className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 hover:border-purple-500/30 transition-all duration-300"
          whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              Recent Generations
            </h2>
            <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
              {recentGenerations.length} generations
            </span>
          </div>
          <div className="space-y-3">
            {recentGenerations.length > 0 ? (
              recentGenerations.map((gen) => (
                <motion.div
                  key={gen.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-purple-500/30 group"
                >
                  <div>
                    <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {gen.user_email}
                    </p>
                    <p className="text-sm text-gray-400">
                      {gen.model} • {gen.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        gen.status === 'completed'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : gen.status === 'failed'
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                      }`}
                    >
                      {gen.status}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No generations yet</p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ActionButton
            href="/admin/users"
            icon={<Users className="h-5 w-5" />}
            label="Manage Users"
          />
          <ActionButton
            href="/admin/generations"
            icon={<Image className="h-5 w-5" aria-label="View generations" />}
            label="View Generations"
          />
          <ActionButton
            href="/admin/payments"
            icon={<CreditCard className="h-5 w-5" />}
            label="Payments"
          />
          <ActionButton
            href="/admin/analytics"
            icon={<TrendingUp className="h-5 w-5" />}
            label="Analytics"
          />
        </div>
      </motion.div>
    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode
  title: string
  value: string | number
  subtitle: string
  color: 'blue' | 'purple' | 'yellow' | 'green'
}) {
  const gradients = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    yellow: 'from-yellow-500 to-orange-500',
    green: 'from-green-500 to-emerald-500',
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 hover:border-purple-500/30 transition-all duration-300 group"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradients[color]} mb-4 shadow-lg`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-3xl font-black text-white mt-2 group-hover:text-purple-300 transition-colors">
        {value}
      </p>
      <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
        <TrendingUp className="h-3 w-3 text-green-400" />
        {subtitle}
      </p>
    </motion.div>
  )
}

function ActionButton({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <motion.a
      href={href}
      className="flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-purple-500/30 group"
      whileHover={{ y: -4, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-white">{icon}</div>
      </motion.div>
      <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
        {label}
      </span>
    </motion.a>
  )
}
