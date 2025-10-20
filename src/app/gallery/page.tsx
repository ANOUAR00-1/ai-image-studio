import ImageGallery from '@/components/pages/gallery/ImageGallery'

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Generations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View, download, and manage all your AI creations
          </p>
        </div>
        <ImageGallery />
      </div>
    </div>
  )
}
