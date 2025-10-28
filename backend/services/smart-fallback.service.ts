/**
 * Smart Fallback Service
 * Automatically switches between AI providers when one fails
 * User never sees errors - seamless experience!
 */

interface PromptEnhancementResult {
  enhanced: string
  provider: 'gemini' | 'huggingface' | 'local'
  fallbackUsed: boolean
}

export class SmartFallbackService {
  
  /**
   * Enhance prompt with intelligent fallback
   * 1. Try Gemini (best quality)
   * 2. Fallback to HuggingFace
   * 3. Final fallback to local enhancement
   */
  static async enhancePrompt(prompt: string): Promise<PromptEnhancementResult> {
    // Try Gemini first (best quality, free)
    try {
      console.log('🤖 Trying Gemini for prompt enhancement...')
      const enhanced = await this.enhanceWithGemini(prompt)
      console.log('✅ Gemini success!')
      return { enhanced, provider: 'gemini', fallbackUsed: false }
    } catch (geminiError) {
      console.log('⚠️ Gemini failed, trying HuggingFace...', geminiError instanceof Error ? geminiError.message : '')
    }

    // Fallback to HuggingFace
    try {
      console.log('🤖 Trying HuggingFace for prompt enhancement...')
      const enhanced = await this.enhanceWithHuggingFace(prompt)
      console.log('✅ HuggingFace success!')
      return { enhanced, provider: 'huggingface', fallbackUsed: true }
    } catch (hfError) {
      console.log('⚠️ HuggingFace failed, using local enhancement...', hfError instanceof Error ? hfError.message : '')
    }

    // Final fallback to local enhancement
    console.log('🔧 Using local prompt enhancement')
    const enhanced = this.enhanceLocally(prompt)
    return { enhanced, provider: 'local', fallbackUsed: true }
  }

  /**
   * Enhance prompt using Google Gemini
   */
  private static async enhanceWithGemini(prompt: string): Promise<string> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured')
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a professional AI image generation prompt expert. Enhance this prompt to create stunning, high-quality images. Keep it concise but detailed.

Original prompt: "${prompt}"

Enhanced prompt (respond with ONLY the enhanced prompt, no explanations):`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          }
        })
      }
    )
    
    console.log('🤖 Gemini API Response Status:', response.status)

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gemini API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    const enhanced = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    
    if (!enhanced) {
      throw new Error('No response from Gemini')
    }

    return enhanced
  }

  /**
   * Enhance prompt using HuggingFace
   */
  private static async enhanceWithHuggingFace(prompt: string): Promise<string> {
    const apiKey = process.env.HUGGINGFACE_API_KEY
    
    if (!apiKey) {
      throw new Error('HuggingFace API key not configured')
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `Enhance this image generation prompt to be more detailed and professional. Keep it under 100 words.\n\nOriginal: ${prompt}\n\nEnhanced:`,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status}`)
    }

    const data = await response.json()
    const enhanced = Array.isArray(data) ? data[0]?.generated_text : data.generated_text
    
    if (!enhanced) {
      throw new Error('No response from HuggingFace')
    }

    // Extract only the enhanced part
    return enhanced.split('Enhanced:')[1]?.trim() || enhanced.trim()
  }

  /**
   * Local prompt enhancement (always works, no API needed)
   */
  private static enhanceLocally(prompt: string): string {
    // Add quality terms if not already present
    let enhanced = prompt
    
    if (!enhanced.includes('detailed')) {
      enhanced += ', highly detailed'
    }
    
    if (!enhanced.includes('quality') && !enhanced.includes('professional')) {
      enhanced += ', professional quality'
    }
    
    if (!enhanced.includes('8k') && !enhanced.includes('4k') && !enhanced.includes('resolution')) {
      enhanced += ', 8k resolution'
    }

    return enhanced
  }

  /**
   * Generate image with fallback providers
   */
  static async generateImage(prompt: string): Promise<{ imageUrl: string, provider: string }> {
    // First enhance the prompt
    const { enhanced } = await this.enhancePrompt(prompt)
    
    // Try HuggingFace first (free, unlimited)
    try {
      console.log('🎨 Trying HuggingFace for image generation...')
      const { HuggingFaceService } = await import('./huggingface.service')
      const blob = await HuggingFaceService.generateImage(enhanced)
      const imageUrl = await HuggingFaceService.blobToBase64(blob)
      console.log('✅ HuggingFace image generation success!')
      return { imageUrl, provider: 'huggingface' }
    } catch (hfError) {
      console.log('⚠️ HuggingFace failed, trying Replicate...', hfError instanceof Error ? hfError.message : '')
    }

    // Fallback to Replicate
    try {
      console.log('🎨 Trying Replicate for image generation...')
      const { ReplicateService } = await import('./replicate.service')
      const imageUrl = await ReplicateService.generateImage(enhanced)
      console.log('✅ Replicate image generation success!')
      return { imageUrl, provider: 'replicate' }
    } catch (error) {
      console.error('❌ All image generation providers failed:', error instanceof Error ? error.message : '')
      throw new Error('Unable to generate image at this time. Please try again later.')
    }
  }
}
