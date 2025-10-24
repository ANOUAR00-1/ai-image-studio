import { withAdmin } from '@/backend/utils/middleware'
import { ApiResponse } from '@/backend/utils/response'
import { supabaseAdmin } from '@/lib/supabase/server'

export const GET = withAdmin(async () => {
  try {
    // Fetch all credit transactions (purchases)
    const { data: payments, error } = await supabaseAdmin
      .from('credit_transactions')
      .select(`
        *,
        profiles:user_id (
          email,
          name,
          plan
        )
      `)
      .in('type', ['purchase', 'subscription'])
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    // Format the data
    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      user_email: payment.profiles?.email || 'Unknown',
      user_name: payment.profiles?.name || 'Unknown',
      amount: Math.abs(payment.amount) * 0.10, // Convert credits to dollars (example: 10 credits = $1)
      credits: Math.abs(payment.amount),
      plan: payment.profiles?.plan || 'free',
      status: 'completed', // All logged transactions are completed
      payment_method: 'Credit Card',
      created_at: payment.created_at
    }))

    return ApiResponse.success({ payments: formattedPayments })
  } catch (error) {
    console.error('Failed to fetch payments:', error)
    return ApiResponse.serverError()
  }
})
