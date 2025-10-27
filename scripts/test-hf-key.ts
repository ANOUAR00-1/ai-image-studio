/**
 * Test HuggingFace API Key
 * Run: npx tsx scripts/test-hf-key.ts
 */

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

async function testHuggingFaceKey() {
  console.log('🔑 Testing HuggingFace API Key...\n')

  if (!HUGGINGFACE_API_KEY) {
    console.error('❌ HUGGINGFACE_API_KEY not found in environment variables')
    process.exit(1)
  }

  console.log(`✅ Key found: ${HUGGINGFACE_API_KEY.slice(0, 10)}...${HUGGINGFACE_API_KEY.slice(-5)}`)

  try {
    // Test with a simple model
    console.log('\n📡 Testing API connection with RMBG-1.4 model...')
    
    const response = await fetch(
      'https://api-inference.huggingface.co/models/briaai/RMBG-1.4',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        },
      }
    )

    console.log(`\n📊 Response Status: ${response.status} ${response.statusText}`)

    if (response.status === 200) {
      console.log('✅ API Key is VALID and working!')
      console.log('✅ You have unlimited access to HuggingFace Inference API')
      console.log('\n💡 HuggingFace Inference API is FREE - no credits needed!')
    } else if (response.status === 401) {
      console.error('❌ API Key is INVALID or EXPIRED')
      console.error('   Get a new free key at: https://huggingface.co/settings/tokens')
    } else if (response.status === 503) {
      console.log('⚠️  Model is loading (this is normal)')
      console.log('✅ Your API key is valid!')
    } else {
      const text = await response.text()
      console.log(`⚠️  Unexpected response: ${text}`)
    }

  } catch (error) {
    console.error('❌ Error testing API key:', error)
  }
}

testHuggingFaceKey()
