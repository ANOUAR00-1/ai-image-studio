import { HfInference } from '@huggingface/inference'
import { smartEnhance } from '@/lib/utils/prompt-enhancer'

// FREE Hugging Face Inference API
// Get your free token: https://huggingface.co/settings/tokens
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export class HuggingFaceService {
  // Generate image with Stable Diffusion
  static async generateImage(prompt: string, model?: string): Promise<Blob> {
    try {
      const selectedModel = model || 'stabilityai/stable-diffusion-xl-base-1.0'
      
      console.log(`[HF] Generating with model: ${selectedModel}`)
      console.log(`[HF] Original prompt: ${prompt}`)
      
      // Smart prompt enhancement for better accuracy
      const { enhanced, negative, parameters } = smartEnhance(prompt)
      
      console.log(`[HF] Enhanced prompt: ${enhanced.substring(0, 100)}...`)
      
      const response = await hf.textToImage({
        model: selectedModel,
        inputs: enhanced,
        parameters: {
          negative_prompt: negative,
          num_inference_steps: parameters.num_inference_steps,
          guidance_scale: parameters.guidance_scale,
          width: parameters.width,
          height: parameters.height,
        }
      })

      // HuggingFace returns a Blob
      const blob = response as unknown as Blob
      console.log(`[HF] ✓ Generated blob: ${blob.size} bytes, type: ${blob.type}`)
      return blob
    } catch (error) {
      console.error('[HF] ❌ HuggingFace image generation error:', error)
      if (error instanceof Error) {
        console.error('[HF] Error message:', error.message)
        console.error('[HF] Error stack:', error.stack)
      }
      throw new Error(`Failed to generate image with Hugging Face: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
