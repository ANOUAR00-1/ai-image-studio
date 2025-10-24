import { NextRequest } from 'next/server'
import { ApiResponse } from '@/backend/utils/response'
import { AIService } from '@/backend/services/ai.service'
import { StorageService } from '@/backend/services/storage.service'
import { supabaseAdmin } from '@/lib/supabase/server'

// Video example prompts
const VIDEO_PROMPTS = [
  {
    category: "landscapes",
    title: "Ocean Waves",
    prompt: "Peaceful ocean waves rolling onto a sandy beach at sunset, gentle motion, calming atmosphere",
    model: "zeroscope"
  },
  {
    category: "abstract",
    title: "Cosmic Journey",
    prompt: "Flying through a colorful nebula in space, stars and galaxies, cosmic journey, ethereal movement",
    model: "zeroscope"
  },
  {
    category: "landscapes",
    title: "Mountain Clouds",
    prompt: "Time-lapse of clouds moving over mountain peaks, dramatic sky, nature in motion",
    model: "zeroscope"
  },
  {
    category: "abstract",
    title: "Liquid Colors",
    prompt: "Abstract liquid colors flowing and mixing, vibrant gradients, fluid art in motion",
    model: "zeroscope"
  }
]

// Example prompts that showcase what your AI can do
// Using HuggingFace model names (full path required)
const IMAGE_PROMPTS = [
  {
    category: "portraits",
    title: "Fantasy Portrait",
    prompt: "Ethereal elven warrior with flowing silver hair, glowing blue eyes, magical aura, intricate armor, fantasy art style, highly detailed, 4k quality",
    model: "stabilityai/stable-diffusion-xl-base-1.0"
  },
  {
    category: "portraits",
    title: "Warrior Portrait",
    prompt: "Powerful medieval warrior with ornate battle armor, dramatic lighting, intense expression, battle-worn face, cinematic composition, ultra realistic",
    model: "stabilityai/stable-diffusion-xl-base-1.0"
  },
  {
    category: "portraits",
    title: "Fashion Portrait",
    prompt: "High fashion model with avant-garde makeup, dramatic pose, studio lighting, elegant and artistic, editorial photography style, professional quality",
    model: "stabilityai/stable-diffusion-xl-base-1.0"
  },
  {
    category: "portraits",
    title: "Mystical Elder",
    prompt: "Wise wizard with long white beard, mystical robes, magical staff, ancient knowledge in eyes, fantasy art, highly detailed, magical atmosphere",
    model: "stabilityai/stable-diffusion-xl-base-1.0"
  },
  {
    category: "landscapes",
    title: "Cyberpunk Cityscape",
    prompt: "Futuristic cyberpunk city at night with neon lights, flying cars, towering skyscrapers, rain-soaked streets, blade runner aesthetic, 4k cinematic",
    model: "stabilityai/stable-diffusion-xl-base-1.0"
  },
  {
    category: "landscapes",
    title: "Mountain Sunrise",
    prompt: "Majestic mountain peaks at golden hour with dramatic clouds, alpine meadows, pristine nature, breathtaking vista, professional landscape photography",
    model: "stabilityai/stable-diffusion-xl-base-1.0"
  },
  {
    category: "landscapes",
    title: "Ocean Paradise",
    prompt: "Tropical beach paradise with crystal clear turquoise water, white sand, palm trees, beautiful sunset, serene and peaceful, professional photography",
    model: "stabilityai/stable-diffusion-xl-base-1.0"
  },
  {
    category: "landscapes",
    title: "Northern Lights",
    prompt: "Aurora borealis dancing over snowy mountains with starry night sky, Iceland landscape, vibrant green and purple lights, magical atmosphere, 4k",
    model: "stabilityai/stable-diffusion-xl-base-1.0"
  },
  {
    category: "landscapes",
    title: "Desert Dunes",
    prompt: "Vast sand dunes at sunset with dramatic shadows, warm golden light, pristine desert landscape, Sahara aesthetic, professional photography, 4k quality",
    model: "stabilityai/stable-diffusion-xl-base-1.0"
  },
  {
    category: "abstract",
    title: "Abstract Fluid Art",
    prompt: "Vibrant abstract fluid art with swirling colors, metallic gold accents, purple and pink gradients, liquid marble effect, high resolution, artistic",
    model: "stabilityai/stable-diffusion-xl-base-1.0"
  },
  {
    category: "abstract",
    title: "Cosmic Energy",
    prompt: "Abstract cosmic energy with nebula colors, stars, flowing light patterns, space art, vibrant blues and purples, ethereal and mystical, 4k quality",
    model: "stabilityai/stable-diffusion-xl-base-1.0"
  },
  {
    category: "abstract",
    title: "Geometric Dreams",
    prompt: "3D geometric shapes with gradient colors and reflective surfaces, modern abstract art, clean minimalist design, professional render, 4k quality",
    model: "stabilityai/stable-diffusion-xl-base-1.0"
  }
]

