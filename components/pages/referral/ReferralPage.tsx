'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { 
  Users, 
  Gift, 
  Copy, 
  Twitter, 
  Facebook, 
  Linkedin,
  Mail,
  Link2,
  TrendingUp,
  Sparkles,
  Check
} from 'lucide-react'
import { motion } from 'framer-motion'

// Simple time ago formatter
function timeAgo(date: string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  }
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`
    }
  }
  return 'just now'
}

interface ReferralData {
  referralCode: string
  referralLink: string
  stats: {
    total_referrals: number
    total_credits_earned: number
    pending_referrals: number
  }
  referrals: Array<{
    id: string
    credits_awarded: number
    status: string
    created_at: string
    referred: {
      name: string
      email: string
      created_at: string
    }
  }>
  currentCredits: number
}

export function ReferralPage() {
  const router = useRouter()
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReferralData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/referral', {
        credentials: 'include'
      })

      if (response.status === 401) {
        // User not logged in - redirect to login
        toast.error('Please login to access referrals')
        setTimeout(() => router.push('/'), 2000)
        return
      }

      const responseData = await response.json()

      if (!response.ok) {
        console.error('API Error:', responseData)
        setError(responseData.error || 'Failed to load referral data')
        toast.error(responseData.error || 'Failed to load referral information')
        return
      }

      setData(responseData)
    } catch (err) {
      console.error('Referral fetch error:', err)
      setError('Network error - please try again')
      toast.error('Failed to load referral information')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Referral link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const shareToSocial = (platform: string) => {
    if (!data) return

    const text = `Join me on PixFusion AI and get 10 free credits! 🚀`
    const url = data.referralLink

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent('Join PixFusion AI')}&body=${encodeURIComponent(`${text}\n\n${url}`)}`
    }

    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0118] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!data && error) {
    return (
      <div className="min-h-screen bg-[#0a0118] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
          <Button onClick={fetchReferralData} className="bg-purple-600 hover:bg-purple-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0118] flex items-center justify-center">
        <div className="text-white">Initializing referral system...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0118] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <Gift className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Referral Program</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Invite Friends, Earn Credits
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Share your referral link and get <span className="text-purple-400 font-semibold">10 free credits</span> for each friend who signs up!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Total Referrals</p>
              <p className="text-3xl font-bold text-white">{data.stats.total_referrals}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-pink-900/20 to-pink-800/10 border-pink-500/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pink-500/20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-pink-400" />
                </div>
                <Gift className="w-5 h-5 text-pink-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Credits Earned</p>
              <p className="text-3xl font-bold text-white">{data.stats.total_credits_earned}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <Gift className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Current Credits</p>
              <p className="text-3xl font-bold text-white">{data.currentCredits}</p>
            </Card>
          </motion.div>
        </div>

        {/* Referral Link Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-[#1a0f2e] border-purple-500/20 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Link2 className="w-6 h-6 text-purple-400" />
              Your Referral Link
            </h2>
            
            <div className="flex gap-3 mb-6">
              <div className="flex-1 bg-[#0a0118] border border-purple-500/20 rounded-xl px-4 py-3 text-white font-mono text-sm overflow-x-auto">
                {data.referralLink}
              </div>
              <Button
                onClick={() => copyToClipboard(data.referralLink)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                onClick={() => shareToSocial('twitter')}
                className="bg-[#0a0118] border-purple-500/20 text-white hover:bg-purple-500/10"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => shareToSocial('facebook')}
                className="bg-[#0a0118] border-purple-500/20 text-white hover:bg-purple-500/10"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => shareToSocial('linkedin')}
                className="bg-[#0a0118] border-purple-500/20 text-white hover:bg-purple-500/10"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                onClick={() => shareToSocial('email')}
                className="bg-[#0a0118] border-purple-500/20 text-white hover:bg-purple-500/10"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Referrals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-[#1a0f2e] border-purple-500/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              Your Referrals ({data.referrals.length})
            </h2>

            {data.referrals.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No referrals yet</p>
                <p className="text-gray-500 text-sm mt-2">Share your link to start earning credits!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.referrals.map((referral, index) => (
                  <motion.div
                    key={referral.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-[#0a0118] border border-purple-500/10 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {referral.referred.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{referral.referred.name}</p>
                        <p className="text-gray-400 text-sm">{referral.referred.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full mb-1">
                        <Sparkles className="w-3 h-3 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">
                          +{referral.credits_awarded} credits
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs">
                        {timeAgo(referral.created_at)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Link2 className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">1. Share Your Link</h3>
                <p className="text-gray-400 text-sm">Copy your unique referral link and share it with friends</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">2. Friends Sign Up</h3>
                <p className="text-gray-400 text-sm">They create an account using your referral link</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">3. Earn Credits</h3>
                <p className="text-gray-400 text-sm">Get 10 free credits for each successful referral!</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
