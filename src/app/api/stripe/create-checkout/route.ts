import { NextRequest } from 'next/server'
import { withAuth } from '@/backend/utils/middleware'
import { ApiResponse } from '@/backend/utils/response'
import { StripeService } from '@/backend/services/stripe.service'
import { AuthService } from '@/backend/services/auth.service'

export const POST = withAuth(async (request: NextRequest, { userId }) => {
  try {
    const body = await request.json()
    const { type, plan, credits, price } = body

    // Get user profile
    const profile = await AuthService.getUserProfile(userId)
    if (!profile || !profile.email) {
      return ApiResponse.error('User profile not found')
    }

    let session

    if (type === 'subscription') {
      // Create subscription checkout
      if (!plan || !['pro', 'business'].includes(plan)) {
        return ApiResponse.validationError('Invalid plan')
      }
      
      session = await StripeService.createSubscriptionCheckoutSession(
        userId,
        profile.email,
        plan as 'pro' | 'business'
      )
    } else if (type === 'credits') {
      // Create credit purchase checkout
      if (!credits || !price) {
        return ApiResponse.validationError('Credits and price required')
      }
      
      session = await StripeService.createCreditCheckoutSession(
        userId,
        profile.email,
        credits,
        price
      )
    } else {
      return ApiResponse.validationError('Invalid checkout type')
    }

    return ApiResponse.success({ url: session.url })
  } catch (error) {
    console.error('Create checkout error:', error)
    return ApiResponse.serverError()
  }
})
