'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SimpleCard } from "@/components/ui/cards"
import { Sparkles, ImageIcon, Wand2, Zap, Shield, ArrowRight, Check, Lock, Award, Download, Video, Palette, Star } from "lucide-react"
import { motion } from "framer-motion"
import { staggerContainer, staggerItem } from "@/lib/animations"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import { AuthModal } from "@/components/pages/auth/AuthModal"
import { toast } from "sonner"

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const router = useRouter()
  const { isLoggedIn, user } = useAuthStore()

  const handleGetStarted = () => {
    if (isLoggedIn) {
      // User is logged in, go to dashboard
      toast.success(`Welcome back, ${user?.name || 'User'}! 🚀`)
      router.push('/dashboard')
    } else {
      // User not logged in, show auth modal
      setAuthModalOpen(true)
    }
  }

  const handlePricingClick = (planName: string) => {
    if (planName === 'Free') {
      // Free plan - direct to signup/dashboard
      handleGetStarted()
    } else {
      if (isLoggedIn) {
        // User logged in, go to pricing page to upgrade
        router.push('/pricing')
      } else {
        // User not logged in, show auth modal first
        toast.info('Please sign up to choose a plan')
        setAuthModalOpen(true)
      }
    }
  }

  const handleViewExamples = () => {
    router.push('/examples')
  }

  const handleLearnMore = () => {
    // Smooth scroll to features section
    const featuresSection = document.getElementById('features')
    featuresSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0a1f] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 relative z-10">
        <motion.div 
          className="text-center max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={staggerItem}>
            <Badge 
              className="mb-8 inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 px-4 py-2 backdrop-blur-xl"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="font-medium">Powered by Google Gemini AI</span>
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight"
            variants={staggerItem}
          >
            Transform Ideas into
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent animate-gradient">
              Stunning Visuals
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            variants={staggerItem}
          >
            Create, edit, and enhance images with cutting-edge AI. From text-to-image generation to background removal and beyond.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-5 justify-center mb-24"
            variants={staggerItem}
          >
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="group bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 text-white border-0 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 text-lg px-8 py-6 h-auto hover:scale-105"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Start Creating Free'}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              onClick={handleViewExamples}
              variant="outline"
              className="bg-white/5 backdrop-blur-xl border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 text-lg px-8 py-6 h-auto hover:scale-105"
            >
              View Examples
            </Button>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                10K+
              </div>
              <div className="text-gray-300 font-medium text-lg">Images Created</div>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
              <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">
                5K+
              </div>
              <div className="text-gray-300 font-medium text-lg">Active Users</div>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
                99.9%
              </div>
              <div className="text-gray-300 font-medium text-lg">Uptime</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: "Enterprise Security", subtitle: "Bank-level encryption" },
              { icon: Zap, title: "Lightning Fast", subtitle: "99.9% uptime SLA" },
              { icon: Award, title: "Award Winning", subtitle: "Top AI Tool 2025" },
              { icon: Lock, title: "GDPR Compliant", subtitle: "Your data is safe" }
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 border border-purple-500/30">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.subtitle}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Powerful AI Features at Your Fingertips
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Everything you need to create, edit, and transform visual content with AI
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { icon: ImageIcon, title: "Text-to-Image", description: "Transform words into breathtaking visuals", color: "from-pink-500 to-purple-500", href: "/image-tools" },
              { icon: Wand2, title: "AI Enhancement", description: "Upscale and enhance any image instantly", color: "from-blue-500 to-cyan-500", href: "/image-tools" },
              { icon: Palette, title: "Background Removal", description: "Professional cutouts in one click", color: "from-green-500 to-emerald-500", href: "/image-tools" },
              { icon: Sparkles, title: "Style Transfer", description: "Apply artistic styles to your images", color: "from-orange-500 to-red-500", href: "/image-tools" },
              { icon: Zap, title: "Batch Processing", description: "Process multiple images simultaneously", color: "from-yellow-500 to-orange-500", href: "/image-tools" },
              { icon: Download, title: "HD Exports", description: "Download in multiple high-quality formats", color: "from-purple-500 to-pink-500", href: "/gallery" }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={staggerItem}>
                <SimpleCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  color={feature.color}
                  href={feature.href}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Everything You Need Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Everything You Need to Create
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Professional-grade AI tools that make content creation accessible to everyone
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { icon: ImageIcon, title: "AI Image Generation", description: "Create stunning images from text prompts with state-of-the-art AI models", href: "/image-tools" },
              { icon: Video, title: "AI Video Creation", description: "Generate professional videos from text or animate your images with AI", href: "/video-tools" },
              { icon: Wand2, title: "Advanced Editing", description: "Remove backgrounds, enhance quality, upscale, and inpaint with precision", href: "/image-tools" },
              { icon: Zap, title: "Lightning Fast", description: "Get your creations in seconds with our optimized AI processing pipeline", href: "/dashboard" },
              { icon: Shield, title: "Enterprise Ready", description: "Secure, scalable, and reliable platform trusted by creative professionals", href: "/about" },
              { icon: Star, title: "Premium Quality", description: "Hollywood-grade output quality with watermark-free downloads", href: "/pricing" }
            ].map((item, idx) => (
              <motion.div key={idx} variants={staggerItem}>
                <SimpleCard
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  href={item.href}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Choose the plan that fits your creative needs. Start free, upgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Free", price: "$0", period: "/month", credits: "10 credits", features: ["Basic AI tools", "Standard quality", "Limited generations", "Community support"], popular: false },
              { name: "Pro", price: "$19", period: "/month", credits: "300 credits", features: ["All AI tools", "HD quality exports", "Priority processing", "Email support", "No watermarks"], popular: true },
              { name: "Business", price: "$59", period: "/month", credits: "1000 credits", features: ["Everything in Pro", "Team workspace", "API access", "Custom integrations", "Priority support"], popular: false }
            ].map((plan) => (
              <Card 
                key={plan.name} 
                className={`group bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border transition-all duration-500 hover:scale-[1.02] relative ${
                  plan.popular 
                    ? 'border-2 border-purple-500 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50' 
                    : 'border-white/10 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 border-0 px-6 py-2 text-sm font-bold shadow-lg">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-10 text-center">
                  <h3 className="text-3xl font-black text-white mb-6 group-hover:text-purple-300 transition-colors">{plan.name}</h3>
                  <div className="mb-3">
                    <span className="text-6xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{plan.price}</span>
                    <span className="text-gray-400 text-xl">{plan.period}</span>
                  </div>
                  <p className="text-purple-400 font-bold text-lg mb-8">{plan.credits}</p>
                  <ul className="space-y-4 mb-10 text-left">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => handlePricingClick(plan.name)}
                    className={`w-full h-12 text-base font-bold transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105' 
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 hover:scale-105'
                    }`}
                  >
                    {plan.name === "Free" ? (isLoggedIn ? "Current Plan" : "Start Free") : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 relative">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-purple-600/30 border-2 border-purple-500/40 backdrop-blur-2xl max-w-5xl mx-auto shadow-2xl shadow-purple-500/30">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
            <CardContent className="relative p-16 text-center">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Ready to Transform Your Ideas?
              </h2>
              <p className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                Join thousands of creators using PixFusion AI to bring their imagination to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="group bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 text-white border-0 shadow-2xl shadow-purple-500/60 hover:shadow-purple-500/80 transition-all duration-300 text-lg px-10 py-7 h-auto hover:scale-110"
                >
                  {isLoggedIn ? 'Go to Dashboard' : "Start Creating Now - It's Free"}
                  <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  onClick={handleLearnMore}
                  variant="outline"
                  className="bg-white/10 backdrop-blur-xl border-white/30 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-lg px-10 py-7 h-auto hover:scale-110"
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  )
}
