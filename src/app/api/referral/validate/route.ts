import { supabaseAdmin } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/referral/validate
 * Validate a referral code
 */
export async function POST(request: NextRequest) {
  try {
    const { referralCode } = await request.json()

    if (!referralCode || typeof referralCode !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Invalid referral code format' },
        { status: 400 }
      )
    }

    // Check if referral code exists
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, name, referral_code')
      .eq('referral_code', referralCode.toUpperCase())
      .single()

    if (error || !profile) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid referral code'
      })
    }

    return NextResponse.json({
      valid: true,
      referrerName: profile.name,
      message: `You'll get 10 bonus credits when you sign up!`
    })
  } catch (error) {
    console.error('Validate referral error:', error)
    return NextResponse.json(
      { valid: false, error: 'Failed to validate referral code' },
      { status: 500 }
    )
  }
}
