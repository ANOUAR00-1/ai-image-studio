'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-4">Oops! Something went wrong</h1>
          
          <p className="text-gray-300 mb-8">
            We encountered an unexpected error. Don&apos;t worry, our team has been notified and we&apos;re working on it!
          </p>

          {error.message && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-300 font-mono">{error.message}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Link href="/">
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 w-full">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
