import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import StarBorder from '@/components/ui/StarBorder'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Video, 
  Upload, 
  Download, 
  Sparkles, 
  Loader2,
  Film,
  Zap,
  Palette,
  AlertCircle,
  Clock,
  Check
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { api } from '@/utils/api'
import AIGenerationLoader from '@/components/pages/shared/AIGenerationLoader'

export function VideoTools() {
  const { user, refreshUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('text-to-video')
  const [prompt, setPrompt] = useState('')
  const [duration] = useState([5])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ 
    videoUrl?: string; 
    message?: string;
    id?: string;
    prompt?: string;
    creditsUsed?: number;
    remainingCredits?: number;
  } | null>(null)
  const [error, setError] = useState('')
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [showLoader] = useState(false)

  const tools = [
    {
      id: 'text-to-video',
      title: 'Text to Video',
      description: 'Generate videos from text descriptions',
      icon: Sparkles,
      credits: 10,
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 'image-to-video',
      title: 'Image to Video',
      description: 'Animate static images with AI',
      icon: Film,
      credits: 7,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'video-enhance',
      title: 'Enhance Video',
      description: 'Upscale and improve video quality',
      icon: Zap,
      credits: 8,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'video-style',
      title: 'Style Transfer',
      description: 'Apply artistic styles to videos',
      icon: Palette,
      credits: 12,
      color: 'from-pink-500 to-rose-600'
    }
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your video')
      return
    }

    const currentTool = tools.find(t => t.id === activeTab)
    if (!user || ((user.credits ?? 0) < (currentTool?.credits || 10) && user.credits !== -1 && !user.is_admin)) {
      // Show pricing modal instead of just error
      setShowPricingModal(true)
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await api.generateVideo(prompt, activeTab)
      
      if (!response.success || !response.data?.generation?.url) {
        throw new Error(response.error || 'Failed to generate video')
      }
      
      setResult({
        videoUrl: response.data.generation.url,
        id: response.data.generation.id,
        prompt: response.data.generation.prompt,
        creditsUsed: response.data.generation.creditsUsed,
        remainingCredits: response.data.remainingCredits
      })
      await refreshUser()
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to generate video')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const isImage = activeTab === 'image-to-video'
      const maxSize = isImage ? 10 * 1024 * 1024 : 100 * 1024 * 1024
      
      if (file.size > maxSize) {
        setError(`File size must be less than ${isImage ? '10MB' : '100MB'}`)
        return
      }

      if (isImage && !file.type.startsWith('image/')) {
        setError('Please upload a valid image file')
        return
      }

      if (!isImage && !file.type.startsWith('video/')) {
        setError('Please upload a valid video file')
        return
      }

      setError('')
      // File upload logic would go here
      console.log('File uploaded:', file.name)
    }
  }

  const handleDownload = async () => {
    if (!result?.videoUrl) return

    try {
      const response = await fetch(result.videoUrl)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `pixfusion-video-${result.id || Date.now()}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
      setError('Failed to download video. Please try right-clicking and "Save Video As..."')
    }
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  const currentTool = tools.find(t => t.id === activeTab)

  const pricingPlans = [
    {
      name: 'Free',
      price: 0,
      credits: 10,
      features: ['10 credits/month', 'Basic AI tools', 'Standard quality', 'Community support'],
      current: user?.plan === 'free',
      color: 'from-gray-500 to-gray-600'
    },
    {
      name: 'Pro',
      price: 19,
      credits: 300,
      features: ['300 credits/month', 'All AI tools', 'HD quality', 'Priority support', 'No watermarks'],
      popular: true,
      current: user?.plan === 'pro',
      color: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Business',
      price: 59,
      credits: 1000,
      features: ['1000 credits/month', 'All tools + API', '4K quality', 'Dedicated support', 'Team collaboration'],
      current: user?.plan === 'business',
      color: 'from-purple-500 to-pink-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0f2e] to-[#0a0118]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pricing Modal */}
        <Dialog open={showPricingModal} onOpenChange={setShowPricingModal}>
          <DialogContent className="max-w-5xl bg-gradient-to-br from-[#1a0f2e] to-[#0a0118] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Insufficient Credits
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-lg">
                You need {currentTool?.credits} credits to use {currentTool?.title}. You currently have {user?.credits || 0} credits.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {pricingPlans.map((plan) => (
                <motion.div
                  key={plan.name}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="relative"
                >
                  <Card className={`relative overflow-hidden border-2 ${
                    plan.popular 
                      ? 'border-purple-500/50 shadow-xl shadow-purple-500/20' 
                      : plan.current
                      ? 'border-green-500/50'
                      : 'border-white/10'
                  } bg-white/5 backdrop-blur-xl`}>
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 text-xs rounded-bl-lg">
                        MOST POPULAR
                      </div>
                    )}
                    {plan.current && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs rounded-bl-lg">
                        CURRENT PLAN
                      </div>
                    )}
                    
                    <CardHeader>
                      <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl text-white">${plan.price}</span>
                        <span className="text-gray-400">/month</span>
                      </div>
                      <CardDescription className="text-purple-300 mt-2">
                        {plan.credits} credits/month
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600'
                            : 'bg-white/10 hover:bg-white/20'
                        } text-white border-0`}
                        onClick={() => {
                          setShowPricingModal(false)
                        }}
                        disabled={plan.current}
                      >
                        {plan.current ? 'Current Plan' : 'Upgrade Now'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setShowPricingModal(false)}
              >
                Continue Browsing
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3"
          >
            AI Video Tools
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Create and edit videos with cutting-edge AI technology
          </motion.p>
        </div>

        {/* Credits Warning */}
        {user && (user.credits ?? 0) < 15 && user.credits !== -1 && !user.is_admin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert className="bg-yellow-500/10 border-yellow-500/20 backdrop-blur-xl">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-200">
                You have {user.credits} credits remaining. Video generation requires more credits than image generation.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tool Selector - Left Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-xl text-white mb-1">Select Tool</h2>
                <p className="text-sm text-gray-400">Choose an AI tool to create or edit videos</p>
              </div>

              <div className="space-y-3">
                {tools.map((tool, index) => {
                  const Icon = tool.icon
                  const canAfford = user ? (user.is_admin || user.credits === -1 || (user.credits ?? 0) >= tool.credits) : false
                  const isActive = activeTab === tool.id
                  
                  return (
                    <motion.button
                      key={tool.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      onClick={() => {
                        setActiveTab(tool.id)
                        setError('')
                        setResult(null)
                      }}
                      className={`w-full p-4 rounded-xl border transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r ' + tool.color + ' border-white/20 shadow-lg shadow-purple-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive ? 'bg-white/20' : 'bg-gradient-to-r ' + tool.color
                        }`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-white">{tool.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs border-white/20 ${
                                  isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-300'
                                }`}
                              >
                                {tool.credits} credits
                              </Badge>
                              {!canAfford && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                                >
                                  Upgrade
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className={`text-sm ${isActive ? 'text-white/90' : 'text-gray-400'}`}>
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10">
                <div className="flex items-center gap-3 mb-2">
                  {currentTool && <currentTool.icon className="w-6 h-6 text-purple-400" />}
                  <h2 className="text-2xl text-white">{currentTool?.title || 'AI Video Tool'}</h2>
                </div>
                <p className="text-gray-400">{currentTool?.description}</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {error && (
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 backdrop-blur-xl">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}

                {/* AI Generation Loader */}
                {showLoader && (
                  <AIGenerationLoader 
                    type="video" 
                    prompt={prompt || 'Processing video...'}
                    onComplete={() => {}}
                  />
                )}

                {!showLoader && activeTab === 'text-to-video' ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-300 mb-3">Video Description</label>
                      <Textarea
                        placeholder="Describe the video you want to create... e.g., 'A peaceful lake at sunrise with birds flying overhead, cinematic camera movement'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-40 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-500/20">
                        <Clock className="w-5 h-5 text-blue-400 mb-2" />
                        <p className="text-blue-300 mb-1">Duration</p>
                        <p className="text-white text-lg">{duration[0]} seconds</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl border border-purple-500/20">
                        <Sparkles className="w-5 h-5 text-purple-400 mb-2" />
                        <p className="text-purple-300 mb-1">Quality</p>
                        <p className="text-white text-lg">HD (1080p)</p>
                      </div>
                    </div>
                    
                    <StarBorder
                      as="button"
                      onClick={handleGenerate}
                      disabled={loading || !prompt.trim() || !user}
                      color="#EC4899"
                      speed="4s"
                      className="w-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2 text-lg">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Generating Video... (2-3 minutes)
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2 text-lg">
                          <Video className="h-5 w-5" />
                          Generate Video (10 credits)
                        </span>
                      )}
                    </StarBorder>
                  </div>
                ) : !showLoader && activeTab === 'image-to-video' ? (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-500/50 transition-all bg-white/5 backdrop-blur-sm">
                      <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-gray-300 mb-2">
                        Upload an image to animate
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        PNG, JPG up to 10MB
                      </p>
                      <input
                        type="file"
                        id="upload"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={() => document.getElementById('upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Select Image
                      </Button>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-3">Animation Style</label>
                      <Textarea
                        placeholder="Describe how the image should be animated... e.g., 'gentle swaying motion, subtle lighting changes, peaceful atmosphere'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-32 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 resize-none"
                      />
                    </div>

                    <Button 
                      disabled={true}
                      className="w-full h-14"
                      variant="outline"
                    >
                      Upload an image to continue
                    </Button>
                  </div>
                ) : !showLoader ? (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-500/50 transition-all bg-white/5 backdrop-blur-sm">
                      <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-gray-300 mb-2">
                        Upload a video to enhance or style transfer
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        MP4, MOV up to 100MB
                      </p>
                      <input
                        type="file"
                        id="video-upload"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={() => document.getElementById('video-upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Select Video
                      </Button>
                    </div>

                    <Button 
                      disabled={true}
                      className="w-full h-14"
                      variant="outline"
                    >
                      Upload a video to continue
                    </Button>
                  </div>
                ) : null}

                {/* Results */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <div className="border border-green-500/20 rounded-xl p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-green-400">
                          Video Generated Successfully!
                        </h3>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          -{result.creditsUsed} credits
                        </Badge>
                      </div>
                      
                      <div className="aspect-video bg-black/40 rounded-lg overflow-hidden mb-4 relative group border border-white/10">
                        <video 
                          src={result.videoUrl}
                          className="w-full h-full object-cover"
                          controls
                          poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjMTExODI3Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjExMi41IiByPSIzMCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC44Ii8+Cjxwb2x5Z29uIHBvaW50cz0iMTkwLDk3LjUgMTkwLDEyNy41IDIxNSwxMTIuNSIgZmlsbD0iIzExMTgyNyIvPgo8L3N2Zz4K"
                        />
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-4">
                        <strong className="text-white">Enhanced Prompt:</strong> {result.prompt}
                      </p>
                      
                      <div className="flex gap-3">
                        <Button 
                          size="sm" 
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={handleDownload}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download MP4
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={handleRegenerate}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Generate Again
                        </Button>
                      </div>
                      
                      <p className="text-xs text-gray-400 mt-3">
                        Credits remaining: {result.remainingCredits}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

