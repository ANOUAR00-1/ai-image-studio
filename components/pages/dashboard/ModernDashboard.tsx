"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "motion/react"
import { useRouter } from "next/navigation"
import { 
  ImageIcon, 
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  Plus,
  TrendingUp,
  Star,
  Loader2
} from "lucide-react"
import SpotlightCard from "@/components/ui/SpotlightCard"
import { useAuthStore } from "@/store/auth"
import { hasUnlimitedCredits } from "@/lib/utils/credits"
import Image from "next/image"
import { toast } from "sonner"

interface DashboardStats {
  totalGenerations: number
  creditsUsed: number
  recentActivity: number
}

interface RecentGeneration {
  id: string
  type: string
  prompt: string
  url: string
  created_at: string
  credits_used: number
}

export function ModernDashboard() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentGenerations, setRecentGenerations] = useState<RecentGeneration[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddToExamplesModal, setShowAddToExamplesModal] = useState(false)
  const [selectedGeneration, setSelectedGeneration] = useState<RecentGeneration | null>(null)
  const [exampleTitle, setExampleTitle] = useState('')
  const [exampleCategory, setExampleCategory] = useState('portraits')
  const [addingToExamples, setAddingToExamples] = useState(false)
  
  // Check if user is admin with unlimited credits
  const isUnlimited = hasUnlimitedCredits(user)
  const userCredits = user?.credits ?? 0
  
  useEffect(() => {
    if (user) {
      fetchRealData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchRealData = async () => {
    try {
      setLoading(true)

      // Fetch REAL stats from API
      const statsResponse = await fetch('/api/user/stats', {
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`
        }
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        const data = statsData.data || {}
        
        setStats({
          totalGenerations: (data.imagesGenerated || 0) + (data.videosGenerated || 0),
          creditsUsed: data.creditsUsed || 0,
          recentActivity: data.daysActive || 0
        })
      }

      // Fetch REAL recent generations
      const generationsResponse = await fetch('/api/user/generations?limit=6', {
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`
        }
      })

      if (generationsResponse.ok) {
        const generationsData = await generationsResponse.json()
        setRecentGenerations(generationsData.data?.generations || [])
      }

    } catch (error) {
      console.error('Error fetching real data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToExamples = async () => {
    if (!exampleTitle.trim()) {
      toast.error('Please enter a title for this example')
      return
    }

    if (!selectedGeneration) return

    setAddingToExamples(true)
    try {
      // PRODUCTION-SECURE: No localStorage tokens - use httpOnly cookies only
      const response = await fetch('/api/admin/add-to-examples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send httpOnly cookies automatically
        body: JSON.stringify({
          title: exampleTitle,
          category: exampleCategory,
          prompt: selectedGeneration.prompt,
          image_url: selectedGeneration.url,
          model: 'flux',
          credits_used: selectedGeneration.credits_used
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('+ Added to Examples showcase!')
        setShowAddToExamplesModal(false)
        setExampleTitle('')
        setExampleCategory('portraits')
        setSelectedGeneration(null)
      } else {
        toast.error(data.error || 'Failed to add to examples')
      }
    } catch (error) {
      console.error('Add to examples error:', error)
      toast.error('Failed to add to examples')
    } finally {
      setAddingToExamples(false)
    }
  }
  
  // Display values
  const displayCredits = isUnlimited ? 999999 : userCredits
  const totalCredits = isUnlimited ? 999999 : 10
  const usedCredits = stats?.creditsUsed || 0
  const remainingCredits = displayCredits - usedCredits
  
  const dashboardStats = [
    {
      title: "Total Generations",
      value: loading ? "..." : (stats?.totalGenerations || 0).toString(),
      subtitle: "All time",
      icon: Sparkles,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400"
    },
    {
      title: "Credits Used",
      value: loading ? "..." : usedCredits.toString(),
      subtitle: isUnlimited ? "∞ Unlimited" : `${Math.max(0, remainingCredits)} remaining`,
      icon: Zap,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400"
    },
    {
      title: "Recent Activity",
      value: loading ? "..." : (stats?.recentActivity || 0).toString(),
      subtitle: "Days active this month",
      icon: Clock,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400"
    }
  ]
  
  const quickActions = [
    {
      title: "Generate Image",
      description: "Create images from text prompts",
      credits: "2 credits",
      icon: ImageIcon,
      gradient: "from-blue-500 to-cyan-500",
      route: "/image-tools"
    },
    // VIDEO COMMENTED OUT
    // {
    //   title: "Create Video",
    //   description: "Generate videos from text or images",
    //   credits: "10 credits",
    //   icon: Video,
    //   gradient: "from-purple-500 to-pink-500",
    //   route: "/video-tools"
    // },
    {
      title: "Edit Images",
      description: "Remove backgrounds, enhance quality",
      credits: "2 credits",
      icon: Sparkles,
      gradient: "from-green-500 to-emerald-500",
      route: "/image-tools"
    },
    {
      title: "View Examples",
      description: "Get inspired by AI creations",
      credits: "Free",
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500",
      route: "/examples"
    }
  ]

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Stats Grid - REAL DATA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SpotlightCard className="p-6" spotlightColor="rgba(168, 85, 247, 0.1)">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                      <h3 className="text-4xl font-black text-white mb-1">{stat.value}</h3>
                      <p className="text-xs text-gray-500">{stat.subtitle}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                      <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            )
          })}
        </div>

        {/* Credits Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SpotlightCard className="p-6" spotlightColor="rgba(168, 85, 247, 0.12)">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Credits Balance</h3>
                <p className="text-sm text-gray-400">
                  {isUnlimited ? (
                    <span className="text-yellow-400 font-semibold">∞ Unlimited Credits</span>
                  ) : (
                    `${Math.max(0, remainingCredits)} / ${totalCredits} credits remaining`
                  )}
                </p>
              </div>
              <Badge className={isUnlimited 
                ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" 
                : "bg-purple-500/20 text-purple-300 border-purple-500/30"
              }>
                {user?.is_admin ? "👑 Admin" : (user?.plan?.toUpperCase() || "FREE")}
              </Badge>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 mb-4">
              <div 
                className={isUnlimited 
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 h-full rounded-full transition-all animate-pulse" 
                  : "bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all"
                }
                style={{ width: isUnlimited ? '100%' : `${Math.max(0, (remainingCredits / totalCredits) * 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {isUnlimited ? "Unlimited generations" : "Credits reset monthly"}
              </p>
              {!isUnlimited && (
                <Button 
                  onClick={() => router.push('/pricing')}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                >
                  Upgrade Plan
                </Button>
              )}
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <div key={index} onClick={() => router.push(action.route)}>
                  <SpotlightCard
                    className="p-6 hover:border-white/20 transition-all cursor-pointer group"
                    spotlightColor="rgba(168, 85, 247, 0.1)"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-semibold mb-1 group-hover:text-purple-300 transition-colors">{action.title}</h4>
                    <p className="text-sm text-gray-400 mb-3">{action.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{action.credits}</span>
                      <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </SpotlightCard>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Generations - REAL DATA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Generations</h3>
            {recentGenerations.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-purple-400 hover:text-purple-300"
                onClick={() => router.push('/history')}
              >
                View All →
              </Button>
            )}
          </div>
          
          {loading ? (
            <SpotlightCard className="p-12 text-center" spotlightColor="rgba(168, 85, 247, 0.1)">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your generations...</p>
            </SpotlightCard>
          ) : recentGenerations.length === 0 ? (
            <SpotlightCard className="p-12 text-center" spotlightColor="rgba(168, 85, 247, 0.1)">
              <div className="w-16 h-16 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-gray-500" />
              </div>
              <h4 className="text-white font-semibold mb-2">No generations yet</h4>
              <p className="text-sm text-gray-400 mb-6">Start creating your first AI-generated content</p>
              <Button 
                onClick={() => router.push('/image-tools')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              >
                Create Your First Image
              </Button>
            </SpotlightCard>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recentGenerations.filter(gen => gen.url && gen.url.trim() !== '').map((generation) => (
                <SpotlightCard 
                  key={generation.id} 
                  className="p-0 overflow-hidden cursor-pointer group hover:border-white/20 transition-all"
                  spotlightColor="rgba(168, 85, 247, 0.1)"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={generation.url}
                      alt={generation.prompt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-xs line-clamp-2">{generation.prompt}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                            {generation.type}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {generation.credits_used} credits
                          </span>
                        </div>
                      </div>
                      {user?.is_admin && generation.type === 'image' && (
                        <div className="absolute top-2 right-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedGeneration(generation)
                              setShowAddToExamplesModal(true)
                            }}
                            className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 hover:from-yellow-600 hover:to-orange-600 text-white p-2 h-8 w-8"
                          >
                            <Star className="h-4 w-4 fill-white" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Add to Examples Modal (Admin Only) */}
      <Dialog open={showAddToExamplesModal} onOpenChange={setShowAddToExamplesModal}>
        <DialogContent className="max-w-md bg-gradient-to-br from-[#1a1a3f] to-[#0a0a1f] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              Add to Examples Showcase
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              This image will be featured in the /examples page for everyone to see.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="example-title" className="text-gray-300">
                Title *
              </Label>
              <Input
                id="example-title"
                placeholder="e.g., Stunning Mountain Sunset"
                value={exampleTitle}
                onChange={(e) => setExampleTitle(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="example-category" className="text-gray-300">
                Category *
              </Label>
              <Select value={exampleCategory} onValueChange={setExampleCategory}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a3f] border-white/10 text-white">
                  <SelectItem value="portraits">Portraits</SelectItem>
                  <SelectItem value="landscapes">Landscapes</SelectItem>
                  <SelectItem value="abstract">Abstract Art</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedGeneration && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-300">
                  <strong>Prompt:</strong> {selectedGeneration.prompt}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddToExamplesModal(false)
                  setSelectedGeneration(null)
                }}
                className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
                disabled={addingToExamples}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddToExamples}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                disabled={addingToExamples || !exampleTitle.trim()}
              >
                {addingToExamples ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    Add to Examples
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
