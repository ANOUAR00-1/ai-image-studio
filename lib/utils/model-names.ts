/**
 * Model name mapping utilities
 * Converts long technical model names to short, user-friendly display names
 */

export const MODEL_DISPLAY_NAMES: Record<string, string> = {
  // HuggingFace models
  'stabilityai/stable-diffusion-xl-base-1.0': 'SDXL',
  'stabilityai/stable-diffusion-2-1': 'SD 2.1',
  'runwayml/stable-diffusion-v1-5': 'SD 1.5',
  'prompthero/openjourney-v4': 'OpenJourney',
  
  // Replicate models (short names)
  'sdxl': 'SDXL',
  'flux': 'Flux',
  'playground': 'Playground',
  
  // Video models
  'stable-video': 'Stable Video',
  'zeroscope': 'Zeroscope',
}

/**
 * Get user-friendly display name for a model
 * @param modelName - Full model path or short name
 * @returns Short display name (e.g., "SDXL" instead of "stabilityai/stable-diffusion-xl-base-1.0")
 */
export function getModelDisplayName(modelName: string): string {
  return MODEL_DISPLAY_NAMES[modelName] || modelName
}

/**
 * Get full model description for tooltips/info
 * @param modelName - Model name or path
 * @returns Full description with provider info
 */
export function getModelDescription(modelName: string): string {
  const descriptions: Record<string, string> = {
    'stabilityai/stable-diffusion-xl-base-1.0': 'Stable Diffusion XL - High quality, versatile image generation',
    'stabilityai/stable-diffusion-2-1': 'Stable Diffusion 2.1 - Fast and efficient generation',
    'runwayml/stable-diffusion-v1-5': 'Stable Diffusion 1.5 - Classic, reliable model',
    'prompthero/openjourney-v4': 'OpenJourney V4 - Midjourney-style images',
    'sdxl': 'Stable Diffusion XL - Industry standard, high quality',
    'flux': 'Flux Schnell - Ultra fast, amazing quality',
    'playground': 'Playground V2.5 - Beautiful, aesthetic images',
  }
  
  return descriptions[modelName] || modelName
}
