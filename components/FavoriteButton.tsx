'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface FavoriteButtonProps {
  generationId: string
  initialFavorited?: boolean
}

export function FavoriteButton({ generationId, initialFavorited = false }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)

  const toggleFavorite = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/favorites/${generationId}`, {
        method: favorited ? 'DELETE' : 'POST',
      })

      if (!response.ok) throw new Error('Failed to update favorite')

      setFavorited(!favorited)
      toast.success(favorited ? 'Removed from favorites' : 'Added to favorites')
    } catch {
      toast.error('Failed to update favorite')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-lg transition-all ${
        favorited
          ? 'bg-yellow-500/20 text-yellow-400'
          : 'bg-white/5 text-gray-400 hover:bg-white/10'
      }`}
    >
      <Star
        className={`h-5 w-5 ${favorited ? 'fill-current' : ''}`}
      />
    </motion.button>
  )
}
