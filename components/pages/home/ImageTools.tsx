import { useState } from 'react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Wand2, 
  Upload, 
  Download, 
  Sparkles, 
  Loader2,
  Scissors,
  Zap,
  Palette,
  AlertCircle,
  Check,
  ArrowLeft
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { api } from '@/utils/api'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import AIGenerationLoader from '@/components/pages/shared/AIGenerationLoader'
import StarBorder from '@/components/ui/StarBorder'

export function ImageTools() {
  const { user, refreshUser } = useAuthStore()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('generate')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ 
    imageUrl?: string; 
    message?: string;
    id?: string;
    prompt?: string;
    creditsUsed?: number;
    remainingCredits?: number;
  } | null>(null)
  const [error, setError] = useState('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string>('')
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  const tools = [
    {
      id: 'generate',
      title: 'Text to Image',
      description: 'Generate images from text descriptions',
      icon: Sparkles,
      credits: 3,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'remove-bg',
      title: 'Remove Background',
      description: 'Remove backgrounds from images',
      icon: Scissors,
      credits: 2,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'enhance',
      title: 'Enhance Quality',
      description: 'Upscale and improve image quality',
      icon: Zap,
      credits: 2,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'style-transfer',
      title: 'Style Transfer',
      description: 'Apply artistic styles to images',
      icon: Palette,
      credits: 3,
      color: 'from-pink-500 to-rose-600'
    }
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your image')
      return
    }

    if (!user || ((user.credits ?? 0) < 3 && user.credits !== -1 && !user.is_admin)) {
      // Show pricing modal instead of just error
      setShowPricingModal(true)
      return
    }
    setLoading(true)
    setError('')
    setResult(null)

    try {
      console.log('Generating image with prompt:', prompt, 'model:', activeTab)
      const response = await api.generateImage(prompt, activeTab)
      console.log('API Response:', response)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate image')
      }

      if (!response.data?.generation?.url) {
        throw new Error('No image URL received from server')
      }
      
      setResult({
        imageUrl: response.data.generation.url,
        id: response.data.generation.id,
        prompt: response.data.generation.prompt,
        creditsUsed: response.data.generation.creditsUsed,
        remainingCredits: response.data.remainingCredits
      })
      await refreshUser()
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Generation error:', error)
      setError(error.message || 'Failed to generate image')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file')
        return
      }

      setError('')
      setUploadedFileName(file.name)

      // Convert to base64 for preview and processing
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProcessImage = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first')
      return
    }

    const currentTool = tools.find(t => t.id === activeTab)
    if (!user || ((user.credits ?? 0) < (currentTool?.credits || 2) && user.credits !== -1 && !user.is_admin)) {
      // Show pricing modal instead of just error
      setShowPricingModal(true)
      return
    }

    setLoading(true)
    setShowLoader(true)
    setError('')
    setResult(null)

    try {
      // Determine API endpoint based on tool
      let endpoint = ''
      if (activeTab === 'remove-bg') {
        endpoint = '/api/tools/remove-background'
      } else if (activeTab === 'enhance') {
        endpoint = '/api/tools/enhance'
      } else if (activeTab === 'style-transfer') {
        endpoint = '/api/tools/style-transfer'
      }

      // Call the real API
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          image: uploadedImage,
          style: 'anime', // for style transfer
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Processing failed')
      }

      // Refresh user credits
      await refreshUser()

      // Set result
      setResult({
        imageUrl: data.data.imageUrl,
        prompt: `${currentTool?.title} applied to ${uploadedFileName}`,
        creditsUsed: data.data.creditsUsed,
        remainingCredits: data.data.remainingCredits
      })
      
      setShowLoader(false)
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to process image')
      setShowLoader(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!result?.imageUrl) return

    try {
      // Fetch the image
      const response = await fetch(result.imageUrl)
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `pixfusion-${result.id || Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
      setError('Failed to download image. Please try right-clicking and "Save Image As..."')
    }
  }

  const handleRegenerate = () => {
    if (activeTab === 'generate') {
      // For text-to-image, regenerate with current prompt
      handleGenerate()
    } else {
      // For other tools, reprocess the uploaded image
      handleProcessImage()
    }
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1a1a3f] to-[#0a0a1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pricing Modal */}
        <Dialog open={showPricingModal} onOpenChange={setShowPricingModal}>
          <DialogContent className="max-w-5xl bg-gradient-to-br from-[#1a1a3f] to-[#0a0a1f] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Insufficient Credits
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-lg">
                You need {activeTab === 'generate' ? 3 : (currentTool?.credits || 2)} credits to use this tool. You currently have {user?.credits || 0} credits.
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
                          router.push('/pricing')
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
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3"
          >
            AI Image Tools
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Create and edit images with advanced AI technology
          </motion.p>
        </div>

        {/* Credits Warning */}
        {user && (user.credits ?? 0) < 10 && user.credits !== -1 && !user.is_admin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert className="bg-yellow-500/10 border-yellow-500/20 backdrop-blur-xl">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-200">
                You have {user.credits} credits remaining. Image generation costs credits.
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
            className="lg:col-span-4"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-xl text-white mb-1">Select Tool</h2>
                <p className="text-sm text-gray-400">Choose an AI tool to transform your images</p>
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
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
                <div className="flex items-center gap-3 mb-2">
                  {currentTool && <currentTool.icon className="w-6 h-6 text-purple-400" />}
                  <h2 className="text-2xl text-white">{currentTool?.title || 'AI Image Tool'}</h2>
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
                    type="image" 
                    prompt={prompt || `Processing with ${currentTool?.title}`}
                    onComplete={() => {}}
                  />
                )}

                {!showLoader && activeTab === 'generate' ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-300 mb-3">
                        Image Description
                        <span className="text-purple-400 ml-2 text-xs">(Be specific for best results)</span>
                      </label>
                      <Textarea
                        placeholder="Example: 'Audi R8 sports car on street in Agadir Morocco at sunset, cinematic photography' or 'McLaren 765 LT in snowy mountains'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-32 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 resize-none"
                      />
                      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-xs text-blue-300 mb-2">
                          <Sparkles className="w-3 h-3 inline mr-1" />
                          <strong>Pro Tips for Accurate Results:</strong>
                        </p>
                        <ul className="text-xs text-gray-400 space-y-1 ml-4">
                          <li>✓ Include <strong>specific details</strong>: car model, location, time of day</li>
                          <li>✓ Add <strong>style keywords</strong>: &quot;photo of&quot;, &quot;cinematic&quot;, &quot;realistic&quot;</li>
                          <li>✓ Avoid vague terms like &quot;something cool&quot; or just &quot;car&quot;</li>
                        </ul>
                      </div>
                    </div>
                    
                    <StarBorder
                      as="button"
                      onClick={handleGenerate}
                      disabled={loading || !prompt.trim() || !user}
                      color="#A855F7"
                      speed="4s"
                      className="w-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2 text-lg">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Generating Image...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2 text-lg">
                          <Sparkles className="h-5 w-5" />
                          Generate Image (3 credits)
                        </span>
                      )}
                    </StarBorder>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* File Upload Area */}
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all bg-white/5 backdrop-blur-sm ${
                      uploadedImage 
                        ? 'border-green-500/50 bg-green-500/5' 
                        : 'border-white/20 hover:border-purple-500/50'
                    }`}>
                      {uploadedImage ? (
                        <div className="space-y-4">
                          <div className="relative w-full max-w-md mx-auto aspect-square rounded-lg overflow-hidden border border-white/20">
                            <ImageWithFallback
                              src={uploadedImage}
                              fallbackSrc="/placeholder-image.png"
                              alt="Uploaded image"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-green-400">
                            ✓ {uploadedFileName}
                          </p>
                          <Button 
                            variant="outline" 
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => {
                              setUploadedImage(null)
                              setUploadedFileName('')
                              setResult(null)
                            }}
                          >
                            Upload Different Image
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                          <p className="text-gray-300 mb-2">
                            Click to upload or drag and drop
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
                        </>
                      )}
                    </div>

                    {/* Process Button */}
                    <StarBorder
                      as="button"
                      onClick={handleProcessImage}
                      disabled={!uploadedImage || loading || !user}
                      color="#A855F7"
                      speed="4s"
                      className="w-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2 text-lg">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing Image...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2 text-lg">
                          {currentTool?.icon && <currentTool.icon className="h-5 w-5" />}
                          {currentTool?.title} ({currentTool?.credits} credits)
                        </span>
                      )}
                    </StarBorder>
                  </div>
                )}

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
                          Generation Successful!
                        </h3>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          -{result.creditsUsed} credits
                        </Badge>
                      </div>
                      
                      <div className="aspect-video bg-black/20 rounded-lg overflow-hidden mb-4 border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={result.imageUrl}
                          alt={result.prompt}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            console.error('Image load error:', result.imageUrl)
                            const target = e.target as HTMLImageElement
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='
                          }}
                          onLoad={() => console.log('Image loaded successfully:', result.imageUrl)}
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
                          Download
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={handleRegenerate}
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          Regenerate
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

