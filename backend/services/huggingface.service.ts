import { HfInference } from '@huggingface/inference'

// FREE Hugging Face Inference API
// Get your free token: https://huggingface.co/settings/tokens
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export class HuggingFaceService {
  // Generate image with Stable Diffusion
  static async generateImage(prompt: string, model?: string): Promise<Blob> {
    try {
      const selectedModel = model || 'stabilityai/stable-diffusion-xl-base-1.0'
      
      const response = await hf.textToImage({
        model: selectedModel,
        inputs: prompt,
        parameters: {
          negative_prompt: 'blurry, bad quality, distorted',
          num_inference_steps: 30,
          guidance_scale: 7.5,
        }
      })

      // HuggingFace returns a Blob
      return response as unknown as Blob
    } catch (error) {
      console.error('HuggingFace image generation error:', error)
      throw new Error('Failed to generate image with Hugging Face')
    }
  }

  // Available FREE models
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
          description: 'Fast and efficient generation',
        },
        {
          id: 'runwayml/stable-diffusion-v1-5',
          name: 'Stable Diffusion 1.5',
          credits: 1,
          description: 'Classic, reliable model',
        },
        {
          id: 'prompthero/openjourney-v4',
          name: 'OpenJourney V4',
          credits: 1,
          description: 'Midjourney-style images',
        },
      ],
    }
  }

  // Convert Blob to base64 for storage
  static async blobToBase64(blob: Blob): Promise<string> {
    const buffer = await blob.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    return `data:image/png;base64,${base64}`
  }
}
