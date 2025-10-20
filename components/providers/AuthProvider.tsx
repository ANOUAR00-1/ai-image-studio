"use client"

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    // Initialize auth state on app load
    initialize()
  }, [initialize])

  return <>{children}</>
}
