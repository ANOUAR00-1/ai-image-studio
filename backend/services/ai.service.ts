// Unified AI service - 100% FREE providers with smart fallbacks!
import { PollinationsService } from './pollinations.service'
import { SmartFallbackService } from './smart-fallback.service'

export type AIProvider = 'pollinations' | 'huggingface' | 'auto'

export class AIService {
  // Smart provider selection with fallbacks
  static selectProvider(): AIProvider {
    return 'auto' // Auto-select best available provider
  }

  // Generate image with smart fallbacks - 100% FREE!
  static async generateImage(
    prompt: string,
    model?: string
  ): Promise<string | Blob> {
    console.log(`🎨 Generating image with smart fallbacks...`)

    // Try providers in order until one works
    
    // 1. Try Pollinations first (no API key needed, fast)
    try {
      console.log('  → Trying Pollinations.ai (100% FREE, no key needed)...')
      const result = await PollinationsService.generateImage(prompt, model || 'flux')
      console.log('  ✅ Pollinations success!')
      return result
    } catch (pollinationsError) {
      console.log('  ⚠️ Pollinations failed, trying HuggingFace...', pollinationsError instanceof Error ? pollinationsError.message : '')
    }

    // 2. Fallback to HuggingFace + Gemini enhancement
    try {
      console.log('  → Trying HuggingFace with Gemini prompt enhancement...')
      const { imageUrl } = await SmartFallbackService.generateImage(prompt)
      console.log('  ✅ HuggingFace success!')
      return imageUrl
    } catch (fallbackError) {
      console.error('  ❌ All providers failed:', fallbackError)
      throw new Error('Unable to generate image. Please try again in a few moments.')
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
