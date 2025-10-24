import { NextRequest } from 'next/server'
import { withAuth } from '@/backend/utils/middleware'
import { ApiResponse } from '@/backend/utils/response'
import { ImageProcessingService } from '@/backend/services/image-processing.service'
import { CreditsService } from '@/backend/services/credits.service'
import { supabaseAdmin } from '@/lib/supabase/server'

export const maxDuration = 60

export const POST = withAuth(async (request: NextRequest, { userId }) => {
  try {
    // Get image from request
    const body = await request.json()
    const { image } = body

    if (!image) {
      return ApiResponse.error('Image is required', 400)
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
        return ApiResponse.insufficientCredits(creditsRequired, available)
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

    return ApiResponse.success({
      imageUrl: processedImage,
      creditsUsed: isAdmin ? 0 : creditsRequired,
      remainingCredits,
    })

  } catch (error) {
    console.error('Remove background error:', error)
    
    return ApiResponse.error(
      error instanceof Error ? error.message : 'Failed to remove background'
    )
  }
})
