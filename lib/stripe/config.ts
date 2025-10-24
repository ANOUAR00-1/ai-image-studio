import Stripe from 'stripe'

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-09-30.clover',
  typescript: true,
})

// Stripe pricing plans
export const STRIPE_PLANS = {
  starter: {
    name: 'Starter',
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || '',
    price: 9.99,
    credits: 100,
    features: [
      '100 credits per month',
      'All AI models',
      'Email support',
      'HD quality exports',
      'Commercial license'
    ]
  },
  pro: {
    name: 'Pro',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
    price: 29.99,
    credits: 500,
    features: [
      '500 credits per month',
      'All AI models',
      'Priority processing',
      'Priority support',
      '4K quality exports',
      'Commercial license',
      'API access'
    ]
  },
  business: {
    name: 'Business',
    priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID || '',
    price: 99.99,
    credits: -1, // Unlimited
    features: [
      'Unlimited credits',
      'All AI models',
      'Fastest processing',
      'Dedicated support',
      '4K quality exports',
      'Commercial license',
      'API access',
      'Custom integrations',
      'Team collaboration'
    ]
  }
}

// Get plan by price ID
export function getPlanByPriceId(priceId: string) {
  return Object.entries(STRIPE_PLANS).find(
    ([, plan]) => plan.priceId === priceId
  )?.[0] || null
}
