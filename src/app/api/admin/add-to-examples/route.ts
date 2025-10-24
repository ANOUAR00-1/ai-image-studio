import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // PRODUCTION-SECURE: Read from httpOnly cookies only (no localStorage tokens)
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')?.value
    
    console.log('🔒 Cookie check:', { 
      hasCookie: !!authToken,
      tokenLength: authToken?.length 
    })
    
    if (!authToken) {
      console.log('❌ No auth cookie found - Please log in')
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - Please log in'
      }, { status: 401 })
    }
    
    // Verify token with Supabase admin client
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authToken)
    
    console.log('🔒 Token verification:', { 
      authenticated: !!user, 
      userId: user?.id,
      error: authError?.message
    })
    
    if (authError || !user) {
      console.log('❌ Authentication failed - Invalid or expired token')
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - Please log in again'
      }, { status: 401 })
    }
    
    console.log('✅ User authenticated securely:', user.id)

    // Check if user is admin using admin client
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Admin access required' 
      }, { status: 403 })
    }

    const body = await request.json()
    const { title, category, prompt, image_url, model, credits_used } = body

    // Validate required fields
    if (!title || !category || !prompt || !image_url) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Validate category
    const validCategories = ['portraits', 'landscapes', 'abstract', 'other']
    if (!validCategories.includes(category)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid category' 
      }, { status: 400 })
    }

    // Insert into examples table (use admin client for elevated permissions)
    const { data, error } = await supabaseAdmin
      .from('examples')
      .insert({
        title,
        category,
        prompt,
        image_url,
        model: model || 'flux',
        credits_used: credits_used || 0,
        is_featured: true
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding to examples:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to add to examples' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data: { example: data },
      message: 'Successfully added to examples showcase!'
    })

  } catch (error) {
    console.error('Add to examples error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
