// Together AI Service - FREE $25 credits on signup!
// Sign up: https://api.together.xyz/signup
// Get API key: https://api.together.xyz/settings/api-keys

export class TogetherService {
  private static apiKey = process.env.TOGETHER_API_KEY
  private static baseUrl = 'https://api.together.xyz/v1'

  // Generate image with Together AI
  static async generateImage(prompt: string, model?: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('TOGETHER_API_KEY not found in environment variables')
    }

    const selectedModel = model || 'stabilityai/stable-diffusion-xl-base-1.0'

    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          prompt: prompt,
          width: 1024,
          height: 1024,
          steps: 20,
          n: 1,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Together AI error: ${error.error?.message || response.statusText}`)
      }

      const data = await response.json()
      
      // Together AI returns base64 encoded image
      if (data.data && data.data[0]?.b64_json) {
        return `data:image/png;base64,${data.data[0].b64_json}`
      }
      
      // Or direct URL
      if (data.data && data.data[0]?.url) {
        return data.data[0].url
      }

      throw new Error('No image data returned from Together AI')
    } catch (error) {
      console.error('Together AI generation error:', error)
      throw error
    }
  }

  // Get available models
  static getAvailableModels() {
    return {
      images: [
        {
          id: 'stabilityai/stable-diffusion-xl-base-1.0',
          name: 'Stable Diffusion XL',
          credits: 2,
          description: 'High quality, versatile image generation',
        },
        {
          id: 'stabilityai/stable-diffusion-2-1',
          name: 'Stable Diffusion 2.1',
          credits: 1,
          description: 'Fast and efficient image generation',
        },
        {
          id: 'prompthero/openjourney-v4',
          name: 'OpenJourney v4',
          credits: 1,
          description: 'Artistic style, great for creative images',
        },
        {
          id: 'runwayml/stable-diffusion-v1-5',
          name: 'Stable Diffusion 1.5',
          credits: 1,
          description: 'Classic model, reliable results',
        },
      ],
      videos: [],
    }
  }

  // Check if Together AI is configured
  static isConfigured(): boolean {
    return !!this.apiKey
  }
}
