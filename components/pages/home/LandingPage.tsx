'use client'

import { Button } from "@/components/ui/button"
import { SimpleCard } from "@/components/ui/cards"
import { Sparkles, ImageIcon, Wand2, Zap, Shield, ArrowRight, Check, Lock, Award, Download, Palette, Star } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import { AuthModal } from "@/components/pages/auth/AuthModal"
import { toast } from "sonner"
import Lightning from "@/components/ui/Lightning"
import BlurText from "@/components/ui/BlurText"
import CountUp from "@/components/ui/CountUp"
import StarBorder from "@/components/ui/StarBorder"
import SpotlightCard from "@/components/ui/SpotlightCard"

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()

  const handleGetStarted = () => {
    if (isLoggedIn) {
      // User is logged in, go to dashboard (no toast - only show on login)
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
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0118] to-black relative overflow-hidden">
      {/* Lightning Background Animation - Optimized for Performance */}
      <div 
        className="absolute top-0 left-0 right-0 pointer-events-none z-0 opacity-60" 
        style={{ 
          height: '100vh',
          willChange: 'opacity',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        <Lightning
          hue={280}
          xOffset={0}
          speed={0.3}
          intensity={1.0}
          size={0.6}
        />
      </div>
      
      {/* Animated Background Elements - GPU Accelerated */}
      <div 
        className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none z-0" 
        style={{ 
          height: '100vh',
          contain: 'layout style paint',
          transform: 'translateZ(0)'
        }}
      >
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl animate-pulse" 
          style={{ 
            willChange: 'opacity',
            transform: 'translateZ(0)'
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-3xl animate-pulse" 
          style={{ 
            animationDelay: '1s',
            willChange: 'opacity',
            transform: 'translateZ(0)'
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 relative z-10">
        <motion.div 
          className="text-center max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ willChange: 'transform, opacity' }}
        >
          
          <div className="mb-8 text-center">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-[1.1] tracking-tight">
              <motion.span 
                className="inline-block bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {"Transform Ideas into".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      delay: 0.3 + i * 0.03,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.span>
              <br />
              <motion.span 
                className="inline-block bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent animate-gradient"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                {"Stunning Visuals".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, y: 50, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.9 + i * 0.03,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.span>
            </h1>
          </div>
          
          <motion.p 
            className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Create, edit, and enhance images with <span className="text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text font-medium">cutting-edge AI</span>. From text-to-image generation to background removal and beyond.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-5 justify-center mb-24"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <StarBorder
              as="button"
              onClick={handleGetStarted}
              color="#a855f7"
              speed="5s"
              className="group hover:scale-105 transition-transform duration-300"
            >
              <span className="flex items-center gap-2 text-lg font-semibold">
                {isLoggedIn ? 'Go to Dashboard' : 'Start Creating Free'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </StarBorder>
            <StarBorder
              as="button"
              onClick={handleViewExamples}
              color="#EC4899"
              speed="6s"
              className="hover:scale-105 transition-transform"
            >
              <span className="text-lg font-semibold">View Examples</span>
            </StarBorder>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105" style={{ willChange: 'transform' }}>
              <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-3">
                <CountUp from={0} to={10} duration={2} separator="," className="inline-block" />K+
              </div>
              <div className="text-gray-200 font-medium text-lg">Images Created</div>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:scale-105" style={{ willChange: 'transform' }}>
              <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-3">
                <CountUp from={0} to={5} duration={2} separator="," className="inline-block" />K+
              </div>
              <div className="text-gray-200 font-medium text-lg">Active Users</div>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105" style={{ willChange: 'transform' }}>
              <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-3">
                <CountUp from={0} to={99.9} duration={2.5} className="inline-block" />%
              </div>
              <div className="text-gray-200 font-medium text-lg">Uptime</div>
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
            <BlurText delay={0.2} className="text-4xl sm:text-5xl font-bold mb-4 text-white justify-center">
              Powerful AI Features at Your Fingertips
            </BlurText>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Everything you need to create, edit, and transform visual content with AI
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
          >
            {[
              { icon: ImageIcon, title: "Text-to-Image", description: "Transform words into breathtaking visuals", color: "from-pink-500 to-purple-500", href: "/image-tools" },
              { icon: Wand2, title: "AI Enhancement", description: "Upscale and enhance any image instantly", color: "from-blue-500 to-cyan-500", href: "/image-tools" },
              { icon: Palette, title: "Background Removal", description: "Professional cutouts in one click", color: "from-green-500 to-emerald-500", href: "/image-tools" },
              { icon: Sparkles, title: "Style Transfer", description: "Apply artistic styles to your images", color: "from-orange-500 to-red-500", href: "/image-tools" },
              { icon: Zap, title: "Batch Processing", description: "Process multiple images simultaneously", color: "from-yellow-500 to-orange-500", href: "/image-tools" },
              { icon: Download, title: "HD Exports", description: "Download in multiple high-quality formats", color: "from-purple-500 to-pink-500", href: "/gallery" }
            ].map((feature, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}>
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
            <BlurText delay={0.2} className="text-4xl sm:text-5xl font-bold mb-4 text-white justify-center">
              Everything You Need to Create
            </BlurText>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Professional-grade AI tools that make content creation accessible to everyone
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
          >
            {[
              { icon: ImageIcon, title: "AI Image Generation", description: "Create stunning images from text prompts with state-of-the-art AI models", href: "/image-tools" },
              // VIDEO COMMENTED OUT - NO FREE API
              // { icon: Video, title: "AI Video Creation", description: "Generate professional videos from text or animate your images with AI", href: "/video-tools" },
              { icon: Wand2, title: "Advanced Editing", description: "Remove backgrounds, enhance quality, upscale, and inpaint with precision", href: "/image-tools" },
              { icon: Zap, title: "Lightning Fast", description: "Get your creations in seconds with our optimized AI processing pipeline", href: "/dashboard" },
              { icon: Shield, title: "Enterprise Ready", description: "Secure, scalable, and reliable platform trusted by creative professionals", href: "/about" },
              { icon: Star, title: "Premium Quality", description: "Hollywood-grade output quality with watermark-free downloads", href: "/pricing" }
            ].map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}>
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
            <BlurText delay={0.2} className="text-4xl sm:text-5xl font-bold mb-4 text-white justify-center">
              Choose Your Perfect Plan
            </BlurText>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Choose the plan that fits your creative needs. Start free, upgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-8">
            {[
              { name: "Free", price: "$0", period: "/month", credits: "10 credits", features: ["Basic AI tools", "Standard quality", "Limited generations", "Community support"], popular: false },
              { name: "Pro", price: "$19", period: "/month", credits: "300 credits", features: ["All AI tools", "HD quality exports", "Priority processing", "Email support", "No watermarks"], popular: true },
              { name: "Business", price: "$59", period: "/month", credits: "1000 credits", features: ["Everything in Pro", "Team workspace", "API access", "Custom integrations", "Priority support"], popular: false }
            ].map((plan) => (
              <div key={plan.name} className="relative h-full">
                <SpotlightCard
                  className={`group transition-all duration-500 hover:scale-[1.02] h-full flex flex-col ${
                    plan.popular 
                      ? 'border-2 border-purple-500 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50' 
                      : 'border-white/10 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10'
                  }`}
                  spotlightColor="rgba(168, 85, 247, 0.15)"
                >
                {plan.popular ? (
                  <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 py-2 px-4 -mx-8 -mt-8 mb-6 rounded-t-3xl">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-yellow-300 text-lg">⭐</span>
                      <span className="text-white text-sm font-bold tracking-wide">MOST POPULAR</span>
                      <span className="text-yellow-300 text-lg">⭐</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-10"></div>
                )}
                <div className={`${plan.popular ? 'p-10 pt-0' : 'p-10 pt-0'} text-center flex-1 flex flex-col`}>
                  <h3 className="text-3xl font-black text-white mb-6 group-hover:text-purple-300 transition-colors">{plan.name}</h3>
                  <div className="mb-3">
                    <span className="text-6xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{plan.price}</span>
                    <span className="text-gray-400 text-xl">{plan.period}</span>
                  </div>
                  <p className="text-purple-400 font-bold text-lg mb-8">{plan.credits}</p>
                  <ul className="space-y-4 mb-10 text-left flex-1">
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
                </div>
              </SpotlightCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 relative">
        <div className="container mx-auto px-4">
          <SpotlightCard 
            className="relative overflow-hidden bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-purple-600/30 border-2 border-purple-500/40 backdrop-blur-2xl max-w-5xl mx-auto shadow-2xl shadow-purple-500/30"
            spotlightColor="rgba(236, 72, 153, 0.2)"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
            <div className="relative p-16 text-center">
              <BlurText delay={0.2} className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight text-white justify-center">
                Ready to Transform Your Ideas?
              </BlurText>
              <p className="text-xl sm:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                Join thousands of creators using <span className="text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text font-medium">PixFusion AI</span> to bring their imagination to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <button
                  onClick={handleGetStarted}
                  className="group bg-gradient-to-br from-[#0f0520] via-[#1a0f2e] to-[#0a0118] backdrop-blur-xl border-2 border-purple-500/50 text-white hover:border-purple-400 transition-all duration-300 text-lg px-10 py-4 rounded-full hover:scale-105 cursor-pointer"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    {isLoggedIn ? 'Go to Dashboard' : "Start Creating Now - It's Free"}
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </span>
                </button>
                <button
                  onClick={handleLearnMore}
                  className="bg-transparent backdrop-blur-xl border-2 border-purple-500/50 text-white hover:bg-white/10 hover:border-purple-400 transition-all duration-300 text-lg px-10 py-4 rounded-full hover:scale-105 cursor-pointer"
                >
                  <span className="font-semibold">Learn More</span>
                </button>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  )
}
