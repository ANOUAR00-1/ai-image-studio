'use client'

import { useState } from 'react'
import { Check, Zap, Crown, Rocket } from 'lucide-react'

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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'credits'>('monthly')

  const handleSubscribe = async (plan: string) => {
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'subscription', plan }),
      })

      const data = await response.json()
      if (data.success && data.data.url) {
        window.location.href = data.data.url
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Failed to start subscription')
    }
  }

  const handleBuyCredits = async (credits: number, price: number) => {
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'credits', credits, price }),
      })

      const data = await response.json()
      if (data.success && data.data.url) {
        window.location.href = data.data.url
      }
    } catch (error) {
      console.error('Purchase error:', error)
      alert('Failed to purchase credits')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Start creating amazing AI images and videos today
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                billingCycle === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly Plans
            </button>
            <button
              onClick={() => setBillingCycle('credits')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                billingCycle === 'credits'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Buy Credits
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        {billingCycle === 'monthly' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative ${
                  plan.popular ? 'ring-2 ring-purple-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-600 dark:text-purple-300">
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                </div>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">/month</span>
                </div>

                <div className="mb-6">
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {plan.credits} credits/month
                  </p>
                </div>

                <button
                  onClick={() => handleSubscribe(plan.name.toLowerCase())}
                  disabled={plan.name === 'Free'}
                  className={`w-full py-3 rounded-lg font-medium transition mb-6 ${
                    plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : plan.name === 'Free'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.name === 'Free' ? 'Current Plan' : `Get ${plan.name}`}
                </button>

                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {creditPacks.map((pack) => (
              <div
                key={pack.credits}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative ${
                  pack.popular ? 'ring-2 ring-purple-500 transform scale-105' : ''
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Best Value
                    </span>
                  </div>
                )}

                {pack.savings && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                      Save {pack.savings}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <p className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    {pack.credits}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">Credits</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    ${pack.price}
                  </span>
                </div>

                <button
                  onClick={() => handleBuyCredits(pack.credits, pack.price)}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                >
                  Buy Now
                </button>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  ${(pack.price / pack.credits).toFixed(2)} per credit
                </p>
              </div>
            ))}
          </div>
        )}

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
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
        </div>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center justify-between"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {question}
        </h3>
        <span className="text-2xl text-gray-500">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <p className="mt-4 text-gray-600 dark:text-gray-300">{answer}</p>
      )}
    </div>
  )
}
