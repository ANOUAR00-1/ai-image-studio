/**
 * Image Processing Service - 100% FREE!
 * Handles background removal, enhancement, and style transfer
 * Uses FREE open-source models via Hugging Face
 * NO PAID APIs - Everything is FREE!
 */

import { FreeImageToolsService } from './free-image-tools.service'

export class ImageProcessingService {
  
  // Remove background using FREE open-source models ONLY
  static async removeBackground(imageBase64: string): Promise<string> {
    console.log('🎨 Removing background with FREE HuggingFace (RMBG-1.4)...')
    return await FreeImageToolsService.removeBackground(imageBase64)
  }

  // Enhance quality using FREE open-source models ONLY
  static async enhanceQuality(imageBase64: string): Promise<string> {
    console.log('✨ Enhancing quality with FREE HuggingFace (SwinIR)...')
    return await FreeImageToolsService.enhanceQuality(imageBase64)
  }

  // Style transfer using FREE open-source models ONLY
  static async styleTransfer(imageBase64: string, style: string = 'anime'): Promise<string> {
    console.log(`🎨 Applying style transfer with FREE HuggingFace (AnimeGANv2)...`)
    return await FreeImageToolsService.styleTransfer(imageBase64, style)
  }
}
