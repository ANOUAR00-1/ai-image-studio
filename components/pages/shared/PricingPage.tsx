import { useState } from 'react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Check, 
  Sparkles, 
  Zap, 
  Crown, 
  Star,
  CreditCard,
  Shield,
  Headphones,
  AlertCircle
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export function PricingPage() {
  const { user } = useAuthStore()
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      credits: 10,
      period: 'month',
      description: 'Perfect for trying out AI tools',
      icon: Sparkles,
      color: 'from-gray-400 to-gray-500',
      features: [
        '10 credits per month',
        'Basic AI image generation',
        'Standard quality output',
        'Community support',
        'Watermarked downloads'
      ],
      limitations: [
        'Limited to basic tools',
        'Standard processing priority',
        'Community support only'
      ],
      popular: false,
      current: user?.plan === 'free'
    },
    {
      name: 'Pro',
      price: { monthly: 19, annual: 15 },
      credits: 300,
      period: 'month',
      description: 'For creators and professionals',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      features: [
        '300 credits per month',
        'All AI tools access',
        'HD quality exports',
        'Priority processing',
        'Email support',
        'No watermarks',
        'Advanced editing tools',
        'Custom video durations'
      ],
      limitations: [],
      popular: true,
      current: user?.plan === 'pro'
    },
    {
      name: 'Business',
      price: { monthly: 59, annual: 47 },
      credits: 1000,
      period: 'month',
      description: 'For teams and enterprises',
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      features: [
        '1000 credits per month',
        'Everything in Pro',
        'Team workspace (5 users)',
        'API access',
        'Custom integrations',
        'Priority support',
        'Advanced analytics',
        'White-label options',
        'Bulk processing'
      ],
      limitations: [],
      popular: false,
      current: user?.plan === 'business'
    }
  ]

  const handleUpgrade = (planName: string) => {
    // In a real app, this would integrate with Stripe
    alert(`Stripe integration would handle ${planName} plan upgrade here`)
  }

  const addons = [
    {
      name: 'Extra Credits',
      description: 'Additional credits for heavy usage',
      price: 10,
      unit: '100 credits',
      icon: Star
    },
    {
      name: 'Priority Support',
      description: 'Dedicated support channel',
      price: 29,
      unit: 'month',
      icon: Headphones
    },
    {
      name: 'API Access',
      description: 'Programmatic access to AI tools',
      price: 49,
      unit: 'month',
      icon: Shield
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Unlock the full power of AI-driven content creation. 
              Start free, upgrade anytime.
            </p>

            {/* Annual Toggle */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <span className={`text-sm ${!isAnnual ? 'text-white font-medium' : 'text-gray-400'}`}>
                Monthly
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
              />
              <span className={`text-sm ${isAnnual ? 'text-white font-medium' : 'text-gray-400'}`}>
                Annual
              </span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border border-green-500/30 ml-2">
                Save 20%
              </Badge>
            </div>
          </motion.div>
        </div>

        {/* Current Plan Alert */}
        {user && (
          <Alert className="mb-8 border-purple-500/30 bg-purple-500/10 backdrop-blur-sm">
            <CreditCard className="h-4 w-4 text-purple-400" />
            <AlertDescription className="text-purple-200">
              You&apos;re currently on the <strong>{user.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'Free'}</strong> plan 
              with <strong>{user.credits}</strong> credits remaining.
            </AlertDescription>
          </Alert>
        )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => {
          const Icon = plan.icon
          const price = isAnnual ? plan.price.annual : plan.price.monthly
          const savings = plan.price.monthly - plan.price.annual
          
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative ${plan.popular ? 'scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 border-0 shadow-lg shadow-purple-500/30">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {plan.current && (
                <div className="absolute -top-4 right-4 z-10">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border border-green-500/30">
                    Current Plan
                  </Badge>
                </div>
              )}

              <Card className={`h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 ${plan.popular ? 'border-purple-500/50 shadow-xl shadow-purple-500/20' : ''} ${plan.current ? 'border-green-500/50' : ''}`}>
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2 text-white">{plan.name}</CardTitle>
                  <CardDescription className="mb-4 text-gray-300">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">${price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                    {isAnnual && savings > 0 && (
                      <div className="text-sm text-green-400 mt-1">
                        Save ${savings * 12}/year
                      </div>
                    )}
                  </div>
                  
                  <div className="text-lg font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    {plan.credits} credits/month
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-200 mb-2">Limitations:</h4>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-start">
                            <AlertCircle className="w-3 h-3 text-orange-400 mr-2 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-400">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Button 
                    className={`w-full ${
                      plan.current 
                        ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                        : plan.popular 
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-purple-500/30' 
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                    onClick={() => !plan.current && handleUpgrade(plan.name.toLowerCase())}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : (
                      plan.name === 'Free' ? 'Start Free' : `Upgrade to ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

        {/* Add-ons Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Add-ons & Extras
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addons.map((addon, index) => {
              const Icon = addon.icon
              return (
                <motion.div
                  key={addon.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <h3 className="font-semibold text-white mb-2">
                        {addon.name}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">
                        {addon.description}
                      </p>
                      <div className="text-lg font-bold text-white mb-4">
                        ${addon.price}/{addon.unit}
                      </div>
                      <Button variant="outline" size="sm" className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                        Add to Plan
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "What happens to unused credits?",
                answer: "Unused credits don't roll over to the next month. Each plan gives you a fresh allocation monthly."
              },
              {
                question: "Can I change plans anytime?",
                answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee for all paid plans if you're not satisfied."
              },
              {
                question: "Is there a free trial?",
                answer: "The Free plan gives you 10 credits to try our AI tools. No credit card required to start."
              }
            ].map((faq, index) => (
              <Card key={index} className="text-left bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-300">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
