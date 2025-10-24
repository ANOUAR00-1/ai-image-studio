import Stripe from 'stripe'
import { PLANS } from '../config/constants'

// Initialize Stripe lazily to avoid build-time errors when API key is missing
let stripe: Stripe | null = null

function getStripe(): Stripe {
  if (!stripe) {
    const apiKey = process.env.STRIPE_SECRET_KEY
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }
    stripe = new Stripe(apiKey, {
      apiVersion: '2025-09-30.clover',
    })
  }
  return stripe
}

export class StripeService {
  // Create checkout session for credit purchase
  static async createCreditCheckoutSession(
    userId: string,
    userEmail: string,
    credits: number,
    price: number
  ) {
    try {
      const session = await getStripe().checkout.sessions.create({
        customer_email: userEmail,
        client_reference_id: userId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${credits} Credits`,
                description: `Purchase ${credits} credits for AI generation`,
              },
              unit_amount: price * 100, // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=canceled`,
        metadata: {
          userId,
          credits: credits.toString(),
          type: 'credit_purchase',
        },
      })

      return session
    } catch (error) {
      console.error('Create checkout session error:', error)
      throw error
    }
  }

  // Create subscription checkout session
  static async createSubscriptionCheckoutSession(
    userId: string,
    userEmail: string,
    plan: 'pro' | 'business'
  ) {
    try {
      const planConfig = PLANS[plan]
      
      if (!planConfig.stripePriceId) {
        throw new Error(`Stripe price ID not configured for ${plan} plan`)
      }

      const session = await getStripe().checkout.sessions.create({
        customer_email: userEmail,
        client_reference_id: userId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: planConfig.stripePriceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?subscription=canceled`,
        metadata: {
          userId,
          plan,
        },
      })

      return session
    } catch (error) {
      console.error('Create subscription session error:', error)
      throw error
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string) {
    try {
      const subscription = await getStripe().subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      })

      return subscription
    } catch (error) {
      console.error('Cancel subscription error:', error)
      throw error
    }
  }

  // Resume subscription
  static async resumeSubscription(subscriptionId: string) {
    try {
      const subscription = await getStripe().subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      })

      return subscription
    } catch (error) {
      console.error('Resume subscription error:', error)
      throw error
    }
  }

  // Get customer portal link
  static async createCustomerPortalSession(customerId: string) {
    try {
      const session = await getStripe().billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      })

      return session
    } catch (error) {
      console.error('Create customer portal session error:', error)
      throw error
    }
  }

  // Verify webhook signature
  static constructWebhookEvent(payload: string, signature: string) {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''
      return getStripe().webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (error) {
      console.error('Webhook verification error:', error)
      throw error
    }
  }
}
