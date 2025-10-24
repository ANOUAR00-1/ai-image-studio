/**
 * Prompt Enhancement Utilities
 * Makes AI generate EXACTLY what users want
 */

interface PromptEnhancement {
  enhanced: string
  keywords: string[]
  style: string
}

/**
 * Enhance user prompt for better AI accuracy
 */
export function enhancePrompt(userPrompt: string, style: 'realistic' | 'artistic' | 'cinematic' = 'realistic'): PromptEnhancement {
  // Clean the prompt
  const cleaned = userPrompt.trim()
  
  // Style-specific enhancements
  const styleEnhancements = {
    realistic: 'highly detailed, professional photography, 8k uhd, high quality, sharp focus, realistic, photorealistic',
    artistic: 'artistic, beautiful, creative, masterpiece, trending on artstation, award winning, vibrant colors',
    cinematic: 'cinematic lighting, dramatic, epic composition, movie still, professional color grading, film grain'
  }
  
  // Quality keywords
  const qualityKeywords = [
    'high resolution',
    'detailed',
    'professional',
    'high quality',
  ]
  
  // Build enhanced prompt
  const enhancement = styleEnhancements[style]
  const enhanced = `${cleaned}, ${enhancement}`
  
  return {
    enhanced,
    keywords: qualityKeywords,
    style
  }
}

/**
 * Get negative prompt to avoid bad results
 */
export function getNegativePrompt(): string {
  return [
    'blurry',
    'bad quality',
    'distorted',
    'deformed',
    'ugly',
    'bad anatomy',
    'disfigured',
    'poorly drawn',
    'extra limbs',
    'watermark',
    'text',
    'signature',
    'low quality',
    'jpeg artifacts',
    'duplicate',
    'mutated',
    'out of frame',
    'cropped',
    'worst quality',
  ].join(', ')
}

/**
 * Optimize prompt for specific subjects
 */
export function optimizeForSubject(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase()
  
  // Car/Vehicle prompts
  if (lowerPrompt.includes('car') || lowerPrompt.includes('vehicle') || lowerPrompt.includes('mclaren') || lowerPrompt.includes('ferrari') || lowerPrompt.includes('lamborghini')) {
    return `${prompt}, professional automotive photography, studio lighting, showroom quality, detailed reflections, perfect paint, high-end luxury car photography, 8k resolution`
  }
  
  // Portrait prompts
  if (lowerPrompt.includes('person') || lowerPrompt.includes('face') || lowerPrompt.includes('portrait') || lowerPrompt.includes('man') || lowerPrompt.includes('woman')) {
    return `${prompt}, professional portrait photography, perfect skin, detailed eyes, natural lighting, high resolution, sharp focus, professional headshot`
  }
  
  // Landscape prompts
  if (lowerPrompt.includes('landscape') || lowerPrompt.includes('mountain') || lowerPrompt.includes('ocean') || lowerPrompt.includes('forest') || lowerPrompt.includes('sunset')) {
    return `${prompt}, professional landscape photography, golden hour lighting, epic vista, national geographic style, stunning scenery, 8k resolution`
  }
  
  // Architecture prompts
  if (lowerPrompt.includes('building') || lowerPrompt.includes('architecture') || lowerPrompt.includes('house') || lowerPrompt.includes('city')) {
    return `${prompt}, professional architectural photography, perfect perspective, clean lines, modern design, high resolution, detailed textures`
  }
  
  // Animal prompts
  if (lowerPrompt.includes('animal') || lowerPrompt.includes('dog') || lowerPrompt.includes('cat') || lowerPrompt.includes('bird') || lowerPrompt.includes('wildlife')) {
    return `${prompt}, wildlife photography, national geographic style, detailed fur/feathers, natural habitat, professional animal photography, sharp focus`
  }
  
  // Food prompts
  if (lowerPrompt.includes('food') || lowerPrompt.includes('meal') || lowerPrompt.includes('dish') || lowerPrompt.includes('restaurant')) {
    return `${prompt}, professional food photography, appetizing, delicious, michelin star presentation, perfect lighting, detailed textures, 8k resolution`
  }
  
  // Default enhancement
  return `${prompt}, highly detailed, professional photography, 8k uhd, high quality, sharp focus, realistic`
}

/**
 * Get optimal generation parameters based on prompt
 */
export function getOptimalParameters(prompt: string) {
  const lowerPrompt = prompt.toLowerCase()
  
  // High detail subjects need more steps
  const needsHighDetail = 
    lowerPrompt.includes('detailed') ||
    lowerPrompt.includes('intricate') ||
    lowerPrompt.includes('complex')
  
  return {
    num_inference_steps: needsHighDetail ? 60 : 50,
    guidance_scale: 9.0,  // Strong prompt adherence
    width: 1024,
    height: 1024,
  }
}

/**
 * Smart prompt enhancement (combines all strategies)
 */
export function smartEnhance(userPrompt: string): {
  enhanced: string
  negative: string
  parameters: ReturnType<typeof getOptimalParameters>
} {
  // First optimize for subject
  const optimized = optimizeForSubject(userPrompt)
  
  // Get optimal parameters
  const parameters = getOptimalParameters(userPrompt)
  
  // Get negative prompt
  const negative = getNegativePrompt()
  
  return {
    enhanced: optimized,
    negative,
    parameters
  }
}