// Increase route timeout for long-running generation
export const maxDuration = 600 // 10 minutes
export const dynamic = 'force-dynamic'

// Admin endpoint to generate example images and videos (protected)
export async function POST(request: NextRequest) {
  try {
    // Simple API key authentication for admin operations
    const apiKey = request.headers.get('x-admin-api-key')
    
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return ApiResponse.unauthorized()
    }

    const body = await request.json()
    const { type = 'image' } = body // 'image' or 'video'

    const results = []
    
    console.log(`Starting example ${type} generation...`)
    
    // Ensure storage bucket exists
    await StorageService.ensureBucketExists()

    const prompts = type === 'video' ? VIDEO_PROMPTS : IMAGE_PROMPTS

    for (const example of prompts) {
      try {
        console.log(`Generating ${type}: ${example.title}`)
        
        let mediaUrl: string
        
        if (type === 'video') {
          // Video generation not supported - requires paid APIs
          console.log(`  ⚠️ Video generation skipped (requires paid APIs)`)
          throw new Error('Video generation requires paid APIs. Use image generation instead.')
        } else {
          // Generate image using AI service (returns Blob, URL, or base64)
          const imageResult = await AIService.generateImage(example.prompt, example.model)
          
          // If it's a Blob, upload to Supabase Storage
          if (imageResult instanceof Blob) {
            try {
              const filename = `${example.category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
              mediaUrl = await StorageService.uploadImage(imageResult, filename)
              console.log(`  → Uploaded to storage: ${filename}`)
            } catch (err) {
              console.warn('  ⚠️ Storage upload failed, falling back to base64...')
              console.error('Storage error:', err)
              // Fallback: convert to base64 if storage fails
              const { HuggingFaceService } = await import('@/backend/services/huggingface.service')
              mediaUrl = await HuggingFaceService.blobToBase64(imageResult)
            }
          } else {
            // It's a URL string (from Replicate) or base64
            mediaUrl = String(imageResult)
          }
        }
        
        // Store in database as featured examples
        const insertData: Record<string, unknown> = {
          title: example.title,
          category: example.category,
          prompt: example.prompt,
          model: example.model,
          credits_used: type === 'video' ? 8 : 2,
          is_featured: true,
          type: type,
        }
        
        if (type === 'video') {
          insertData.video_url = mediaUrl
        } else {
          insertData.image_url = mediaUrl
        }
        
        const { data: savedExample, error: dbError } = await supabaseAdmin
          .from('examples')
          .insert(insertData)
          .select()
          .single()

        if (dbError) throw dbError

        results.push({
          success: true,
          title: example.title,
          id: savedExample.id,
          url: type === 'video' ? savedExample.video_url : savedExample.image_url,
          type: type
        })

        console.log(`✓ Generated ${type}: ${example.title}`)
        
        // Wait longer for videos (they take more time)
        const waitTime = type === 'video' ? 5000 : 2000
        await new Promise(resolve => setTimeout(resolve, waitTime))
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error(`✗ Failed to generate ${example.title}:`, errorMessage)
        console.error('Full error details:', error)
        results.push({
          success: false,
          title: example.title,
          error: errorMessage
        })
      }
    }

    return ApiResponse.success({
      message: `Example ${type} generation completed`,
      type,
      results,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    })

  } catch (error) {
    console.error('Example generation error:', error)
    return ApiResponse.serverError()
  }
}

// GET endpoint to fetch examples for display
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    // const type = searchParams.get('type') // TODO: Enable when type column is added

    let query = supabaseAdmin
      .from('examples')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    // TODO: Add type column to database before enabling this filter
    // if (type && type !== 'all') {
    //   query = query.eq('type', type)
    // }

    const { data: examples, error } = await query

    if (error) throw error

    return ApiResponse.success({ examples })

  } catch (error) {
    console.error('Fetch examples error:', error)
    return ApiResponse.serverError()
  }
}
