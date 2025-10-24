'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Image as ImageIcon, Video as VideoIcon, Search, Download, Eye, Trash2, CheckCircle, XCircle, Clock, ArrowLeft, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SpotlightCard from '@/components/ui/SpotlightCard'
import Image from 'next/image'

interface Generation {
  id: string
  user_email: string
  user_name: string
  type: 'image' | 'video'
  model: string
  prompt: string
  status: 'pending' | 'completed' | 'failed'
  credits_used: number
  result_url?: string
  created_at: string
}

export default function AdminGenerationsPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchGenerations()
  }, [])

  const fetchGenerations = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/generations')
      const data = await res.json()
      if (data.success) {
        setGenerations(data.data.generations || [])
      }
    } catch (error) {
      console.error('Failed to fetch generations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGeneration = async (id: string) => {
    if (!confirm('Are you sure you want to delete this generation?')) return
    
    setActionLoading(id)
    try {
      const res = await fetch(`/api/admin/generations/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setGenerations(generations.filter(g => g.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete generation:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredGenerations = generations.filter(gen => {
    const matchesSearch = gen.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gen.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || gen.type === filterType
    const matchesStatus = filterStatus === 'all' || gen.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const stats = {
    total: generations.length,
    images: generations.filter(g => g.type === 'image').length,
    videos: generations.filter(g => g.type === 'video').length,
    completed: generations.filter(g => g.status === 'completed').length,
    failed: generations.filter(g => g.status === 'failed').length,
    totalCredits: generations.reduce((sum, g) => sum + g.credits_used, 0),
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
              <ImageIcon className="h-8 w-8 text-purple-400" />
              Generations
            </h1>
            <p className="text-gray-400 mt-1">Monitor all AI generations</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchGenerations}
            variant="outline"
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: ImageIcon, color: 'purple' },
          { label: 'Images', value: stats.images, icon: ImageIcon, color: 'blue' },
          { label: 'Videos', value: stats.videos, icon: VideoIcon, color: 'pink' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'green' },
          { label: 'Failed', value: stats.failed, icon: XCircle, color: 'red' },
          { label: 'Credits Used', value: stats.totalCredits, icon: Clock, color: 'yellow' },
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
                placeholder="Search by prompt or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'image', 'video'].map((type) => (
                <Button
                  key={type}
                  onClick={() => setFilterType(type)}
                  variant={filterType === type ? 'default' : 'outline'}
                  className={filterType === type ? 'bg-purple-600' : ''}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
              {['all', 'completed', 'failed'].map((status) => (
                <Button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  className={filterStatus === status ? 'bg-pink-600' : ''}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* Generations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGenerations.map((gen, index) => (
          <motion.div
            key={gen.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <SpotlightCard className="p-4 h-full">
              <div className="space-y-3">
                {/* Preview */}
                {gen.result_url && gen.status === 'completed' ? (
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                    {gen.type === 'image' ? (
                      <Image
                        src={gen.result_url}
                        alt={gen.prompt || 'AI generated image'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <video
                        src={gen.result_url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        aria-label={gen.prompt || 'AI generated video'}
                      />
                    )}
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg bg-white/5 flex items-center justify-center">
                    {gen.type === 'image' ? (
                      <ImageIcon className="h-12 w-12 text-gray-600" />
                    ) : (
                      <VideoIcon className="h-12 w-12 text-gray-600" />
                    )}
                  </div>
                )}

                {/* Info */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      className={
                        gen.type === 'image'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-pink-500/20 text-pink-300'
                      }
                    >
                      {gen.type.toUpperCase()}
                    </Badge>
                    <Badge
                      className={
                        gen.status === 'completed'
                          ? 'bg-green-500/20 text-green-300'
                          : gen.status === 'failed'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }
                    >
                      {gen.status}
                    </Badge>
                  </div>
                  <p className="text-white text-sm font-medium line-clamp-2 mb-2">
                    {gen.prompt}
                  </p>
                  <p className="text-gray-400 text-xs mb-1">
                    By: {gen.user_name || gen.user_email}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(gen.created_at).toLocaleString()}
                  </p>
                  <p className="text-purple-400 text-xs mt-2">
                    {gen.credits_used} credits
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {gen.result_url && (
                    <a href={gen.result_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </a>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-400 hover:bg-red-500/20"
                    disabled={actionLoading === gen.id}
                    onClick={() => handleDeleteGeneration(gen.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      {filteredGenerations.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No generations found</p>
        </div>
      )}
    </div>
  )
}
