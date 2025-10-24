"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  User, 
  CreditCard, 
  Shield, 
  Download,
  Zap,
  Crown,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  Video,
  Sparkles
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface UsageStats {
  imagesGenerated: number
  videosGenerated: number
  creditsUsed: number
  daysActive: number
}

interface Invoice {
  id: string
  amount: number
  status: string
  date: string
  plan: string
}

export function ModernAccountPage() {
  const { user, refreshUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }))
      fetchRealData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchRealData = async () => {
    try {
      setLoadingStats(true)
      
      // Fetch REAL usage stats from API
      const statsResponse = await fetch('/api/user/stats', {
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`
        }
      })
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setUsageStats(statsData.data || {
          imagesGenerated: 0,
          videosGenerated: 0,
          creditsUsed: 0,
          daysActive: 0
        })
      }

      // Fetch REAL invoices from API
      const invoicesResponse = await fetch('/api/billing/invoices', {
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`
        }
      })
      
      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json()
        setInvoices(invoicesData.data?.invoices || [])
      }
    } catch (error) {
      console.error('Failed to fetch real data:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const handleProfileUpdate = async () => {
    if (!formData.name.trim()) {
      setMessage('Name is required')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`
        },
        body: JSON.stringify({
          name: formData.name
        })
      })

      if (response.ok) {
        setMessage('Profile updated successfully!')
        await refreshUser()
      } else {
        setMessage('Failed to update profile')
      }
    } catch {
      setMessage('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const getPlanDetails = () => {
    const plan = user?.plan || 'free'
    
    interface PlanDetails {
      name: string
      icon: React.ComponentType<{ className?: string }>
      color: string
      bgColor: string
      badgeColor: string
      features: string[]
    }
    
    const plans: Record<string, PlanDetails> = {
      free: {
        name: 'Free',
        icon: Sparkles,
        color: 'text-gray-400',
        bgColor: 'bg-gray-100',
        badgeColor: 'bg-gray-100 text-gray-700',
        features: ['10 credits/month', 'Basic tools', 'Community support']
      },
      starter: {
        name: 'Starter',
        icon: Zap,
        color: 'text-blue-400',
        bgColor: 'bg-blue-50',
        badgeColor: 'bg-blue-100 text-blue-700',
        features: ['100 credits/month', 'All tools', 'Email support']
      },
      pro: {
        name: 'Pro',
        icon: Crown,
        color: 'text-purple-400',
        bgColor: 'bg-purple-50',
        badgeColor: 'bg-purple-100 text-purple-700',
        features: ['500 credits/month', 'Priority processing', 'Priority support']
      },
      business: {
        name: 'Business',
        icon: Crown,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-50',
        badgeColor: 'bg-yellow-100 text-yellow-700',
        features: ['Unlimited credits', 'API access', 'Dedicated support']
      }
    }

    return plans[plan] || plans.free
  }

  const currentPlan = getPlanDetails()
  const PlanIcon = currentPlan.icon

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-white mb-2">Account Settings</h1>
        <p className="text-gray-400">Manage your profile, billing, and preferences</p>
      </motion.div>

      {/* Message Alert */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Alert className={message.includes('success') ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}>
            <AlertDescription className={message.includes('success') ? 'text-green-400' : 'text-red-400'}>
              {message}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white mt-2"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      disabled
                      className="bg-white/5 border-white/10 text-gray-400 mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <Button 
                  onClick={handleProfileUpdate} 
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <div className="space-y-6">
            {/* Current Plan Card */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl ${currentPlan.bgColor} flex items-center justify-center`}>
                      <PlanIcon className={`w-8 h-8 ${currentPlan.color}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{currentPlan.name} Plan</h3>
                      <p className="text-gray-400">{user?.credits || 0} credits remaining</p>
                    </div>
                  </div>
                  <Badge className={currentPlan.badgeColor}>
                    Active
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {currentPlan.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <Link href="/pricing">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Usage Stats - REAL DATA */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                  Usage This Month
                </h3>
                
                {loadingStats ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading stats...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <ImageIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-blue-400">{usageStats?.imagesGenerated || 0}</div>
                      <div className="text-sm text-gray-400 mt-1">Images Generated</div>
                    </div>
                    <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                      <Video className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-purple-400">{usageStats?.videosGenerated || 0}</div>
                      <div className="text-sm text-gray-400 mt-1">Videos Created</div>
                    </div>
                    <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                      <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-green-400">{usageStats?.creditsUsed || 0}</div>
                      <div className="text-sm text-gray-400 mt-1">Credits Used</div>
                    </div>
                    <div className="text-center p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                      <Calendar className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-orange-400">{usageStats?.daysActive || 0}</div>
                      <div className="text-sm text-gray-400 mt-1">Days Active</div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Invoices - REAL DATA */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                  Recent Invoices
                </h3>
                
                {invoices.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">No invoices yet</p>
                    <p className="text-sm text-gray-500 mt-1">Your invoices will appear here after your first payment</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{invoice.plan} Plan</p>
                            <p className="text-sm text-gray-400">{new Date(invoice.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-white font-bold">${invoice.amount.toFixed(2)}</p>
                            <Badge className={invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                              {invoice.status}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password" className="text-gray-300">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white mt-2"
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="new-password" className="text-gray-300">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white mt-2"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password" className="text-gray-300">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white mt-2"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <Alert className="bg-blue-500/10 border-blue-500/20">
                    <AlertCircle className="h-4 w-4 text-blue-400" />
                    <AlertDescription className="text-blue-300">
                      Password must be at least 6 characters long
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <Button 
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
