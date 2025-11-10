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
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    // Get referral statistics
    const { data: stats, error: statsError } = await supabaseAdmin
      .rpc('get_referral_stats', { p_user_id: user.id })

    if (statsError) {
      console.error('Stats error:', statsError)
      return NextResponse.json(
        { error: 'Failed to fetch referral stats' },
        { status: 500 }
      )
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
