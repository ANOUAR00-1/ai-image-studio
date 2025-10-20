'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your email...')
  const router = useRouter()
  const { login } = useAuthStore()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        console.log('Auth callback:', { type, hasAccessToken: !!accessToken })

        if (type === 'signup' && accessToken && refreshToken) {
          // Set the session
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            throw sessionError
          }

          if (!sessionData.user) {
            throw new Error('No user data received')
          }

          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionData.user.id)
            .single()

          // Save to localStorage
          localStorage.setItem('access_token', accessToken)
          localStorage.setItem('supabase_session', JSON.stringify(sessionData.session))

          // Login to store
          login({
            id: sessionData.user.id,
            email: sessionData.user.email!,
            name: profile?.name || sessionData.user.user_metadata?.name,
            plan: profile?.plan || 'free',
            credits: profile?.credits || 10,
            accessToken: accessToken,
          })

          setStatus('success')
          setMessage('Email verified successfully! Redirecting to dashboard...')

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } else {
          throw new Error('Invalid callback parameters')
        }
      } catch (error) {
        console.error('Callback error:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Failed to verify email')

        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push('/')
        }, 3000)
      }
    }

    handleCallback()
  }, [router, login])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0a0a1f]">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gradient-to-br from-[#0f0520]/80 via-[#1a0b2e]/80 to-[#0a0a1f]/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl shadow-purple-500/20">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              {status === 'loading' && (
                <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="w-16 h-16 text-green-500" />
              )}
              {status === 'error' && (
                <XCircle className="w-16 h-16 text-red-500" />
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white">
              {status === 'loading' && 'Verifying Email'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </h1>

            {/* Message */}
            <p className="text-gray-300">{message}</p>

            {/* Progress indicator */}
            {status === 'loading' && (
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full animate-pulse" />
              </div>
            )}

            {/* Action button */}
            {status === 'error' && (
              <button
                onClick={() => router.push('/')}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Go to Homepage
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
