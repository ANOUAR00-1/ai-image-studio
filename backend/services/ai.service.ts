// Unified AI service that chooses the best FREE provider
import { HuggingFaceService } from './huggingface.service'
import { ReplicateService } from './replicate.service'

export type AIProvider = 'huggingface' | 'replicate' | 'auto'

export class AIService {
  // Smart provider selection
  static selectProvider(): AIProvider {
    // Check which API keys are available
    const hasHuggingFace = !!process.env.HUGGINGFACE_API_KEY
    const hasReplicate = !!process.env.REPLICATE_API_TOKEN

    // Use HuggingFace first (more reliable free tier)
    if (hasHuggingFace) return 'huggingface'
    if (hasReplicate) return 'replicate'
    
    throw new Error('No AI provider configured. Add HUGGINGFACE_API_KEY or REPLICATE_API_TOKEN to .env.local')
  }

  // Generate image (automatically picks best provider)
  static async generateImage(
    prompt: string,
    model?: string,
    provider: AIProvider = 'auto'
  ): Promise<string | Blob> {
    const selectedProvider = provider === 'auto' ? this.selectProvider() : provider

    console.log(`Generating image with ${selectedProvider}...`)

    try {
      if (selectedProvider === 'replicate') {
        // Replicate returns URL directly
        return await ReplicateService.generateImage(prompt, model || 'sdxl')
      } else {
        // HuggingFace returns Blob
        const blob = await HuggingFaceService.generateImage(
          prompt,
          model || 'stabilityai/stable-diffusion-xl-base-1.0'
        )
        
        // If storage is not available, convert to base64
        // Otherwise return blob for upload
        if (process.env.USE_BASE64_IMAGES === 'true') {
          return await HuggingFaceService.blobToBase64(blob)
        }
        
        return blob
      }
    } catch (error) {
      console.error('AI image generation failed:', error)
      throw error
    }
  }

  // Generate video (Replicate only for now)
  static async generateVideo(prompt: string, model?: string): Promise<string> {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('Video generation requires REPLICATE_API_TOKEN')
    }

    return await ReplicateService.generateVideo(prompt, model || 'stable-video')
  }

  // Get all available models from all providers
  static getAllModels() {
    const models: {
      images: Array<{ id: string; name: string; credits: number; description: string; provider: string }>
      videos: Array<{ id: string; name: string; credits: number; description: string; provider: string }>
    } = {
      images: [],
      videos: [],
    }

    if (process.env.HUGGINGFACE_API_KEY) {
      const hfModels = HuggingFaceService.getAvailableModels()
      models.images.push(...hfModels.images.map(m => ({ ...m, provider: 'huggingface' })))
    }

    if (process.env.REPLICATE_API_TOKEN) {
      const repModels = ReplicateService.getAvailableModels()
      models.images.push(...repModels.images.map(m => ({ ...m, provider: 'replicate' })))
      models.videos.push(...repModels.videos.map(m => ({ ...m, provider: 'replicate' })))
    }

    return models
  }
}
