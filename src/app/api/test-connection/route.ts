import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET() {
  try {
    // Test Supabase connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'NEXT_PUBLIC_SUPABASE_URL is not set',
        envCheck: {
          NEXT_PUBLIC_SUPABASE_URL: false,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: hasAnonKey
        }
      })
    }

    // Try to query Supabase
    const { error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Supabase query failed',
        error: error.message,
        hint: 'Did you run the schema.sql in Supabase SQL Editor?',
        envCheck: {
          NEXT_PUBLIC_SUPABASE_URL: true,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: hasAnonKey,
          supabaseUrl: supabaseUrl
        }
      })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection is working!',
      envCheck: {
        NEXT_PUBLIC_SUPABASE_URL: true,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: hasAnonKey,
        supabaseUrl: supabaseUrl
      },
      tableCheck: 'profiles table exists ✅'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error',
      error: String(error)
    })
  }
}
