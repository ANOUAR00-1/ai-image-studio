'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DollarSign, CreditCard, TrendingUp, Download, Search, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SpotlightCard from '@/components/ui/SpotlightCard'

interface Payment {
  id: string
  user_email: string
  user_name: string
  amount: number
  credits: number
  plan: string
  status: 'completed' | 'pending' | 'failed'
  payment_method: string
  created_at: string
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/admin/payments')
      const data = await res.json()
      if (data.success) {
        setPayments(data.data.payments || [])
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalRevenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    totalPayments: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    thisMonth: payments.filter(p => {
      const date = new Date(p.created_at)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).reduce((sum, p) => sum + p.amount, 0),
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
              <DollarSign className="h-8 w-8 text-green-400" />
              Payments & Revenue
            </h1>
            <p className="text-gray-400 mt-1">Track all transactions and revenue</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {[
          { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'green' },
          { label: 'This Month', value: `$${stats.thisMonth.toFixed(2)}`, icon: TrendingUp, color: 'blue' },
          { label: 'Total Payments', value: stats.totalPayments, icon: CreditCard, color: 'purple' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'green' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'yellow' },
          { label: 'Failed', value: stats.failed, icon: XCircle, color: 'red' },
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
                placeholder="Search by user email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'completed', 'pending', 'failed'].map((status) => (
                <Button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  className={filterStatus === status ? 'bg-purple-600' : ''}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* Payments Table */}
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
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Credits</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Method</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-medium">{payment.user_name}</p>
                        <p className="text-gray-400 text-sm">{payment.user_email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        className={
                          payment.plan === 'business'
                            ? 'bg-green-500/20 text-green-300'
                            : payment.plan === 'pro'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-gray-500/20 text-gray-300'
                        }
                      >
                        {payment.plan.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-green-400 font-bold">${payment.amount.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-purple-400 font-medium">{payment.credits}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        className={
                          payment.status === 'completed'
                            ? 'bg-green-500/20 text-green-300'
                            : payment.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-red-500/20 text-red-300'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300 text-sm">{payment.payment_method}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-400 text-sm">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No payments found</p>
            </div>
          )}
        </SpotlightCard>
      </motion.div>
    </div>
  )
}
