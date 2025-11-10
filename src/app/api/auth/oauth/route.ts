import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const { provider } = await request.json()

    if (!provider || !['google', 'github'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      )
    }

    // Get the origin for redirect
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Initiate OAuth flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'google' | 'github',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('OAuth error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Return the OAuth URL to redirect to
    return NextResponse.json({
      url: data.url,
    })
  } catch (error) {
    console.error('OAuth API error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    )
  }
}
