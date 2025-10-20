import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  User, 
  CreditCard, 
  Settings, 
  Shield, 
  Download,
  Zap,
  Crown,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { LoadingSpinner } from '@/components/pages/shared/LoadingSpinner'

export function AccountPage() {
  const { user, refreshUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [message, setMessage] = useState('')
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
    }
  }, [user])

  const handleProfileUpdate = async () => {
    if (!formData.name.trim()) {
      setMessage('Name is required')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // In a real app, you'd have an API endpoint for profile updates
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setMessage('Profile updated successfully!')
      await refreshUser()
    } catch {
      setMessage('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage('All password fields are required')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // In a real app, you'd call your password change API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setMessage('Password changed successfully!')
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch {
      setMessage('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <LoadingSpinner message="Loading account..." />
  }

  const planDetails = {
    free: {
      name: 'Free',
      icon: Shield,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      features: ['10 credits/month', 'Basic tools', 'Community support']
    },
    pro: {
      name: 'Pro',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      features: ['300 credits/month', 'All tools', 'Priority support']
    },
    business: {
      name: 'Business',
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      features: ['1000 credits/month', 'Team features', 'API access']
    }
  }

  const currentPlan = planDetails[user.plan as keyof typeof planDetails] || planDetails.free
  const PlanIcon = currentPlan.icon

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Account Settings
        </h1>
        <p className="text-gray-300">
          Manage your profile, billing, and preferences
        </p>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.includes('success') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          {message.includes('success') ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.includes('success') ? 'text-green-700' : 'text-red-700'}>
            {message}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/5">
          <TabsTrigger value="profile" className="flex items-center space-x-2 data-[state=active]:bg-purple-600">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center space-x-2 data-[state=active]:bg-purple-600">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2 data-[state=active]:bg-purple-600">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center space-x-2 data-[state=active]:bg-purple-600">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
              <CardDescription className="text-gray-300">
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                <Button onClick={handleProfileUpdate} disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <div className="space-y-6">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  Your subscription details and usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${currentPlan.bgColor} flex items-center justify-center`}>
                      <PlanIcon className={`w-6 h-6 ${currentPlan.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{currentPlan.name} Plan</h3>
                      <p className="text-gray-600">{user.credits} credits remaining</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={currentPlan.bgColor}>
                    Active
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline">
                    Upgrade Plan
                  </Button>
                  <Button variant="ghost">
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">Images Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">3</div>
                    <div className="text-sm text-gray-600">Videos Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">48</div>
                    <div className="text-sm text-gray-600">Credits Used</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">7</div>
                    <div className="text-sm text-gray-600">Days Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">
                    Password must be at least 6 characters long
                  </p>
                </div>
                <Button onClick={handlePasswordChange} disabled={loading}>
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Manage your API keys and integrations (Business plan required)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.plan !== 'business' ? (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    API access is available with the Business plan. 
                    <Button variant="link" className="p-0 h-auto text-blue-700 underline ml-1">
                      Upgrade now
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        id="api-key"
                        type={showApiKey ? 'text' : 'password'}
                        value="px_live_1234567890abcdef..."
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">API Usage</h4>
                    <div className="text-sm text-gray-600">
                      <p>• Requests this month: 145</p>
                      <p>• Rate limit: 100 requests/minute</p>
                      <p>• Last used: 2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4 border-t">
                    <Button variant="outline">
                      Regenerate Key
                    </Button>
                    <Button variant="ghost">
                      View Documentation
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
