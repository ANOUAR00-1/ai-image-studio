'use client'

import { useState, useEffect } from 'react'
import { Image, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Generation {
  id: string
  user_email: string
  type: string
  model: string
  status: string
  created_at: string
  prompt?: string
}

export default function AdminGenerationsPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchGenerations()
  }, [])

  const fetchGenerations = async () => {
    try {
      const response = await fetch('/api/admin/generations')
      const data = await response.json()
      if (data.success) {
        setGenerations(data.data.generations || [])
      }
    } catch (error) {
      console.error('Failed to fetch generations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGenerations = generations.filter(gen => {
    const matchesSearch = gen.user_email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || gen.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f]">
        <motion.div className="text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading generations...</p>
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Image className="h-6 w-6 text-white" aria-label="Generations icon" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Generations</h1>
              <p className="text-sm text-gray-400">View all AI generations</p>
            </div>
          </div>
          <Link href="/admin"><Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">Back</Button></Link>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <p className="text-sm text-gray-400 uppercase">Total</p>
              <p className="text-3xl font-black text-white mt-1">{generations.length}</p>
            </div>
          </motion.div>
          <motion.div variants={staggerItem}>
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <p className="text-sm text-gray-400 uppercase">Completed</p>
              <p className="text-3xl font-black text-green-400 mt-1">{generations.filter(g => g.status === 'completed').length}</p>
            </div>
          </motion.div>
          <motion.div variants={staggerItem}>
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <p className="text-sm text-gray-400 uppercase">Failed</p>
              <p className="text-3xl font-black text-red-400 mt-1">{generations.filter(g => g.status === 'failed').length}</p>
            </div>
          </motion.div>
        </motion.div>

        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="processing">Processing</option>
            </select>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Model</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredGenerations.map((gen) => (
                <tr key={gen.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-white">{gen.user_email}</td>
                  <td className="px-6 py-4 text-gray-300">{gen.type}</td>
                  <td className="px-6 py-4 text-gray-300">{gen.model}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      gen.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                      gen.status === 'failed' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
                      'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                    }`}>{gen.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{new Date(gen.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
