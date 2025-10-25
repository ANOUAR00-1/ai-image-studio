import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/backend/utils/response'
import { addCorsHeaders } from '@/backend/utils/cors'
import { ImageProcessingService } from '@/backend/services/image-processing.service'
import { CreditsService } from '@/backend/services/credits.service'
import { supabaseAdmin } from '@/lib/supabase/server'

export const maxDuration = 60

// OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 })
  return addCorsHeaders(response, request.headers.get('origin') || undefined)
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Remove-background endpoint called')
    
    // Try multiple auth methods
    let token: string | undefined

    // Method 1: Check Authorization header
    const authHeader = request.headers.get('authorization')
    console.log('🔍 Auth header present:', !!authHeader)
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7)
      console.log('✅ Token from Authorization header:', token.slice(0, 30) + '...')
    }

    // Method 2: Check Supabase auth cookies
    if (!token) {
      // Try different Supabase cookie patterns
      const cookieNames = [
        'sb-access-token',
        'sb_access_token',
        `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`
      ]
      
      for (const cookieName of cookieNames) {
        if (cookieName) {
          const cookieValue = request.cookies.get(cookieName)?.value
          if (cookieValue) {
            // If it's a JSON string, parse it to get access_token
            try {
              const parsed = JSON.parse(cookieValue)
              token = parsed.access_token || parsed
              console.log(`✅ Token from ${cookieName} cookie`)
              break
            } catch {
              // Not JSON, use as-is
              token = cookieValue
              console.log(`✅ Token from ${cookieName} cookie (raw)`)
              break
            }
          }
        }
      }
    }

    if (!token) {
      console.error('❌ No auth token found in headers or cookies')
      console.error('Available headers:', Array.from(request.headers.keys()))
      console.error('Available cookies:', request.cookies.getAll().map(c => c.name))
      const response = ApiResponse.unauthorized()
      return addCorsHeaders(response, request.headers.get('origin') || undefined)
    }

    // Verify token and get user
    console.log('🔍 Verifying token with Supabase...')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      console.error('❌ Auth error:', authError?.message || 'Unknown error')
      console.error('Token preview:', token.slice(0, 30) + '...')
      const response = ApiResponse.unauthorized()
      return addCorsHeaders(response, request.headers.get('origin') || undefined)
    }

    console.log('✅ User authenticated:', user.id)
    const userId = user.id

    // Get image from request
    const body = await request.json()
    const { image } = body

    if (!image) {
      const response = ApiResponse.validationError('Image is required')
      return addCorsHeaders(response, request.headers.get('origin') || undefined)
    }

    // Validate image is base64
    if (!image.startsWith('data:image/')) {
      const response = ApiResponse.validationError('Invalid image format. Must be base64 data URL')
      return addCorsHeaders(response, request.headers.get('origin') || undefined)
    }

    // Check if user is admin
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single()

    const isAdmin = profile?.is_admin || false

    // Check credits (2 credits for background removal)
    const creditsRequired = 2
    
    if (!isAdmin) {
      const hasCredits = await CreditsService.hasEnoughCredits(userId, creditsRequired)
      if (!hasCredits) {
        const available = await CreditsService.getUserCredits(userId)
        const response = ApiResponse.insufficientCredits(creditsRequired, available)
        return addCorsHeaders(response, request.headers.get('origin') || undefined)
      }

      // Deduct credits
      await CreditsService.deductCredits(userId, creditsRequired, 'remove_background')
    } else {
      console.log('Admin user - skipping credit deduction')
    }

    // Process image
    console.log('🎨 Removing background for user:', userId)
    const processedImage = await ImageProcessingService.removeBackground(image)

    // Get updated credits
    const remainingCredits = isAdmin ? -1 : await CreditsService.getUserCredits(userId)

    const response = ApiResponse.success({
      imageUrl: processedImage,
      creditsUsed: isAdmin ? 0 : creditsRequired,
      remainingCredits,
    })
    return addCorsHeaders(response, request.headers.get('origin') || undefined)

  } catch (error) {
    console.error('Remove background error:', error)
    
    const response = ApiResponse.error(
      error instanceof Error ? error.message : 'Failed to remove background',
      500
    )
    return addCorsHeaders(response, request.headers.get('origin') || undefined)
  }
}
