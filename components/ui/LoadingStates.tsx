'use client'

import { Loader2, Sparkles } from 'lucide-react'

export function GeneratingLoader({ message = 'Generating your image...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
        </div>
        <Loader2 className="h-16 w-16 text-purple-600 animate-spin" />
      </div>
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
        {message}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        This may take 5-30 seconds...
      </p>
    </div>
  )
}

export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

export function SpinnerOverlay({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-2xl max-w-sm mx-4">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
          {message && (
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 text-center">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  )
}

export function GenerationStatus({ 
  status 
}: { 
  status: 'pending' | 'processing' | 'completed' | 'failed' 
}) {
  const statusConfig = {
    pending: {
      color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      label: 'Pending',
      icon: '⏳',
    },
    processing: {
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      label: 'Processing',
      icon: '⚡',
    },
    completed: {
      color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      label: 'Completed',
      icon: '✅',
    },
    failed: {
      color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      label: 'Failed',
      icon: '❌',
    },
  }

  const config = statusConfig[status]

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  )
}
