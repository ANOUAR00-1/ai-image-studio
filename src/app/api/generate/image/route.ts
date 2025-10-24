import { NextRequest } from 'next/server'
import { withAuth } from '@/backend/utils/middleware'
import { withRateLimit, RateLimits } from '@/backend/utils/rateLimit'
import { ApiResponse } from '@/backend/utils/response'
import { CreditsService } from '@/backend/services/credits.service'
import { GenerationService } from '@/backend/services/generation.service'
import { AIService } from '@/backend/services/ai.service'
import { StorageService } from '@/backend/services/storage.service'
import { CREDIT_COSTS } from '@/backend/config/constants'

export const POST = withRateLimit(RateLimits.GENERATION, withAuth(async (request: NextRequest, { userId }) => {
  try {
    const body = await request.json()
    const { prompt, model = 'sdxl' } = body

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      return ApiResponse.validationError('Prompt is required')
    }

    if (prompt.length > 1000) {
      return ApiResponse.validationError('Prompt must be less than 1000 characters')
    }

    // Map frontend model names to actual HuggingFace models
    const modelMap: Record<string, string> = {
      'generate': 'stabilityai/stable-diffusion-xl-base-1.0',
      'sdxl': 'stabilityai/stable-diffusion-xl-base-1.0',
      'sd2': 'stabilityai/stable-diffusion-2-1',
      'sd15': 'runwayml/stable-diffusion-v1-5',
    }
    
    const actualModel = modelMap[model] || model

    // Get credit cost for the model
    const creditCost = (CREDIT_COSTS.IMAGE_GENERATION as Record<string, number>)[model] || 2

    // Check if user has enough credits
    const hasCredits = await CreditsService.hasEnoughCredits(userId, creditCost)
    if (!hasCredits) {
      const available = await CreditsService.getUserCredits(userId)
      return ApiResponse.insufficientCredits(creditCost, available)
    }

    // Deduct credits first (atomic operation)
    const deductSuccess = await CreditsService.deductCredits(
      userId,
      creditCost,
      `Image generation with ${model}`
    )

    if (!deductSuccess) {
      return ApiResponse.error('Failed to deduct credits. Please try again.')
    }

    // Create generation record
    const generation = await GenerationService.createGeneration(
      userId,
      'image',
      prompt,
      model,
      creditCost
    )

    // Generate image with AI
    try {
      console.log(`Generating image for user ${userId} with model ${model} (mapped to ${actualModel})`)
      
      // Force Pollinations for text-to-image (skip HuggingFace)
      const imageResult = await AIService.generateImage(prompt, actualModel)
      
      // Handle both Blob and string responses
      let imageUrl: string
      
      if (imageResult instanceof Blob) {
        console.log('Uploading image to storage...')
        // Upload to Supabase Storage
        try {
          imageUrl = await StorageService.uploadGeneratedImage(userId, imageResult)
          console.log('Image uploaded successfully:', imageUrl)
        } catch (uploadError) {
          console.error('Storage upload failed, falling back to base64:', uploadError)
          // Fallback to base64 if storage fails
          const buffer = await imageResult.arrayBuffer()
          const base64 = Buffer.from(buffer).toString('base64')
          imageUrl = `data:image/jpeg;base64,${base64}`
        }
      } else {
        imageUrl = imageResult
      }
      
      // Update generation record with result
      await GenerationService.updateGenerationStatus(
        generation.id,
        'completed',
        imageUrl
      )

      console.log(`Image generated successfully: ${generation.id}`)

      return ApiResponse.success({
        generation: {
          id: generation.id,
          url: imageUrl,
          prompt,
          model,
          creditsUsed: creditCost,
          createdAt: generation.created_at,
        },
        remainingCredits: await CreditsService.getUserCredits(userId),
      })
    } catch (aiError) {
      // AI generation failed - refund credits
      console.error('AI generation error:', aiError)
      
      await CreditsService.addCredits(
        userId,
        creditCost,
        'refund',
        'Refund for failed image generation'
      )
      
      await GenerationService.updateGenerationStatus(generation.id, 'failed')

      return ApiResponse.error(
        'Failed to generate image. Your credits have been refunded.',
        500
      )
    }
  } catch (error) {
    console.error('Image generation endpoint error:', error)
    return ApiResponse.serverError()
  }
}))

// GET endpoint to list available models
export const GET = withAuth(async (_request: NextRequest, { userId }) => {
  try {
    const models = AIService.getAllModels()
    const userCredits = await CreditsService.getUserCredits(userId)

    return ApiResponse.success({
      models: models.images,
      userCredits,
    })
  } catch (error) {
    console.error('Get models error:', error)
    return ApiResponse.serverError()
  }
})
