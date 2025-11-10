import { supabaseAdmin } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * GET /api/referral
 * Get user's referral information, stats, and referral list
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')?.value

    if (!authToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from auth token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(authToken)
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's profile with referral code
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('referral_code, credits')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'Failed to fetch profile', details: profileError.message },
        { status: 500 }
      )
    }

    // Check if referral_code column exists
    if (!profile.referral_code) {
      console.error('Profile missing referral_code - migration may not have run')
      return NextResponse.json(
        { error: 'Referral system not initialized. Please contact support.' },
        { status: 500 }
      )
    }

    // Get referral statistics
    const { data: stats, error: statsError } = await supabaseAdmin
      .rpc('get_referral_stats', { p_user_id: user.id })

    if (statsError) {
      console.error('Stats RPC error:', statsError)
      // Don't fail if stats fail - continue with empty stats
      console.warn('Continuing with empty stats')
    }

    // Get list of referrals
    const { data: referrals, error: referralsError } = await supabaseAdmin
      .from('referrals')
      .select(`
        id,
        credits_awarded,
        status,
        created_at,
        referred:profiles!referrals_referred_id_fkey(name, email, created_at)
      `)
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })

    if (referralsError) {
      console.error('Referrals error:', referralsError)
    }

    // Generate referral link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const referralLink = `${baseUrl}/signup?ref=${profile.referral_code}`

    return NextResponse.json({
      referralCode: profile.referral_code,
      referralLink,
      stats: stats?.[0] || {
        total_referrals: 0,
        total_credits_earned: 0,
        pending_referrals: 0
      },
      referrals: referrals || [],
      currentCredits: profile.credits
    })
  } catch (error) {
    console.error('Referral API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
