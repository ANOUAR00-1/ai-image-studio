'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkToken = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const token = hashParams.get('access_token')
        const type = hashParams.get('type')

        if (type === 'recovery' && token) {
          setIsValid(true)
          
          // Set the session
          const { error } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: hashParams.get('refresh_token') || '',
          })

          if (error) {
            console.error('Session error:', error)
            toast.error('Invalid or expired reset link')
            setIsValid(false)
            setTimeout(() => router.push('/'), 3000)
          }
        } else {
          toast.error('Invalid reset link')
          setIsValid(false)
          setTimeout(() => router.push('/'), 3000)
        }
      } catch (error) {
        console.error('Token check error:', error)
        setIsValid(false)
      }
    }

    checkToken()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      // Update password using Supabase client (session is already set)
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        toast.error(error.message || 'Failed to update password')
        return
      }

      toast.success('Password updated successfully!')
      
      // Clear form
      setPassword('')
      setConfirmPassword('')

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/')
        toast.info('Please login with your new password')
      }, 2000)
    } catch (error) {
      console.error('Password update error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0a0a1f]">
        <div className="max-w-md w-full mx-4">
          <div className="bg-gradient-to-br from-[#0f0520]/80 via-[#1a0b2e]/80 to-[#0a0a1f]/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl shadow-purple-500/20">
            <div className="text-center space-y-6">
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              <h1 className="text-2xl font-bold text-white">Invalid Reset Link</h1>
              <p className="text-gray-300">
                This password reset link is invalid or has expired.
              </p>
              <p className="text-sm text-gray-400">
                Redirecting to homepage...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0a0a1f] py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-[#0f0520]/80 via-[#1a0b2e]/80 to-[#0a0a1f]/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl shadow-purple-500/20">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/50">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Reset Password</h1>
            <p className="text-sm text-gray-300">
              Enter your new password below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm font-semibold">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500/50 h-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-purple-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white text-sm font-semibold">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500/50 h-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-purple-400 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <p className="text-xs text-gray-300 mb-2">Password must:</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li className={password.length >= 6 ? 'text-green-400' : ''}>
                  • At least 6 characters
                </li>
                <li className={password === confirmPassword && password ? 'text-green-400' : ''}>
                  • Passwords match
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full h-11 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 text-white font-semibold border-0 shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>Updating Password...</>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Reset Password
                </>
              )}
            </Button>

            {/* Back to Login */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
