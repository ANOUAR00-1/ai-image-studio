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
  starter: {
    name: 'Starter',
    price: 9.99,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || '',
    credits: 100,
    features: [
      '100 credits per month',
      'All AI models',
      'Email support',
      'HD quality exports',
      'Commercial license',
    ],
  },
  pro: {
    name: 'Pro',
    price: 29.99,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
    credits: 500,
    features: [
      '500 credits per month',
      'All AI models',
      'Priority processing',
      'Priority support',
      '4K quality exports',
      'Commercial license',
      'API access',
    ],
  },
  business: {
    name: 'Business',
    price: 99.99,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID || '',
    credits: -1, // Unlimited
    features: [
      'Unlimited credits',
      'All AI models',
      'Fastest processing',
      'Dedicated support',
      '4K quality exports',
      'Commercial license',
      'API access',
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
