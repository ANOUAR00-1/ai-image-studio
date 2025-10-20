'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email')
      return
    }

    setLoading(true)

    try {
      // TODO: Connect to your email service (Resend, SendGrid, etc.)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubscribed(true)
      toast.success('Thanks for subscribing! 🎉')
      setEmail('')
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 text-green-400"
      >
        <CheckCircle className="h-5 w-5" />
        <span className="font-semibold">Successfully subscribed!</span>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-purple-500"
          disabled={loading}
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Subscribing...
          </>
        ) : (
          'Subscribe'
        )}
      </Button>
    </form>
  )
}
