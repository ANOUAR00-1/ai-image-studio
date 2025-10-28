import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/backend/utils/response'
import { addCorsHeaders } from '@/backend/utils/cors'
import { FreeImageToolsService } from '@/backend/services/free-image-tools.service'
import { CreditsService } from '@/backend/services/credits.service'
import { supabaseAdmin } from '@/lib/supabase/server'

const CREDIT_COST = 2 // Background removal costs 2 credits

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
      console.error('❌ Auth error:', authError?.message || 'Unknown error')
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

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎨 BACKGROUND REMOVAL REQUEST')
    console.log(`   User: ${userId}`)
    console.log(`   Image size: ${(image.length / 1024).toFixed(2)} KB`)
    console.log(`   Credits required: ${CREDIT_COST}`)

    // Check credits
    const hasCredits = await CreditsService.hasEnoughCredits(userId, CREDIT_COST)
    if (!hasCredits) {
      const available = await CreditsService.getUserCredits(userId)
      console.log(`❌ Insufficient credits: ${available} available, ${CREDIT_COST} required`)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      const response = ApiResponse.insufficientCredits(CREDIT_COST, available)
      return addCorsHeaders(response, request.headers.get('origin') || undefined)
    }

    // Deduct credits
    await CreditsService.deductCredits(userId, CREDIT_COST, 'Background removal')
    console.log(`✅ Credits deducted: ${CREDIT_COST}`)

    // Process image
    console.log('🤖 Processing with RMBG-1.4 model...')
    console.log('   Provider: HuggingFace Inference API')
    console.log('   Model: briaai/RMBG-1.4')
    
    const processedImage = await FreeImageToolsService.removeBackground(image)
    
    console.log('✅ Background removed successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    const response = ApiResponse.success({
      image: processedImage,
      model: 'RMBG-1.4',
      provider: 'huggingface',
      creditsUsed: CREDIT_COST,
      remainingCredits: await CreditsService.getUserCredits(userId),
    })
    return addCorsHeaders(response, request.headers.get('origin') || undefined)

  } catch (error) {
    console.error('❌ Remove background error:', error)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    const response = ApiResponse.error(
      error instanceof Error ? error.message : 'Failed to remove background',
      500
    )
    return addCorsHeaders(response, request.headers.get('origin') || undefined)
  }
}
