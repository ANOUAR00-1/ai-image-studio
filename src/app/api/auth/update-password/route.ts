import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    const { password, accessToken } = await request.json()

    // Validate input
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 401 }
      )
    }

    // Update password using the token from reset email
    const { error } = await supabase.auth.updateUser(
      { password },
    )

    if (error) {
      console.error('Password update error:', error)
      return NextResponse.json(
        { error: 'Failed to update password. The reset link may have expired.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Password updated successfully! You can now login with your new password.',
    })
  } catch (error) {
    console.error('Update password error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
