import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/backend/utils/middleware'
import { withRateLimit, RateLimits } from '@/backend/utils/rateLimit'
import { addCorsHeaders } from '@/backend/utils/cors'
import { ApiResponse } from '@/backend/utils/response'
import { CreditsService } from '@/backend/services/credits.service'
import { GenerationService } from '@/backend/services/generation.service'
import { AIService } from '@/backend/services/ai.service'
import { StorageService } from '@/backend/services/storage.service'
import { CREDIT_COSTS } from '@/backend/config/constants'

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 })
  return addCorsHeaders(response, request.headers.get('origin') || undefined)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const imageGenerationHandler = withRateLimit(RateLimits.GENERATION, withAuth(async (request: NextRequest, { userId }: any) => {
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
      console.log(`🎨 Generating image for user ${userId}`)
      console.log(`   Model requested: ${model}`)
      console.log(`   Mapped to: ${actualModel}`)
      console.log(`   Prompt: ${prompt.substring(0, 50)}...`)
      
      // Generate image with smart fallbacks
      const imageResult = await AIService.generateImage(prompt, actualModel)
      
      // Track which provider was actually used
      let usedProvider = 'unknown'
      let imageUrl: string
      
      if (imageResult instanceof Blob) {
        usedProvider = 'pollinations' // Pollinations returns Blob
        console.log('✅ Image generated with Pollinations.ai (Blob)')
        console.log('📤 Uploading to storage...')
        // Upload to Supabase Storage
        try {
          imageUrl = await StorageService.uploadGeneratedImage(userId, imageResult)
          console.log('✅ Image uploaded successfully:', imageUrl)
        } catch (uploadError) {
          console.error('⚠️ Storage upload failed, falling back to base64:', uploadError)
          // Fallback to base64 if storage fails
          const buffer = await imageResult.arrayBuffer()
          const base64 = Buffer.from(buffer).toString('base64')
          imageUrl = `data:image/jpeg;base64,${base64}`
        }
      } else {
        usedProvider = 'huggingface' // HuggingFace returns base64 string
        imageUrl = imageResult
        console.log('✅ Image generated with HuggingFace (base64)')
      }
      
      // Update generation record with result
      await GenerationService.updateGenerationStatus(
        generation.id,
        'completed',
        imageUrl
      )

      console.log(`✅ Generation complete!`)
      console.log(`   Generation ID: ${generation.id}`)
      console.log(`   Provider used: ${usedProvider}`)
      console.log(`   Credits charged: ${creditCost}`)

      return ApiResponse.success({
        generation: {
          id: generation.id,
          url: imageUrl,
          prompt,
          model,
          provider: usedProvider, // NEW: Tell frontend which provider was used
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

// Wrap with CORS headers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const POST = async (request: NextRequest, context: any) => {
  const response = await imageGenerationHandler(request, context)
  return addCorsHeaders(response, request.headers.get('origin') || undefined)
}

// GET endpoint to list available models
const getModelsHandler = withAuth(async (_request: NextRequest, { userId }) => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GET = async (request: NextRequest, context: any) => {
  const response = await getModelsHandler(request, context)
  return addCorsHeaders(response, request.headers.get('origin') || undefined)
}
