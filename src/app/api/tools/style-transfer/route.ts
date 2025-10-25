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
    // Get token from httpOnly cookie (same as /api/auth/me)
    let token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      // Fallback to Authorization header
      const authHeader = request.headers.get('authorization')
      token = authHeader?.replace('Bearer ', '')
    }

    if (!token) {
      console.error('❌ No auth token found')
      const response = ApiResponse.unauthorized()
      return addCorsHeaders(response, request.headers.get('origin') || undefined)
    }

    // Verify token and get user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      console.error('❌ Auth error:', authError?.message)
      const response = ApiResponse.unauthorized()
      return addCorsHeaders(response, request.headers.get('origin') || undefined)
    }

    const userId = user.id

    // Get image and style from request
    const body = await request.json()
    const { image, style = 'anime' } = body

    if (!image) {
      const response = ApiResponse.validationError('Image is required')
      return addCorsHeaders(response, request.headers.get('origin') || undefined)
    }

    // Check if user is admin
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single()

    const isAdmin = profile?.is_admin || false

    // Check credits (3 credits for style transfer)
    const creditsRequired = 3
    
    if (!isAdmin) {
      const hasCredits = await CreditsService.hasEnoughCredits(userId, creditsRequired)
      if (!hasCredits) {
        const available = await CreditsService.getUserCredits(userId)
        return ApiResponse.insufficientCredits(creditsRequired, available)
      }

      // Deduct credits
      await CreditsService.deductCredits(userId, creditsRequired, 'style_transfer')
    } else {
      console.log('Admin user - skipping credit deduction')
    }

    // Process image
    console.log(`🎨 Applying ${style} style for user:`, userId)
    const processedImage = await ImageProcessingService.styleTransfer(image, style)

    // Get updated credits
    const remainingCredits = isAdmin ? -1 : await CreditsService.getUserCredits(userId)

    const response = ApiResponse.success({
      imageUrl: processedImage,
      creditsUsed: isAdmin ? 0 : creditsRequired,
      remainingCredits,
    })
    return addCorsHeaders(response, request.headers.get('origin') || undefined)

  } catch (error) {
    console.error('Style transfer error:', error)
    
    const response = ApiResponse.error(
      error instanceof Error ? error.message : 'Failed to apply style transfer',
      500
    )
    return addCorsHeaders(response, request.headers.get('origin') || undefined)
  }
}
