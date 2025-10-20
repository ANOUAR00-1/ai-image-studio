'use client'

import { useState, useEffect } from 'react'
import { CreditCard, DollarSign, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Payment {
  id: string
  user_email: string
  amount: number
  plan: string
  status: string
  created_at: string
  payment_method?: string
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments')
      const data = await response.json()
      if (data.success) {
        setPayments(data.data.payments || [])
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
  const successfulPayments = payments.filter(p => p.status === 'succeeded').length
  const failedPayments = payments.filter(p => p.status === 'failed').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f]">
        <motion.div className="text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading payments...</p>
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
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Payments</h1>
              <p className="text-sm text-gray-400">Track all payment transactions</p>
            </div>
          </div>
          <Link href="/admin"><Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">Back</Button></Link>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 uppercase">Total Revenue</p>
                  <p className="text-3xl font-black text-white mt-1">${totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </motion.div>
          <motion.div variants={staggerItem}>
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 uppercase">Total Payments</p>
                  <p className="text-3xl font-black text-white mt-1">{payments.length}</p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </motion.div>
          <motion.div variants={staggerItem}>
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 uppercase">Successful</p>
                  <p className="text-3xl font-black text-green-400 mt-1">{successfulPayments}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </motion.div>
          <motion.div variants={staggerItem}>
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 uppercase">Failed</p>
                  <p className="text-3xl font-black text-red-400 mt-1">{failedPayments}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 bg-white/5 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
          </div>
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Plan</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 text-white">{payment.user_email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {payment.plan.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-semibold">${payment.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        payment.status === 'succeeded' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                        'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                      }`}>{payment.status}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No payments yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
