/**
 * Free Image Tools Service
 * Uses open-source models via Hugging Face Inference API
 * NO API KEY NEEDED for basic usage (rate limited)
 * WITH API KEY: Unlimited usage
 */

export class FreeImageToolsService {
  
  /**
   * Remove background using RMBG-1.4 (open-source model)
   * Free via Hugging Face Inference API
   */
  static async removeBackground(imageBase64: string): Promise<string> {
    const apiKey = process.env.HUGGINGFACE_API_KEY
    
    try {
      console.log('🎨 Removing background with RMBG-1.4 (free open-source)...')
      
      // Convert base64 to blob
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
      const binaryData = Buffer.from(base64Data, 'base64')
      
      const headers: Record<string, string> = {}
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`
        console.log('✅ Using HuggingFace API key (unlimited)')
      } else {
        console.log('⚠️ No API key - using free tier (rate limited)')
      }
      
      // Use RMBG-1.4 - open-source background removal model
      const response = await fetch(
        'https://api-inference.huggingface.co/models/briaai/RMBG-1.4',
        {
          method: 'POST',
          headers,
          body: binaryData,
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('HF API error:', errorText)
        
        if (response.status === 401 && !apiKey) {
          throw new Error('Background removal requires HUGGINGFACE_API_KEY for unlimited usage. Get free key at: https://huggingface.co/settings/tokens')
        }
        if (response.status === 503) {
          throw new Error('Model is loading, please try again in 30 seconds')
        }
        if (response.status === 429) {
          throw new Error('Rate limit reached. Add HUGGINGFACE_API_KEY to .env.local for unlimited usage')
        }
        
        throw new Error('Background removal failed')
      }

      const blob = await response.blob()
      const buffer = await blob.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      
      console.log('✅ Background removed successfully')
      return `data:image/png;base64,${base64}`
      
    } catch (error) {
      console.error('Background removal error:', error)
      throw error
    }
  }

  /**
   * Enhance image quality using SwinIR (open-source model)
   * Free via Hugging Face Inference API
   */
  static async enhanceQuality(imageBase64: string): Promise<string> {
    const apiKey = process.env.HUGGINGFACE_API_KEY
    
    try {
      console.log('✨ Enhancing image with SwinIR (free open-source)...')
      
      // Convert base64 to blob
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
      const binaryData = Buffer.from(base64Data, 'base64')
      
      const headers: Record<string, string> = {}
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`
        console.log('✅ Using HuggingFace API key (unlimited)')
      } else {
        console.log('⚠️ No API key - using free tier (rate limited)')
      }
      
      // Use SwinIR - open-source image restoration model
      const response = await fetch(
        'https://api-inference.huggingface.co/models/caidas/swin2SR-classical-sr-x2-64',
        {
          method: 'POST',
          headers,
          body: binaryData,
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('HF API error:', errorText)
        
        if (response.status === 401 && !apiKey) {
          throw new Error('Image enhancement requires HUGGINGFACE_API_KEY for unlimited usage. Get free key at: https://huggingface.co/settings/tokens')
        }
        if (response.status === 503) {
          throw new Error('Model is loading, please try again in 30 seconds')
        }
        if (response.status === 429) {
          throw new Error('Rate limit reached. Add HUGGINGFACE_API_KEY to .env.local for unlimited usage')
        }
        
        throw new Error('Enhancement failed')
      }

      const blob = await response.blob()
      const buffer = await blob.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      
      console.log('✅ Image enhanced successfully')
      return `data:image/png;base64,${base64}`
      
    } catch (error) {
      console.error('Enhancement error:', error)
      throw error
    }
  }

  /**
   * Style transfer using AnimeGANv2 (open-source model)
   * Free via Hugging Face Inference API
   */
  static async styleTransfer(imageBase64: string, style: string = 'anime'): Promise<string> {
    const apiKey = process.env.HUGGINGFACE_API_KEY
    
    try {
      console.log(`🎨 Applying ${style} style with AnimeGANv2 (free open-source)...`)
      
      // Convert base64 to blob
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
      const binaryData = Buffer.from(base64Data, 'base64')
      
      const headers: Record<string, string> = {}
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`
        console.log('✅ Using HuggingFace API key (unlimited)')
      } else {
        console.log('⚠️ No API key - using free tier (rate limited)')
      }
      
      // Use AnimeGANv2 - open-source anime style transfer
      const modelMap: Record<string, string> = {
        'anime': 'akhaliq/AnimeGANv2',
        'cartoon': 'akhaliq/AnimeGANv2',
        'default': 'akhaliq/AnimeGANv2'
      }
      
      const modelId = modelMap[style] || modelMap['default']
      
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${modelId}`,
        {
          method: 'POST',
          headers,
          body: binaryData,
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('HF API error:', errorText)
        
        if (response.status === 401 && !apiKey) {
          throw new Error('Style transfer requires HUGGINGFACE_API_KEY for unlimited usage. Get free key at: https://huggingface.co/settings/tokens')
        }
        if (response.status === 503) {
          throw new Error('Model is loading, please try again in 30 seconds')
        }
        if (response.status === 429) {
          throw new Error('Rate limit reached. Add HUGGINGFACE_API_KEY to .env.local for unlimited usage')
        }
        
        throw new Error('Style transfer failed')
      }

      const blob = await response.blob()
      const buffer = await blob.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      
      console.log('✅ Style applied successfully')
      return `data:image/png;base64,${base64}`
      
    } catch (error) {
      console.error('Style transfer error:', error)
      throw error
    }
  }
}
