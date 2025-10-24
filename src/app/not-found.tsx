"use client"

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f] flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Animation */}
          <div className="relative mb-8">
            <motion.div
              className="text-[150px] md:text-[200px] font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              404
            </motion.div>
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Sparkles className="w-16 h-16 text-purple-400 opacity-50" />
            </motion.div>
          </div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Page Not Found
            </h1>
            <p className="text-xl text-gray-400 max-w-md mx-auto">
              Oops! The page you&apos;re looking for seems to have vanished into the AI void.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => router.back()}
              className="bg-white/5 border border-white/10 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <Link href="/examples">
              <Button className="bg-white/5 border border-white/10 text-white hover:bg-white/10">
                <Search className="w-4 h-4 mr-2" />
                Browse Examples
              </Button>
            </Link>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <p className="text-sm text-gray-500 mb-4">Popular Pages:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/dashboard" className="text-sm text-purple-400 hover:text-purple-300">Dashboard</Link>
              <span className="text-gray-600">•</span>
              <Link href="/image-tools" className="text-sm text-purple-400 hover:text-purple-300">Image Tools</Link>
              <span className="text-gray-600">•</span>
              <Link href="/pricing" className="text-sm text-purple-400 hover:text-purple-300">Pricing</Link>
              <span className="text-gray-600">•</span>
              <Link href="/contact" className="text-sm text-purple-400 hover:text-purple-300">Contact</Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
