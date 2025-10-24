import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { withRateLimit, RateLimits } from '@/backend/utils/rateLimit'

export const POST = withRateLimit(RateLimits.AUTH, async (request: NextRequest) => {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: 'Login failed' },
        { status: 401 }
      )
    }

    // Get user profile using ADMIN client to bypass RLS
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      
      // If profile doesn't exist, create it
      if (profileError.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name || 'User',
            credits: 10,
            plan: 'free'
          })
          .select()
          .single()
        
        if (createError) {
          console.error('Profile creation error:', createError)
          return NextResponse.json(
            { error: 'Failed to create user profile' },
            { status: 500 }
          )
        }
        
        // Use the newly created profile
        const response = NextResponse.json({
          user: {
            id: data.user.id,
            email: data.user.email,
            name: newProfile.name,
            plan: newProfile.plan,
            credits: newProfile.credits,
            is_admin: newProfile.is_admin || false,
            createdAt: data.user.created_at,
          },
          // NO TOKEN in response - httpOnly cookies only (XSS-proof)
        })

        // Set httpOnly cookies
        response.cookies.set('auth_token', data.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/'
        })

        if (data.session.refresh_token) {
          response.cookies.set('refresh_token', data.session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/'
          })
        }

        return response
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      )
    }

    // Create response with httpOnly cookie (PRODUCTION-SECURE: No token in response body)
    const response = NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile.name,
        plan: profile.plan,
        credits: profile.credits,
        is_admin: profile.is_admin || false,
        createdAt: data.user.created_at,
      },
      // NO TOKEN in response - it's in httpOnly cookies only (XSS-proof)
    })

    // Set httpOnly cookie for access token (secure, not accessible via JavaScript)
    response.cookies.set('auth_token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    // Set refresh token cookie
    if (data.session.refresh_token) {
      response.cookies.set('refresh_token', data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })
    }

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
})
