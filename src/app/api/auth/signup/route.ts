import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: Request) {
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

    if (password.length < 6) {
      console.log('Validation failed: Password too short')
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
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

    // Get the user profile (created automatically by trigger)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
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
}
