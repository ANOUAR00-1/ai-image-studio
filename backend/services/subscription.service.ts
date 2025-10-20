import { supabaseAdmin } from '@/lib/supabase/server'

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  stripe_price_id?: string
  status?: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_start?: string
  current_period_end?: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export class SubscriptionService {
  // Get user subscription
  static async getUserSubscription(userId: string): Promise<Subscription | null> {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Create subscription
  static async createSubscription(
    userId: string,
    stripeCustomerId: string,
    stripeSubscriptionId: string,
    stripePriceId: string,
    status: 'active' | 'trialing',
    currentPeriodStart: Date,
    currentPeriodEnd: Date
  ): Promise<Subscription> {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        stripe_price_id: stripePriceId,
        status,
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        cancel_at_period_end: false,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update subscription
  static async updateSubscription(
    userId: string,
    updates: Partial<Subscription>
  ): Promise<Subscription> {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Cancel subscription
  static async cancelSubscription(userId: string): Promise<Subscription> {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update user plan based on subscription
  static async updateUserPlan(
    userId: string,
    plan: 'free' | 'pro' | 'business',
    credits?: number
  ): Promise<void> {
    const updates: Record<string, unknown> = { plan }
    if (credits !== undefined) updates.credits = credits

    const { error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (error) throw error
  }
}
