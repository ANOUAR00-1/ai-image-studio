import { supabaseAdmin } from '@/lib/supabase/server'

export class StorageService {
  private static BUCKET_NAME = 'ai-generations'
  private static EXAMPLES_BUCKET = 'ai-examples'

  // Upload generated image to Supabase Storage
  static async uploadGeneratedImage(
    userId: string,
    imageBlob: Blob,
    fileName?: string
  ): Promise<string> {
    try {
      const timestamp = Date.now()
      const finalFileName = fileName || `${userId}/${timestamp}.png`

      // Upload to Supabase Storage
      const { data, error } = await supabaseAdmin.storage
        .from(this.BUCKET_NAME)
        .upload(finalFileName, imageBlob, {
          contentType: 'image/png',
          upsert: false
        })

      if (error) {
        console.error('Storage upload error:', error)
        throw new Error(`Failed to upload image: ${error.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(data.path)

      return publicUrl
    } catch (error) {
      console.error('Upload generated image error:', error)
      throw error
    }
  }

  // Delete image from storage
  static async deleteImage(url: string): Promise<void> {
    try {
      // Extract file path from URL
      const urlParts = url.split(`/${this.BUCKET_NAME}/`)
      if (urlParts.length < 2) return

      const filePath = urlParts[1]

      const { error } = await supabaseAdmin.storage
        .from(this.BUCKET_NAME)
        .remove([filePath])

      if (error) {
        console.error('Storage delete error:', error)
      }
    } catch (error) {
      console.error('Delete image error:', error)
    }
  }

  // Upload image blob to Supabase Storage (examples)
  static async uploadImage(
    file: Blob | File | Buffer,
    filename: string
  ): Promise<string> {
    try {
      console.log(`[Storage] Uploading ${filename}...`)
      
      // Convert Blob to ArrayBuffer if needed
      const buffer = file instanceof Blob 
        ? Buffer.from(await file.arrayBuffer())
        : file instanceof Buffer
        ? file
        : Buffer.from(file)

      console.log(`[Storage] Buffer size: ${buffer.length} bytes`)

      // Upload to Supabase Storage
      const { data, error } = await supabaseAdmin
        .storage
        .from(this.BUCKET_NAME)
        .upload(`examples/${filename}`, buffer, {
          contentType: 'image/jpeg',
          upsert: true
        })

      if (error) {
        console.error('[Storage] Upload error:', error)
        throw error
      }

      console.log(`[Storage] ✓ Uploaded to: ${data.path}`)

      // Get public URL
      const { data: publicData } = supabaseAdmin
        .storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(data.path)

      console.log(`[Storage] ✓ Public URL: ${publicData.publicUrl}`)
      return publicData.publicUrl
    } catch (error) {
      console.error('[Storage] ❌ Storage upload error:', error)
      if (error instanceof Error) {
        console.error('[Storage] Error details:', error.message)
      }
      throw new Error(`Failed to upload image to storage: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Create bucket if it doesn't exist
  static async ensureBucketExists(): Promise<void> {
    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets()
      
      const bucketExists = buckets?.some(b => b.name === this.BUCKET_NAME)
      
      if (!bucketExists) {
        const { error } = await supabaseAdmin.storage.createBucket(this.BUCKET_NAME, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        })
        
        if (error) throw error
        console.log(`✓ Created storage bucket: ${this.BUCKET_NAME}`)
      }
    } catch (error) {
      console.error('Bucket creation error:', error)
      // Don't throw - bucket might already exist
    }
  }
}
