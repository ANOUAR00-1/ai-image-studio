'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Settings as SettingsIcon, Bell, Shield, User, Download, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { BackButton } from '@/components/BackButton'

export function Settings() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [generationComplete, setGenerationComplete] = useState(true)
  const [creditsLow, setCreditsLow] = useState(true)
  const [paymentUpdates, setPaymentUpdates] = useState(true)

  const handleSaveNotifications = async () => {
    setLoading(true)
    try {
      // TODO: Save to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Notification preferences saved!')
    } catch {
      toast.error('Failed to save preferences')
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    setLoading(true)
    try {
      // TODO: Export user data
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Your data has been exported!')
    } catch {
      toast.error('Failed to export data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This action cannot be undone.')) return
    
    setLoading(true)
    try {
      // TODO: Delete account
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Account deleted')
    } catch {
      toast.error('Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton fallbackUrl="/" className="text-gray-400 hover:text-white" />
        </div>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
            <SettingsIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Settings</h1>
            <p className="text-sm text-gray-400">Manage your account and preferences</p>
          </div>
        </motion.div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Name</Label>
                  <Input
                    id="name"
                    defaultValue={user?.name}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email}
                    className="bg-white/5 border-white/10 text-white"
                    disabled
                  />
                  <p className="text-xs text-gray-400">Email cannot be changed</p>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold">Email Notifications</h4>
                    <p className="text-sm text-gray-400">Receive notifications via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold">Push Notifications</h4>
                    <p className="text-sm text-gray-400">Receive notifications in-app</p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                <div className="border-t border-white/10 pt-6 space-y-4">
                  <h4 className="text-white font-semibold">Notify me about:</h4>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="generation" className="text-gray-300">Generation complete</Label>
                    <Switch id="generation" checked={generationComplete} onCheckedChange={setGenerationComplete} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="credits" className="text-gray-300">Low credits warning</Label>
                    <Switch id="credits" checked={creditsLow} onCheckedChange={setCreditsLow} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="payments" className="text-gray-300">Payment updates</Label>
                    <Switch id="payments" checked={paymentUpdates} onCheckedChange={setPaymentUpdates} />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} disabled={loading} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-400 mb-4">Add an extra layer of security to your account</p>
                  <Button variant="outline" className="bg-white/5 border-white/10 text-white">
                    Enable 2FA
                  </Button>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-white font-semibold mb-2">Change Password</h4>
                  <div className="space-y-3 max-w-md">
                    <Input type="password" placeholder="Current password" className="bg-white/5 border-white/10 text-white" />
                    <Input type="password" placeholder="New password" className="bg-white/5 border-white/10 text-white" />
                    <Input type="password" placeholder="Confirm new password" className="bg-white/5 border-white/10 text-white" />
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600">Update Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Privacy & Data</CardTitle>
                <CardDescription>Control your data and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Export Your Data</h4>
                  <p className="text-sm text-gray-400 mb-4">Download all your data in JSON format</p>
                  <Button onClick={handleExportData} disabled={loading} variant="outline" className="bg-white/5 border-white/10 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-red-400 font-semibold mb-2">Danger Zone</h4>
                  <p className="text-sm text-gray-400 mb-4">Permanently delete your account and all data</p>
                  <Button onClick={handleDeleteAccount} disabled={loading} variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
