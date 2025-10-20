// Credit costs for different operations (FREE open source models!)
export const CREDIT_COSTS = {
  IMAGE_GENERATION: {
    // Hugging Face models
    'stabilityai/stable-diffusion-xl-base-1.0': 2,
    'stabilityai/stable-diffusion-2-1': 1,
    'runwayml/stable-diffusion-v1-5': 1,
    'prompthero/openjourney-v4': 1,
    // Replicate models
    'sdxl': 2,
    'flux': 3,
    'playground': 2,
  },
  VIDEO_GENERATION: {
    'stable-video': 8,
    'zeroscope': 10,
  },
  IMAGE_EDITING: {
    'remove-background': 1,
    'enhance': 1,
    'upscale': 2,
  },
} as const

// Plan configurations
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    credits: 10,
    features: [
      '10 credits per month',
      'Basic image generation',
      'Standard quality',
      'Community support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 29,
    stripePriceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    credits: 200,
    features: [
      '200 credits per month',
      'All AI models',
      'High quality output',
      'Priority support',
      'No watermarks',
    ],
  },
  business: {
    name: 'Business',
    price: 99,
    stripePriceId: 'price_business_monthly', // Replace with actual Stripe price ID
    credits: 1000,
    features: [
      '1000 credits per month',
      'All AI models',
      'Highest quality',
      'API access',
      'Priority support',
      'Custom integrations',
      'Team collaboration',
    ],
  },
} as const

// Generation limits
export const GENERATION_LIMITS = {
  MAX_PROMPT_LENGTH: 1000,
  MAX_CONCURRENT_GENERATIONS: 3,
  TIMEOUT_MS: 60000, // 60 seconds
} as const

// API Keys (FREE!)
export const API_KEYS = {
  HUGGINGFACE: process.env.HUGGINGFACE_API_KEY,
  REPLICATE: process.env.REPLICATE_API_TOKEN,
} as const

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
} as const
