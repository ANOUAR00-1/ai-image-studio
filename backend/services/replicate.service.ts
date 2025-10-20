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
    model: string = 'stable-video'
  ): Promise<string> {
    try {
      let output

      switch (model) {
        case 'stable-video':
          // Stable Video Diffusion
          output = await replicate.run(
            'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
            {
              input: {
                video_length: 14,
                sizing_strategy: 'maintain_aspect_ratio',
                motion_bucket_id: 127,
                cond_aug: 0.02,
                decoding_t: 14,
                frames_per_second: 6,
              },
            }
          )
          break

        case 'zeroscope':
          // Zeroscope V2 (text to video)
          output = await replicate.run(
            'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
            {
              input: {
                prompt,
                fps: 8,
                num_frames: 24,
              },
            }
          )
          break

        default:
          throw new Error('Unknown video model')
      }

      const videoUrl = Array.isArray(output) ? output[0] : output
      return String(videoUrl)
    } catch (error) {
      console.error('Replicate video generation error:', error)
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
          id: 'stable-video',
          name: 'Stable Video Diffusion',
          credits: 8,
          description: '2-3 second video clips',
        },
        {
          id: 'zeroscope',
          name: 'Zeroscope V2 XL',
          credits: 10,
          description: 'Text-to-video generation',
        },
      ],
    }
  }
}
