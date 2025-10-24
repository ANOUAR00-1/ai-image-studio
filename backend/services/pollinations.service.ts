// Pollinations.ai - 100% FREE, NO API KEY NEEDED!
// Simple URL-based API that works immediately
// https://pollinations.ai/

export class PollinationsService {
  // Generate image using Pollinations.ai
  // No API key needed, completely free!
  static async generateImage(prompt: string, model: string = 'flux'): Promise<string> {
    try {
      console.log(`🎨 Generating with Pollinations.ai (${model})...`)
      
      // Pollinations uses a simple URL structure
      // The image is generated on-demand when you access the URL
      const baseUrl = 'https://image.pollinations.ai/prompt'
      
      // Encode the prompt for URL
      const encodedPrompt = encodeURIComponent(prompt)
      
      // Build the URL with parameters
      const width = 1024
      const height = 1024
      const seed = Math.floor(Math.random() * 1000000)
      
      // Map model names to Pollinations models
      const modelMap: Record<string, string> = {
        'flux': 'flux',
        'flux-realism': 'flux-realism',
        'flux-anime': 'flux-anime',
        'flux-3d': 'flux-3d',
        'turbo': 'turbo',
      }
      
      const modelParam = modelMap[model] || 'flux'
      
      const imageUrl = `${baseUrl}/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${modelParam}&nologo=true&enhance=true`
      
      console.log(`✅ Image URL generated: ${imageUrl.substring(0, 80)}...`)
      
      // Fetch the image to convert to base64
      const response = await fetch(imageUrl)
      
      if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.statusText}`)
      }
      
      // Get image as blob
      const blob = await response.blob()
      
      // Convert to base64
      const buffer = await blob.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      const dataUrl = `data:image/jpeg;base64,${base64}`
      
      console.log(`✅ Image generated successfully (${blob.size} bytes)`)
      
      return dataUrl
      
    } catch (error) {
      console.error('❌ Pollinations generation error:', error)
      throw error
    }
  }

  // Get available models
  static getAvailableModels() {
    return {
      images: [
        {
          id: 'flux',
          name: 'Flux Pro (Free)',
          credits: 0, // FREE!
          description: 'Highest quality AI generation, photorealistic results',
        },
        {
          id: 'flux-realism',
          name: 'Flux Realism (Free)',
          credits: 0, // FREE!
          description: 'Ultra-realistic photos, perfect for portraits and products',
        },
        {
          id: 'flux-anime',
          name: 'Flux Anime (Free)',
          credits: 0, // FREE!
          description: 'Beautiful anime and manga style illustrations',
        },
        {
          id: 'flux-3d',
          name: 'Flux 3D (Free)',
          credits: 0, // FREE!
          description: '3D rendered style, perfect for game assets',
        },
        {
          id: 'turbo',
          name: 'Turbo (Free)',
          credits: 0, // FREE!
          description: 'Ultra fast generation, good quality',
        },
      ],
      videos: [],
    }
  }

  // Check if Pollinations is available (always true!)
  static isConfigured(): boolean {
    return true // No API key needed!
  }
}
