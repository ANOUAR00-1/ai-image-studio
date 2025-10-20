import { NextRequest } from 'next/server'
import { withAuth } from '@/backend/utils/middleware'
import { ApiResponse } from '@/backend/utils/response'
import { CreditsService } from '@/backend/services/credits.service'
import { GenerationService } from '@/backend/services/generation.service'
import { AIService } from '@/backend/services/ai.service'
import { CREDIT_COSTS } from '@/backend/config/constants'

export const POST = withAuth(async (request: NextRequest, { userId }) => {
  try {
    const body = await request.json()
    const { prompt, model = 'stable-video' } = body

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      return ApiResponse.validationError('Prompt is required')
    }

    if (prompt.length > 1000) {
      return ApiResponse.validationError('Prompt must be less than 1000 characters')
    }

    // Get credit cost for the model
    const creditCost = (CREDIT_COSTS.VIDEO_GENERATION as Record<string, number>)[model] || 8

    // Check if user has enough credits
    const hasCredits = await CreditsService.hasEnoughCredits(userId, creditCost)
    if (!hasCredits) {
      const available = await CreditsService.getUserCredits(userId)
      return ApiResponse.insufficientCredits(creditCost, available)
    }

    // Deduct credits first
    const deductSuccess = await CreditsService.deductCredits(
      userId,
      creditCost,
      `Video generation with ${model}`
    )

    if (!deductSuccess) {
      return ApiResponse.error('Failed to deduct credits. Please try again.')
    }

    // Create generation record
    const generation = await GenerationService.createGeneration(
      userId,
      'video',
      prompt,
      model,
      creditCost
    )

    // Generate video with AI
    try {
      console.log(`Generating video for user ${userId} with model ${model}`)
      
      const videoUrl = await AIService.generateVideo(prompt, model)
      
      // Update generation record with result
      await GenerationService.updateGenerationStatus(
        generation.id,
        'completed',
        videoUrl
      )

      console.log(`Video generated successfully: ${generation.id}`)

      return ApiResponse.success({
        generation: {
          id: generation.id,
          url: videoUrl,
          prompt,
          model,
          creditsUsed: creditCost,
          createdAt: generation.created_at,
        },
        remainingCredits: await CreditsService.getUserCredits(userId),
      })
    } catch (aiError) {
      // AI generation failed - refund credits
      console.error('AI video generation error:', aiError)
      
      await CreditsService.addCredits(
        userId,
        creditCost,
        'refund',
        'Refund for failed video generation'
      )
      
      await GenerationService.updateGenerationStatus(generation.id, 'failed')

      return ApiResponse.error(
        'Failed to generate video. Your credits have been refunded.',
        500
      )
    }
  } catch (error) {
    console.error('Video generation endpoint error:', error)
    return ApiResponse.serverError()
  }
})

// GET endpoint to list available video models
export const GET = withAuth(async (_request: NextRequest, { userId }) => {
  try {
    const models = AIService.getAllModels()
    const userCredits = await CreditsService.getUserCredits(userId)

    return ApiResponse.success({
      models: models.videos,
      userCredits,
    })
  } catch (error) {
    console.error('Get video models error:', error)
    return ApiResponse.serverError()
  }
})
