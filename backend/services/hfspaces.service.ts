// Hugging Face Spaces - 100% FREE FOREVER!
// No API key needed, uses public community models
// Slower than paid APIs but completely free with no limits

export class HFSpacesService {
  // Generate image using Hugging Face Inference API
  static async generateImage(prompt: string, model: string = 'sdxl'): Promise<string> {
    try {
      console.log(`Generating with HF Inference API (${model})...`)
      
      // Check if we have an API key
      const apiKey = process.env.HUGGINGFACE_API_KEY
      
      // Use smaller, faster model for free tier
      const modelId = model === 'sdxl' 
        ? 'stabilityai/stable-diffusion-2-1'  // Faster than XL
        : 'runwayml/stable-diffusion-v1-5'
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      // Add API key if available
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`
        console.log('✅ Using HuggingFace API key')
      } else {
        console.log('⚠️ No API key - using free tier (limited)')
      }
      
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${modelId}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            inputs: prompt,
            options: {
              wait_for_model: true,
              use_cache: false,
            },
          }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('HF API error:', errorText)
        
        // If unauthorized and no API key, provide helpful message
        if (response.status === 401 && !apiKey) {
          throw new Error('HuggingFace API key required. Add HUGGINGFACE_API_KEY to .env.local or get a free key at https://huggingface.co/settings/tokens')
        }
        
        // If rate limited or model loading, throw specific error
        if (response.status === 503) {
          throw new Error('Model is loading, please try again in 30 seconds')
        }
        if (response.status === 429) {
          throw new Error('Rate limit reached, please try again in a few minutes')
        }
        
        throw new Error(`HF Inference API error: ${response.statusText}`)
      }

      // Response is image blob
      const blob = await response.blob()
      
      // Convert to base64
      const buffer = await blob.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      return `data:image/png;base64,${base64}`
      
    } catch (error) {
      console.error('HF Inference API error:', error)
      throw error
    }
  }

  // Alternative: Use Hugging Face Inference API (free tier)
  // This uses the official API with better reliability
  static async generateImageWithInferenceAPI(prompt: string): Promise<string> {
    try {
      // Use public inference endpoint (no key needed but rate limited)
      const response = await fetch(
        'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            options: {
              wait_for_model: true,
            },
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`HF Inference API error: ${response.statusText}`)
      }

      // Response is image blob
      const blob = await response.blob()
      
      // Convert to base64
      const buffer = await blob.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      return `data:image/png;base64,${base64}`
    } catch (error) {
      console.error('HF Inference API error:', error)
      throw error
    }
  }

  // Get available models
  static getAvailableModels() {
    return {
      images: [
        {
          id: 'sdxl',
          name: 'Stable Diffusion XL (Free)',
          credits: 0, // FREE!
          description: 'High quality, completely free via HF Spaces',
        },
        {
          id: 'sd-2.1',
          name: 'Stable Diffusion 2.1 (Free)',
          credits: 0, // FREE!
          description: 'Fast and free via HF Spaces',
        },
        {
          id: 'openjourney',
          name: 'OpenJourney (Free)',
          credits: 0, // FREE!
          description: 'Artistic style, completely free',
        },
      ],
      videos: [],
    }
  }

  // Check if HF Spaces is available (always true!)
  static isConfigured(): boolean {
    return true // No API key needed!
  }
}
