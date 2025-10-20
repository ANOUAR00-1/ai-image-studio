import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json()

    // Validate input
    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      )
    }

    console.log('Verifying OTP for:', email)

    // Verify the OTP token
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    })

    if (error) {
      console.error('OTP verification error:', error)
      return NextResponse.json(
        { error: error.message || 'Invalid verification code' },
        { status: 400 }
      )
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 400 }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    console.log('OTP verified successfully for:', email)

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.user_metadata?.name,
        plan: profile?.plan || 'free',
        credits: profile?.credits || 10,
        createdAt: data.user.created_at,
      },
      session: data.session,
      accessToken: data.session.access_token,
      message: 'Email verified successfully!',
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
