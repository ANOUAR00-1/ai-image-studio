'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Video as VideoIcon, Download, Trash2, Eye, Filter, Grid3x3, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SpotlightCard from '@/components/ui/SpotlightCard'
import Image from 'next/image'

interface Generation {
  id: string
  type: 'image' | 'video'
  model: string
  prompt: string
  result_url: string
  status: 'completed' | 'pending' | 'failed'
  credits_used: number
  created_at: string
}

export function UserGalleryPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchGenerations()
  }, [])

  const fetchGenerations = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      const response = await fetch('/api/generations/my-generations')
      if (response.ok) {
        const data = await response.json()
        setGenerations(data.generations || [])
      }
    } catch (error) {
      console.error('Failed to fetch generations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGenerations = generations.filter(gen => {
    if (filter === 'all') return true
    return gen.type === filter
  })

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this generation?')) return
    
    try {
      const response = await fetch(`/api/generations/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setGenerations(prev => prev.filter(gen => gen.id !== id))
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f] p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ImageIcon className="h-8 w-8 text-purple-400" />
            My Gallery
          </h1>
          <p className="text-gray-400 mt-1">
            {filteredGenerations.length} generation{filteredGenerations.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="flex gap-2">
            {(['all', 'image', 'video'] as const).map((type) => (
              <Button
                key={type}
                onClick={() => setFilter(type)}
                variant={filter === type ? 'default' : 'outline'}
                size="sm"
                className={
                  filter === type
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                    : 'border-white/20 text-white hover:bg-white/10'
                }
              >
                {type === 'all' ? <Filter className="h-4 w-4" /> : 
                 type === 'image' ? <ImageIcon className="h-4 w-4" /> : 
                 <VideoIcon className="h-4 w-4" />}
                <span className="ml-2 capitalize">{type}</span>
              </Button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex gap-1 border border-white/20 rounded-lg p-1">
            <Button
              onClick={() => setViewMode('grid')}
              variant="ghost"
              size="sm"
              className={viewMode === 'grid' ? 'bg-white/10' : ''}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant="ghost"
              size="sm"
              className={viewMode === 'list' ? 'bg-white/10' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading your generations...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredGenerations.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No generations yet</h3>
          <p className="text-gray-400 mb-6">Start creating amazing AI content!</p>
          <Button
            onClick={() => window.location.href = '/image-tools'}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Create Your First Image
          </Button>
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === 'grid' && filteredGenerations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGenerations.map((gen, index) => (
            <motion.div
              key={gen.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <SpotlightCard className="p-0 overflow-hidden group">
                {/* Image/Video Preview */}
                <div className="relative aspect-square bg-white/5">
                  {gen.type === 'image' ? (
                    <Image
                      src={gen.result_url}
                      alt={gen.prompt}
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
                      aria-label={gen.prompt}
                    />
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/20 hover:bg-white/30 text-white"
                      onClick={() => window.open(gen.result_url, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/20 hover:bg-white/30 text-white"
                      onClick={() => handleDownload(gen.result_url, `${gen.type}-${gen.id}.${gen.type === 'image' ? 'png' : 'mp4'}`)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300"
                      onClick={() => handleDelete(gen.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className={gen.type === 'image' ? 'bg-blue-500/20 text-blue-300' : 'bg-pink-500/20 text-pink-300'}>
                      {gen.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">{gen.credits_used} credits</span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">{gen.prompt}</p>
                  <p className="text-xs text-gray-500">{gen.model}</p>
                  <p className="text-xs text-gray-600">{new Date(gen.created_at).toLocaleDateString()}</p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && viewMode === 'list' && filteredGenerations.length > 0 && (
        <div className="space-y-4">
          {filteredGenerations.map((gen, index) => (
            <motion.div
              key={gen.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SpotlightCard className="p-4">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    {gen.type === 'image' ? (
                      <Image
                        src={gen.result_url}
                        alt={gen.prompt}
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
                        aria-label={gen.prompt}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={gen.type === 'image' ? 'bg-blue-500/20 text-blue-300' : 'bg-pink-500/20 text-pink-300'}>
                        {gen.type.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-500">{gen.model}</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">{new Date(gen.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-white font-medium mb-1 truncate">{gen.prompt}</p>
                    <p className="text-xs text-gray-500">{gen.credits_used} credits used</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                      onClick={() => window.open(gen.result_url, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                      onClick={() => handleDownload(gen.result_url, `${gen.type}-${gen.id}.${gen.type === 'image' ? 'png' : 'mp4'}`)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDelete(gen.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
