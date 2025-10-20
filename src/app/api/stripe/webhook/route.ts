import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { ApiResponse } from '@/backend/utils/response'
import { StripeService } from '@/backend/services/stripe.service'
import { CreditsService } from '@/backend/services/credits.service'
import { SubscriptionService } from '@/backend/services/subscription.service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return ApiResponse.error('No signature', 400)
    }

    // Verify webhook
    const event = StripeService.constructWebhookEvent(body, signature)

    console.log('Stripe webhook event:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.metadata?.type === 'credit_purchase') {
          // Add credits to user
          const userId = session.metadata.userId
          const credits = parseInt(session.metadata.credits)
          
          await CreditsService.addCredits(
            userId,
            credits,
            'purchase',
            `Purchased ${credits} credits`
          )
          
          console.log(`Added ${credits} credits to user ${userId}`)
        } else if (session.metadata?.plan) {
          // Handle subscription creation
          const userId = session.metadata.userId
          const plan = session.metadata.plan
          
          // Update user plan
          await SubscriptionService.updateUserPlan(
            userId,
            plan as 'pro' | 'business',
            plan === 'pro' ? 200 : 1000
          )
          
          console.log(`Upgraded user ${userId} to ${plan}`)
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Handle subscription changes
        console.log('Subscription event:', subscription.id, subscription.status)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        // Handle successful payment
        console.log('Payment succeeded:', invoice.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        // Handle failed payment
        console.log('Payment failed:', invoice.id)
        break
      }
    }

    return ApiResponse.success({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return ApiResponse.error('Webhook error', 400)
  }
}
