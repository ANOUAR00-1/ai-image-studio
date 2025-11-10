'use client'

import { useState } from 'react'
import { Check, Zap, Crown, Rocket, LogIn, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import StarBorder from '@/components/ui/StarBorder'
import { useRouter } from 'next/navigation'

interface Plan {
  name: string
  price: number
  credits: number
  features: string[]
  popular?: boolean
  icon: React.ReactNode
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: 0,
    credits: 10,
    icon: <Zap className="h-6 w-6" />,
    features: [
      '10 credits per month',
      'Access to basic models',
      'Standard quality',
      'Community support',
      'Watermarked images',
    ],
  },
  {
    name: 'Pro',
    price: 29,
    credits: 200,
    icon: <Crown className="h-6 w-6" />,
    popular: true,
    features: [
      '200 credits per month',
      'All AI models',
      'High quality output',
      'Priority processing',
      'No watermarks',
      'Download HD images',
      'Email support',
    ],
  },
  {
    name: 'Business',
    price: 99,
    credits: 1000,
    icon: <Rocket className="h-6 w-6" />,
    features: [
      '1000 credits per month',
      'All AI models',
      'Highest quality',
      'Fastest processing',
      'API access',
      'Custom integrations',
      'Priority support',
      'Team collaboration',
      'Commercial license',
    ],
  },
]

const creditPacks = [
  { credits: 50, price: 9, popular: false },
  { credits: 100, price: 15, popular: true, savings: '17%' },
  { credits: 500, price: 49, popular: false, savings: '45%' },
]

export default function PricingPage() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'credits'>('monthly')
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleSubscribe = async (plan: string) => {
    try {
      // Get token from localStorage (stored as 'access_token')
      const token = localStorage.getItem('access_token')
      if (!token) {
        setShowLoginModal(true)
        return
      }

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type: 'subscription', plan }),
      })

      const data = await response.json()
      if (data.success && data.data.url) {
        window.location.href = data.data.url
      }
    } catch (error) {
      console.error('Subscription error:', error)
    }
  }

  const handleBuyCredits = async (credits: number, price: number) => {
    try {
      // Get token from localStorage (stored as 'access_token')
      const token = localStorage.getItem('access_token')
      if (!token) {
        setShowLoginModal(true)
        return
      }

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type: 'credits', credits, price }),
      })

      const data = await response.json()
      if (data.success && data.data.url) {
        window.location.href = data.data.url
      }
    } catch (error) {
      console.error('Purchase error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0f2e] to-[#0a0118] py-20 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-black text-white mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Choose Your Plan
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Start creating amazing AI images and videos today
          </motion.p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div 
          className="flex justify-center mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-1 flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Monthly Plans
            </button>
            <button
              onClick={() => setBillingCycle('credits')}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                billingCycle === 'credits'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Buy Credits
            </button>
          </div>
        </motion.div>

        {/* Plans Grid */}
        {billingCycle === 'monthly' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border rounded-2xl shadow-2xl p-8 relative transition-all duration-500 hover:scale-[1.05] hover:shadow-3xl ${
                  plan.popular ? 'border-purple-500/50 shadow-purple-500/20 scale-105' : 'border-white/10'
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.4 + (index * 0.1),
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-purple-500/50">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                    {plan.icon}
                  </div>
                  <h3 className="text-3xl font-black text-white">
                    {plan.name}
                  </h3>
                </div>

                <div className="mb-6">
                  <span className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                    ${plan.price}
                  </span>
                  <span className="text-gray-400 text-xl">/month</span>
                </div>

                <div className="mb-8">
                  <p className="text-lg font-semibold text-purple-300">
                    {plan.credits} credits/month
                  </p>
                </div>

                {plan.name === 'Free' ? (
                  <button
                    disabled
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 mb-8 bg-white/5 text-gray-500 cursor-not-allowed border border-white/10"
                  >
                    Current Plan
                  </button>
                ) : (
                  <div className="mb-8">
                    <StarBorder
                      as="button"
                      onClick={() => handleSubscribe(plan.name.toLowerCase())}
                      color={plan.popular ? "#a855f7" : "#ec4899"}
                      speed={plan.popular ? "4s" : "5s"}
                      className="w-full hover:scale-105 transition-transform"
                    >
                      Get {plan.name}
                    </StarBorder>
                  </div>
                )}

                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {creditPacks.map((pack, index) => (
              <motion.div
                key={pack.credits}
                className={`bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border rounded-2xl shadow-2xl p-8 relative transition-all duration-500 hover:scale-[1.05] hover:shadow-3xl ${
                  pack.popular ? 'border-green-500/50 shadow-green-500/20 scale-105' : 'border-white/10'
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.4 + (index * 0.1),
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-green-500/50">
                      Best Value
                    </span>
                  </div>
                )}

                {pack.savings && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-sm font-bold">
                      Save {pack.savings}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <p className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-2">
                    {pack.credits}
                  </p>
                  <p className="text-gray-400">Credits</p>
                </div>

                <div className="text-center mb-8">
                  <span className="text-4xl font-black text-white">
                    ${pack.price}
                  </span>
                </div>

                <div className="mb-4">
                  <StarBorder
                    as="button"
                    onClick={() => handleBuyCredits(pack.credits, pack.price)}
                    color={pack.popular ? "#10b981" : "#a855f7"}
                    speed="5s"
                    className="w-full hover:scale-105 transition-transform"
                  >
                    Buy Now
                  </StarBorder>
                </div>

                <p className="text-center text-sm text-gray-400">
                  ${(pack.price / pack.credits).toFixed(2)} per credit
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* FAQ */}
        <motion.div 
          className="mt-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-4xl font-black text-center text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <FAQItem
              question="What are credits?"
              answer="Credits are used to generate images and videos. Each generation costs a certain number of credits depending on the model and quality."
            />
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes! You can cancel your subscription at any time. You'll retain access until the end of your billing period."
            />
            <FAQItem
              question="Do credits expire?"
              answer="Subscription credits reset monthly. Purchased credit packs never expire!"
            />
            <FAQItem
              question="Can I upgrade later?"
              answer="Absolutely! You can upgrade your plan at any time and only pay the difference."
            />
          </div>
        </motion.div>
      </div>

      {/* Beautiful Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              {/* Modal */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-gradient-to-br from-[#1a0f2e] to-[#0f0520] border border-purple-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              >
                {/* Close button */}
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
                    <LogIn className="w-12 h-12 text-purple-400" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-3xl font-black text-center mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                  Login Required
                </h3>

                {/* Message */}
                <p className="text-gray-300 text-center mb-8 text-lg">
                  Please login or create an account to upgrade your plan and unlock premium features.
                </p>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/')}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/50"
                  >
                    Login / Sign Up
                  </button>
                  
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-xl transition-all duration-300 border border-white/10"
                  >
                    Maybe Later
                  </button>
                </div>

                {/* Features preview */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400 text-center mb-3">
                    What you&apos;ll get:
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Check className="w-4 h-4 text-green-400" />
                      More Credits
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-4 h-4 text-green-400" />
                      All Models
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-4 h-4 text-green-400" />
                      HD Quality
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div 
      className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl shadow-lg p-6 transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center justify-between"
      >
        <h3 className="text-lg font-bold text-white">
          {question}
        </h3>
        <motion.span 
          className="text-2xl text-purple-400 font-bold"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? '−' : '+'}
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ overflow: 'hidden' }}
      >
        <p className="mt-4 text-gray-300">{answer}</p>
      </motion.div>
    </motion.div>
  )
}
