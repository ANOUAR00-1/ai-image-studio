"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { 
  History as HistoryIcon,
  ImageIcon,
  Video,
  Download,
  Search,
  Calendar,
  Zap,
  Filter
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import Image from 'next/image'
import SpotlightCard from '@/components/ui/SpotlightCard'
import { BackButton } from '@/components/BackButton'

interface Generation {
  id: string
  type: string
  prompt: string
  url: string
  created_at: string
  credits_used: number
  model: string
}

export function HistoryPage() {
  const { user } = useAuthStore()
  const [generations, setGenerations] = useState<Generation[]>([])
  const [filteredGenerations, setFilteredGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all')

  useEffect(() => {
    if (user) {
      fetchGenerations()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    filterGenerations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filterType, generations])

  const fetchGenerations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/generations?limit=50', {
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setGenerations(data.data?.generations || [])
      }
    } catch (error) {
      console.error('Failed to fetch generations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterGenerations = () => {
    let filtered = [...generations]

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(gen => gen.type === filterType)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(gen => 
        gen.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gen.model.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredGenerations(filtered)
  }

  const handleDownload = async (generation: Generation) => {
    try {
      const response = await fetch(generation.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `pixfusion-${generation.type}-${generation.id}.${generation.type === 'video' ? 'mp4' : 'png'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalCreditsUsed = generations.reduce((sum, gen) => sum + gen.credits_used, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back Button */}
      <div className="mb-4">
        <BackButton fallbackUrl="/" className="text-gray-400 hover:text-white" />
      </div>
      
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <HistoryIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">Generation History</h1>
            <p className="text-gray-400">View and manage all your AI creations</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <SpotlightCard className="p-4" spotlightColor="rgba(168, 85, 247, 0.1)">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Generations</p>
                <p className="text-2xl font-bold text-white">{generations.length}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-purple-400" />
            </div>
          </SpotlightCard>
          
          <SpotlightCard className="p-4" spotlightColor="rgba(168, 85, 247, 0.1)">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Credits Used</p>
                <p className="text-2xl font-bold text-white">{totalCreditsUsed}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
          </SpotlightCard>
          
          <SpotlightCard className="p-4" spotlightColor="rgba(168, 85, 247, 0.1)">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-white">
                  {generations.filter(g => {
                    const date = new Date(g.created_at)
                    const now = new Date()
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-400" />
            </div>
          </SpotlightCard>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by prompt or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
              className={filterType === 'all' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }
            >
              <Filter className="w-4 h-4 mr-2" />
              All
            </Button>
            <Button
              variant={filterType === 'image' ? 'default' : 'outline'}
              onClick={() => setFilterType('image')}
              className={filterType === 'image' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Images
            </Button>
            <Button
              variant={filterType === 'video' ? 'default' : 'outline'}
              onClick={() => setFilterType('video')}
              className={filterType === 'video' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }
            >
              <Video className="w-4 h-4 mr-2" />
              Videos
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Generations Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your generations...</p>
          </div>
        </div>
      ) : filteredGenerations.length === 0 ? (
        <SpotlightCard className="p-12 text-center" spotlightColor="rgba(168, 85, 247, 0.1)">
          <HistoryIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            {searchQuery || filterType !== 'all' ? 'No results found' : 'No generations yet'}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchQuery || filterType !== 'all' 
              ? 'Try adjusting your filters or search query' 
              : 'Start creating your first AI-generated content'
            }
          </p>
          {!searchQuery && filterType === 'all' && (
            <Button 
              onClick={() => window.location.href = '/image-tools'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Create Your First Image
            </Button>
          )}
        </SpotlightCard>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredGenerations.map((generation, index) => (
            <motion.div
              key={generation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SpotlightCard 
                className="overflow-hidden group cursor-pointer hover:border-white/20 transition-all"
                spotlightColor="rgba(168, 85, 247, 0.1)"
              >
                {/* Image/Video */}
                <div className="relative aspect-square bg-white/5">
                  {generation.type === 'image' ? (
                    <Image
                      src={generation.url}
                      alt={generation.prompt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <video
                      src={generation.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleDownload(generation)}
                          className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <p className="text-white text-sm line-clamp-2 font-medium">
                    {generation.prompt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <Badge className={generation.type === 'image' 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'bg-blue-500/20 text-blue-300'
                    }>
                      {generation.type === 'image' ? <ImageIcon className="w-3 h-3 mr-1" /> : <Video className="w-3 h-3 mr-1" />}
                      {generation.type}
                    </Badge>
                    <span className="text-gray-400">{generation.credits_used} credits</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{generation.model}</span>
                    <span>{formatDate(generation.created_at)}</span>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
