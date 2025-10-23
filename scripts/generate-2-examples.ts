/**
 * Quick script to generate 2 example images
 * Run with: npx tsx scripts/generate-2-examples.ts
 */

async function generateExamples() {
  console.log('🎨 Generating 2 example images...\n')

  const examples = [
    {
      title: "Sunset Mountain",
      prompt: "Beautiful sunset over snow-capped mountains, golden hour lighting, dramatic clouds, breathtaking landscape, professional photography, 4k quality",
      category: "landscapes"
    },
    {
      title: "Cosmic Nebula",
      prompt: "Vibrant cosmic nebula with swirling purple and blue colors, stars, galaxies, space art, ethereal and mystical atmosphere, 4k quality",
      category: "abstract"
    }
  ]

  const ADMIN_API_KEY = process.env.ADMIN_API_KEY
  const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (!ADMIN_API_KEY) {
    console.error('❌ Error: ADMIN_API_KEY not found in environment variables')
    console.log('Add ADMIN_API_KEY to your .env.local file')
    process.exit(1)
  }

  try {
    const response = await fetch(`${API_URL}/api/examples/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-api-key': ADMIN_API_KEY,
      },
      body: JSON.stringify({
        type: 'image',
        count: 2,
        prompts: examples
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Error:', data.error || 'Failed to generate examples')
      process.exit(1)
    }

    console.log('\n✅ Generation complete!')
    console.log(`Successful: ${data.data.successful}`)
    console.log(`Failed: ${data.data.failed}`)
    console.log('\nResults:')
    data.data.results.forEach((result: { success: boolean; title: string; url?: string; error?: string }) => {
      if (result.success) {
        console.log(`  ✓ ${result.title} - ${result.url?.substring(0, 50)}...`)
      } else {
        console.log(`  ✗ ${result.title} - ${result.error}`)
      }
    })

    console.log('\n🎉 Check your examples at: http://localhost:3000/examples')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

generateExamples()
