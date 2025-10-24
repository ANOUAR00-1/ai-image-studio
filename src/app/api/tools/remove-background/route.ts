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
    // Try multiple auth methods
    let token: string | undefined

    // Method 1: Check Authorization header
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    }

    // Method 2: Check cookies
    if (!token) {
      token = request.cookies.get('sb-access-token')?.value
    }

    // Method 3: Check alternative cookie names
    if (!token) {
      token = request.cookies.get('sb_access_token')?.value
    }

    if (!token) {
      console.error('No auth token found in headers or cookies')
      const response = ApiResponse.unauthorized()
      return addCorsHeaders(response, request.headers.get('origin') || undefined)
    }

    // Verify token and get user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      console.error('Auth error:', authError, 'Token:', token.slice(0, 20) + '...')
      const response = ApiResponse.unauthorized()
      return addCorsHeaders(response, request.headers.get('origin') || undefined)
    }

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
