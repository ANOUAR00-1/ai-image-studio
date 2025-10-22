import Replicate from 'replicate'

// FREE tier: 50 predictions/month
// Get your free token: https://replicate.com/account/api-tokens
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
})

export class ReplicateService {
  // Generate image with various models
  static async generateImage(
    prompt: string,
    model: string = 'sdxl'
  ): Promise<string> {
    try {
      let output

      switch (model) {
        case 'sdxl':
          // Stable Diffusion XL
          output = await replicate.run(
            'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
            {
              input: {
                prompt,
                negative_prompt: 'blurry, bad quality, distorted',
                num_inference_steps: 30,
                guidance_scale: 7.5,
              },
            }
          )
          break

        case 'flux':
          // Flux (newest model, amazing quality!)
          output = await replicate.run(
            'black-forest-labs/flux-schnell',
            {
              input: {
                prompt,
                num_inference_steps: 4, // Fast!
              },
            }
          )
          break

        case 'playground':
          // Playground V2.5 (aesthetic images)
          output = await replicate.run(
            'playgroundai/playground-v2.5-1024px-aesthetic',
            {
              input: {
                prompt,
                guidance_scale: 3,
              },
            }
          )
          break

        default:
          throw new Error('Unknown model')
      }

      // Output is usually an array with image URL
      const imageUrl = Array.isArray(output) ? output[0] : output
      return String(imageUrl)
    } catch (error) {
      console.error('Replicate image generation error:', error)
      throw new Error('Failed to generate image with Replicate')
    }
  }

  // Generate video
  static async generateVideo(
    prompt: string,
    model: string = 'zeroscope'
  ): Promise<string> {
    try {
      console.log(`🎬 Generating video with model: ${model}`)
      console.log(`📝 Prompt: ${prompt}`)
      
      let output

      switch (model) {
        case 'zeroscope':
          // Zeroscope V2 XL (text to video) - WORKS!
          console.log('  → Using Zeroscope V2 XL...')
          output = await replicate.run(
            'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
            {
              input: {
                prompt,
                fps: 8,
                num_frames: 24,
                batch_size: 1,
                num_inference_steps: 50,
              },
            }
          )
          break

        case 'stable-video':
          // Stable Video Diffusion (requires input image - not suitable for text-to-video)
          throw new Error('Stable Video Diffusion requires an input image. Use zeroscope for text-to-video.')

        default:
          throw new Error(`Unknown video model: ${model}`)
      }

      console.log('  → Video generation complete!')
      const videoUrl = Array.isArray(output) ? output[0] : output
      
      if (!videoUrl) {
        throw new Error('No video URL returned from Replicate')
      }
      
      console.log(`  ✓ Video URL: ${String(videoUrl).substring(0, 50)}...`)
      return String(videoUrl)
    } catch (error) {
      console.error('❌ Replicate video generation error:', error)
      if (error instanceof Error) {
        throw new Error(`Failed to generate video: ${error.message}`)
      }
      throw new Error('Failed to generate video with Replicate')
    }
  }

  // Available models
  static getAvailableModels() {
    return {
      images: [
        {
          id: 'sdxl',
          name: 'Stable Diffusion XL',
          credits: 2,
          description: 'High quality images, industry standard',
        },
        {
          id: 'flux',
          name: 'Flux Schnell',
          credits: 3,
          description: 'Ultra fast, amazing quality (newest!)',
        },
        {
          id: 'playground',
          name: 'Playground V2.5',
          credits: 2,
          description: 'Beautiful, aesthetic images',
        },
      ],
      videos: [
        {
          id: 'zeroscope',
          name: 'Zeroscope V2 XL',
          credits: 8,
          description: 'Text-to-video generation, 24 frames',
        },
      ],
    }
  }
}
