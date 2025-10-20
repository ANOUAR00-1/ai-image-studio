import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('Resending OTP to:', email)

    // Resend OTP
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) {
      console.error('Resend OTP error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to resend code' },
        { status: 400 }
      )
    }

    console.log('OTP resent successfully to:', email)

    return NextResponse.json({
      message: 'Verification code sent! Check your email.',
    })
  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
