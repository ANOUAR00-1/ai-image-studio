'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, Search, Crown, CreditCard, Download, Shield, ArrowLeft, Edit, Trash2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SpotlightCard from '@/components/ui/SpotlightCard'

interface User {
  id: string
  email: string
  name: string
  plan: string
  credits: number
  is_admin: boolean
  created_at: string
  last_login?: string
  total_generations?: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({ credits: 0, plan: 'free' })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.success) {
        setUsers(data.data.users || [])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditForm({ credits: user.credits, plan: user.plan })
  }

  const handleSaveUser = async () => {
    if (!editingUser) return
    
    setActionLoading(editingUser.id)
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      if (res.ok) {
        await fetchUsers()
        setEditingUser(null)
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    setActionLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId))
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan
    return matchesSearch && matchesPlan
  })

  const stats = {
    total: users.length,
    free: users.filter(u => u.plan === 'free').length,
    pro: users.filter(u => u.plan === 'pro').length,
    business: users.filter(u => u.plan === 'business').length,
    admins: users.filter(u => u.is_admin).length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f] p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-400" />
              User Management
            </h1>
            <p className="text-gray-400 mt-1">Manage all users and their subscriptions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchUsers}
            variant="outline"
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Users', value: stats.total, icon: Users, color: 'purple' },
          { label: 'Free Plan', value: stats.free, icon: Users, color: 'gray' },
          { label: 'Pro Plan', value: stats.pro, icon: CreditCard, color: 'blue' },
          { label: 'Business', value: stats.business, icon: Shield, color: 'green' },
          { label: 'Admins', value: stats.admins, icon: Crown, color: 'yellow' },
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 text-${stat.color}-400`} />
                </div>
              </SpotlightCard>
            </motion.div>
          )
        })}
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SpotlightCard className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'free', 'pro', 'business'].map((plan) => (
                <Button
                  key={plan}
                  onClick={() => setFilterPlan(plan)}
                  variant={filterPlan === plan ? 'default' : 'outline'}
                  className={filterPlan === plan ? 'bg-purple-600' : ''}
                >
                  {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <SpotlightCard className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">User</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Plan</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Credits</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Generations</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Joined</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium flex items-center gap-2">
                            {user.name}
                            {user.is_admin && <Crown className="h-4 w-4 text-yellow-400" />}
                          </p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        className={
                          user.plan === 'business'
                            ? 'bg-green-500/20 text-green-300'
                            : user.plan === 'pro'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-gray-500/20 text-gray-300'
                        }
                      >
                        {user.plan.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white font-medium">
                        {user.credits === -1 ? '∞' : user.credits}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300">{user.total_generations || 0}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          disabled={actionLoading === user.id}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={actionLoading === user.id}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No users found</p>
            </div>
          )}
        </SpotlightCard>
      </motion.div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-gradient-to-br from-[#2a1a4e] to-[#1a0b2e] rounded-2xl p-8 max-w-md w-full border border-purple-500/20 shadow-2xl"
          >
            <div className="mb-6">
              <h3 className="text-white text-2xl font-bold">Edit User</h3>
              <p className="text-gray-400 text-sm mt-1">{editingUser.email}</p>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-gray-300 text-sm font-semibold block mb-3">Email Address</label>
                <input
                  type="text"
                  value={editingUser.email}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed text-sm"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-semibold block mb-3">Credits</label>
                <input
                  type="number"
                  value={editForm.credits}
                  onChange={(e) => setEditForm({ ...editForm, credits: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-semibold block mb-3">Subscription Plan</label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a78bfa' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="free">Free Plan</option>
                  <option value="pro">Pro Plan</option>
                  <option value="business">Business Plan</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                onClick={() => setEditingUser(null)}
                variant="outline"
                className="flex-1 border-white/20 text-gray-300 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveUser}
                disabled={actionLoading === editingUser.id}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {actionLoading === editingUser.id ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
