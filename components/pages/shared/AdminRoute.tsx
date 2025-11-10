"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import { Shield, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AdminRouteProps {
  children: React.ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const router = useRouter()
  const { user, isLoggedIn, loading, initialize } = useAuthStore()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkComplete, setCheckComplete] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Wait for auth to fully load
      if (loading) return

      // Not logged in - redirect to home
      if (!isLoggedIn || !user) {
        router.push('/')
        return
      }

      // Check if user is admin
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${user.accessToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const adminStatus = data.user?.is_admin === true

          if (adminStatus) {
            setIsAdmin(true)
          } else {
            // Not admin - show access denied
            setIsAdmin(false)
          }
        } else {
          // Invalid session - redirect to home
          router.push('/')
        }
      } catch (error) {
        console.error('Admin check error:', error)
        // Don't redirect on error - might be temporary network issue
        // Just keep showing loading state
      } finally {
        // Mark check as complete
        setCheckComplete(true)
      }
    }

    checkAdminStatus()
  }, [user, isLoggedIn, loading, router])

  // Show loading state during auth check or before check completes
  if (loading || !checkComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0f2e] to-[#0a0118] flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-xl">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Show access denied if not admin (only after check completes)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0f2e] to-[#0a0118] flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Access Denied
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            You don&apos;t have permission to access the admin dashboard.
            This area is restricted to administrators only.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // User is admin - show protected content
  return <>{children}</>
}
