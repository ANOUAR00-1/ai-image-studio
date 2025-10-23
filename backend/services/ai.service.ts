// Unified AI service - 100% FREE providers only!
import { PollinationsService } from './pollinations.service'

export type AIProvider = 'pollinations' | 'auto'

export class AIService {
  // Smart provider selection - always FREE!
  static selectProvider(): AIProvider {
    // We only use 100% FREE services!
    // Pollinations.ai - No API key needed, unlimited, always works!
    return 'pollinations'
  }

  // Generate image - 100% FREE with Pollinations!
  static async generateImage(
    prompt: string,
    model?: string
  ): Promise<string | Blob> {
    console.log(`🎨 Generating image with Pollinations.ai (100% FREE!)...`)

    try {
      // Always use Pollinations - 100% free, no API key needed!
      return await PollinationsService.generateImage(prompt, model || 'flux')
    } catch (error) {
      console.error('❌ AI image generation failed:', error)
      throw error
    }
  }

  // Video generation not supported (would require paid APIs)
  static async generateVideo(): Promise<string> {
    throw new Error('Video generation requires paid APIs. Use image generation instead (100% free!)')
  }

  // Get all available FREE models
  static getAllModels() {
    const models: {
      images: Array<{ id: string; name: string; credits: number; description: string; provider: string }>
      videos: Array<{ id: string; name: string; credits: number; description: string; provider: string }>
    } = {
      images: [],
      videos: [],
    }

    // Add Pollinations models (100% free, no API key needed!)
    const pollinationsModels = PollinationsService.getAvailableModels()
    models.images.push(...pollinationsModels.images.map(m => ({ ...m, provider: 'pollinations' })))

    return models
  }
}
