'use client'

import { useState, useEffect } from 'react'
import { Download, Trash2, ExternalLink, Clock, Zap } from 'lucide-react'
import Image from 'next/image'

interface Generation {
  id: string
  url: string
  prompt: string
  model: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  credits_used: number
  created_at: string
}

export default function ImageGallery() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<Generation | null>(null)

  useEffect(() => {
    fetchGenerations()
  }, [])

  const fetchGenerations = async () => {
    try {
      const response = await fetch('/api/generations/history')
      const data = await response.json()
      
      if (data.success) {
        setGenerations(data.data.generations)
      }
    } catch (error) {
      console.error('Failed to fetch generations:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = async (url: string, prompt: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${prompt.slice(0, 50)}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download image')
    }
  }

  const deleteGeneration = async (id: string) => {
    if (!confirm('Delete this generation?')) return

    try {
      const response = await fetch(`/api/generations/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setGenerations(generations.filter(g => g.id !== id))
        setSelectedImage(null)
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const openInNewTab = (url: string) => {
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (generations.length === 0) {
    return (
      <div className="text-center py-12">
        <Zap className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No generations yet
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Start creating amazing AI images!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {generations.map((gen) => (
          <div
            key={gen.id}
            className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer"
            onClick={() => setSelectedImage(gen)}
          >
            {/* Image */}
            <div className="aspect-square relative">
              {gen.status === 'completed' && gen.url ? (
                <Image
                  src={gen.url}
                  alt={gen.prompt}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-gray-400 animate-pulse" />
                </div>
              )}

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadImage(gen.url, gen.prompt)
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                  >
                    <Download className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openInNewTab(gen.url)
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                  >
                    <ExternalLink className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteGeneration(gen.id)
                    }}
                    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
                  >
                    <Trash2 className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                {gen.prompt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
                  {gen.model}
                </span>
                <span>{gen.credits_used} credits</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <Image
                src={selectedImage.url}
                alt={selectedImage.prompt}
                width={1024}
                height={1024}
                className="w-full h-auto rounded-lg"
              />
              
              {/* Actions */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => downloadImage(selectedImage.url, selectedImage.prompt)}
                  className="p-3 bg-white rounded-full hover:bg-gray-100 transition"
                >
                  <Download className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => deleteGeneration(selectedImage.id)}
                  className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition"
                >
                  <Trash2 className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Info */}
              <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Prompt</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {selectedImage.prompt}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Model:</span>
                    <span className="ml-2 font-medium">{selectedImage.model}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Credits:</span>
                    <span className="ml-2 font-medium">{selectedImage.credits_used}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2 font-medium">
                      {new Date(selectedImage.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className="ml-2 font-medium capitalize">{selectedImage.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
