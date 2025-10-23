import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { withRateLimit, RateLimits } from '@/backend/utils/rateLimit'

export const POST = withRateLimit(RateLimits.AUTH, async (request: NextRequest) => {
  try {
    const body = await request.json()
    console.log('Signup request received:', { email: body.email, name: body.name })
    
    const { email, password, name } = body

    // Validate input
    if (!email || !password || !name) {
      console.log('Validation failed: Missing fields')
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Strong password validation
    if (password.length < 8) {
      console.log('Validation failed: Password too short')
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    if (!passwordRegex.test(password)) {
      console.log('Validation failed: Password complexity requirements not met')
      return NextResponse.json(
        { error: 'Password must include uppercase, lowercase, number, and special character (@$!%*?&)' },
        { status: 400 }
      )
    }
    
    console.log('Calling Supabase signUp...')

    // Sign up user with Supabase Auth - with OTP verification
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
        // Use email OTP instead of magic link
        emailRedirectTo: undefined,
      },
    })

    if (error) {
      console.error('Supabase signup error:', error)
      return NextResponse.json(
        { 
          error: error.message,
          details: 'Check if Supabase is configured correctly and schema.sql has been run'
        },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Get the user profile (created automatically by trigger) using ADMIN client
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      // Profile will be null, we'll use defaults
    }

    // Check if email confirmation is required (session will be null if confirmation needed)
    const requiresEmailConfirmation = !data.session
    
    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || name,
        plan: profile?.plan || 'free',
        credits: profile?.credits || 10,
        createdAt: data.user.created_at,
      },
      session: data.session,
      accessToken: data.session?.access_token,
      requiresEmailConfirmation,
      message: requiresEmailConfirmation 
        ? 'Account created! Please check your email to verify your account.'
        : 'Account created successfully!',
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
})
