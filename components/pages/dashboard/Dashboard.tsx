"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "motion/react"
import { useRouter } from "next/navigation"
import { 
  ImageIcon, 
  Video, 
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  Plus
} from "lucide-react"

export function Dashboard() {
  const router = useRouter()
  
  const totalCredits = 10
  const usedCredits = 0
  const remainingCredits = totalCredits - usedCredits
  
  const stats = [
    {
      title: "Total Generations",
      value: "0",
      subtitle: "17% this week",
      icon: Sparkles,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400"
    },
    {
      title: "Credits Used",
      value: usedCredits.toString(),
      subtitle: "10 remaining",
      icon: Zap,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400"
    },
    {
      title: "Recent Activity",
      value: "0",
      subtitle: "Last 24 hours",
      icon: Clock,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400"
    }
  ]
  
  const quickActions = [
    {
      title: "Generate Image",
      description: "Create images from text prompts",
      credits: "5 credits",
      icon: ImageIcon,
      gradient: "from-blue-500 to-cyan-500",
      route: "/image-tools"
    },
    {
      title: "Create Video",
      description: "Generate videos from text or images",
      credits: "10 credits",
      icon: Video,
      gradient: "from-purple-500 to-pink-500",
      route: "/video-tools"
    },
    {
      title: "Edit Images",
      description: "Remove backgrounds, enhance quality",
      credits: "2 credits",
      icon: Sparkles,
      gradient: "from-green-500 to-emerald-500",
      route: "/image-tools"
    }
  ]

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/10">
                  <CardContent className="p-6">
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
                  </CardContent>
                </Card>
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
          <Card className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Credits Balance</h3>
                  <p className="text-sm text-gray-400">{remainingCredits} / {totalCredits} credits remaining</p>
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  Free Plan
                </Badge>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all" 
                  style={{ width: `${(remainingCredits / totalCredits) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Credits reset monthly</p>
                <Button 
                  onClick={() => router.push('/pricing')}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                >
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>
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
                <Card 
                  key={index}
                  className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                  onClick={() => router.push(action.route)}
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-semibold mb-1 group-hover:text-purple-300 transition-colors">{action.title}</h4>
                    <p className="text-sm text-gray-400 mb-3">{action.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{action.credits}</span>
                      <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Generations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Generations</h3>
            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
              View All →
            </Button>
          </div>
          <Card className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/10">
            <CardContent className="p-12 text-center">
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
