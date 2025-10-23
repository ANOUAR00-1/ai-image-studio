// Unified AI service that chooses the best FREE provider
import { HuggingFaceService } from './huggingface.service'
import { ReplicateService } from './replicate.service'
import { TogetherService } from './together.service'
import { HFSpacesService } from './hfspaces.service'

export type AIProvider = 'together' | 'huggingface' | 'replicate' | 'hfspaces' | 'auto'

export class AIService {
  // Smart provider selection
  static selectProvider(): AIProvider {
    // Check which API keys are available
    const hasTogether = !!process.env.TOGETHER_API_KEY
    const hasHuggingFace = !!process.env.HUGGINGFACE_API_KEY
    const hasReplicate = !!process.env.REPLICATE_API_TOKEN

    // Priority: Together AI (best) > HuggingFace > Replicate > HF Spaces (fallback, always available)
    if (hasTogether) return 'together'
    if (hasHuggingFace) return 'huggingface'
    if (hasReplicate) return 'replicate'
    
    // Fallback to HF Spaces (100% free, no API key needed!)
    return 'hfspaces'
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
      if (selectedProvider === 'together') {
        // Together AI returns base64 or URL
        return await TogetherService.generateImage(prompt, model || 'stabilityai/stable-diffusion-xl-base-1.0')
      } else if (selectedProvider === 'replicate') {
        // Replicate returns URL directly
        return await ReplicateService.generateImage(prompt, model || 'sdxl')
      } else if (selectedProvider === 'hfspaces') {
        // HF Spaces returns URL or base64 (100% FREE!)
        return await HFSpacesService.generateImage(prompt, model || 'sdxl')
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

    if (process.env.TOGETHER_API_KEY) {
      const togetherModels = TogetherService.getAvailableModels()
      models.images.push(...togetherModels.images.map(m => ({ ...m, provider: 'together' })))
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

    // Always add HF Spaces (100% free, no API key needed!)
    const hfSpacesModels = HFSpacesService.getAvailableModels()
    models.images.push(...hfSpacesModels.images.map(m => ({ ...m, provider: 'hfspaces' })))

    return models
  }
}
