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
    console.log(`📝 Prompt: "${prompt.substring(0, 80)}${prompt.length > 80 ? '...' : ''}"`)
    console.log(`🎯 Model requested: ${model || 'default'}`)

    // Try providers in order until one works
    
    // 1. Try Pollinations first (no API key needed, fast)
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('  🌸 ATTEMPT #1: Pollinations.ai')
      console.log('     • 100% FREE')
      console.log('     • No API key needed')
      console.log('     • Model: Flux')
      const result = await PollinationsService.generateImage(prompt, model || 'flux')
      console.log('  ✅ SUCCESS! Image generated with Pollinations.ai')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      return result
    } catch (pollinationsError) {
      console.log('  ❌ Pollinations.ai failed:', pollinationsError instanceof Error ? pollinationsError.message : 'Unknown error')
      console.log('  ↓ Falling back to HuggingFace...')
    }

    // 2. Fallback to HuggingFace + Gemini enhancement
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('  🤗 ATTEMPT #2: HuggingFace')
      console.log('     • FREE with API key')
      console.log('     • Includes Gemini prompt enhancement')
      console.log('     • Model: Stable Diffusion XL')
      const { imageUrl, provider } = await SmartFallbackService.generateImage(prompt)
      console.log(`  ✅ SUCCESS! Image generated with ${provider}`)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      return imageUrl
    } catch (fallbackError) {
      console.log('  ❌ HuggingFace also failed:', fallbackError instanceof Error ? fallbackError.message : 'Unknown error')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('  ❌ ALL PROVIDERS FAILED!')
      console.error('  Please check:')
      console.error('    1. HUGGINGFACE_API_KEY is set')
      console.error('    2. Internet connection is working')
      console.error('    3. Providers are not rate-limited')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      throw new Error('Unable to generate image. All AI providers are currently unavailable. Please try again in a few moments.')
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
