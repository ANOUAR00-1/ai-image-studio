"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Wand2, Palette, Zap, ArrowRight, Download, Loader2, Video, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { getModelDisplayName } from "@/lib/utils/model-names"
import SpotlightCard from "@/components/ui/SpotlightCard"

interface Example {
  id: string
  title: string
  category: string
  prompt: string
  image_url?: string
  video_url?: string
  type: 'image' | 'video'
  model: string
  credits_used: number
}

export function ExamplesShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  // VIDEO DISABLED - Type filter not used
  // const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all')
  const [examples, setExamples] = useState<Example[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch featured examples from examples table (privacy-safe)
  const fetchExamples = useCallback(async () => {
    try {
      setLoading(true)
      // Fetch curated featured examples (not user generations)
      const response = await fetch(`/api/examples/generate?category=${selectedCategory}&type=image`)
      const data = await response.json()
      
      if (data.success && data.data.examples) {
        setExamples(data.data.examples)
      }
    } catch (error) {
      console.error('Failed to fetch examples:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    fetchExamples()
  }, [fetchExamples])

  const categories = [
    { id: "all", name: "All Examples", icon: Sparkles },
    { id: "portraits", name: "Portraits", icon: Wand2 },
    { id: "landscapes", name: "Landscapes", icon: Palette },
    { id: "abstract", name: "Abstract Art", icon: Zap },
  ]

  // Color gradients for categories (for visual effect)
  const getGradientColor = (category: string, index: number) => {
    const colors = {
      portraits: ["from-purple-500 to-pink-600", "from-pink-500 to-rose-600", "from-indigo-500 to-blue-600", "from-red-500 to-orange-600"],
      landscapes: ["from-blue-500 to-cyan-600", "from-green-500 to-teal-600", "from-orange-500 to-red-600", "from-amber-500 to-orange-600"],
      abstract: ["from-pink-500 to-purple-600", "from-indigo-500 to-purple-600", "from-yellow-500 to-orange-600"]
    }
    const categoryColors = colors[category as keyof typeof colors] || ["from-purple-500 to-pink-600"]
    return categoryColors[index % categoryColors.length]
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Generated Examples
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
              See What&apos;s
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                Possible
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Explore stunning AI-generated images created with PixFusion AI. From portraits to landscapes, see the endless possibilities.
            </p>

            <Link href="/image-tools">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/50 text-lg px-8 py-6 h-auto">
                Start Creating
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Type Filter - VIDEO COMMENTED OUT */}
      {/* <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <Button
              variant={selectedType === 'all' ? "default" : "outline"}
              className={`${
                selectedType === 'all'
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                  : "bg-white/5 border-white/20 text-white hover:bg-white/10"
              } transition-all duration-300`}
              onClick={() => setSelectedType('all')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              All
            </Button>
            <Button
              variant={selectedType === 'image' ? "default" : "outline"}
              className={`${
                selectedType === 'image'
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                  : "bg-white/5 border-white/20 text-white hover:bg-white/10"
              } transition-all duration-300`}
              onClick={() => setSelectedType('image')}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Images
            </Button>
            <Button
              variant={selectedType === 'video' ? "default" : "outline"}
              className={`${
                selectedType === 'video'
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                  : "bg-white/5 border-white/20 text-white hover:bg-white/10"
              } transition-all duration-300`}
              onClick={() => setSelectedType('video')}
            >
              <Video className="w-4 h-4 mr-2" />
              Videos
            </Button>
          </div> */}
          
      {/* Category Filter */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                      : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                  } transition-all duration-300`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Examples Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
          ) : examples.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Examples Yet</h3>
              <p className="text-gray-400 mb-6">
                AI examples are being generated. Check back soon!
              </p>
              <Link href="/image-tools">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Create Your Own
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {examples.map((example, index) => (
                <motion.div
                  key={example.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <SpotlightCard className="group hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] overflow-hidden p-0" spotlightColor="rgba(168, 85, 247, 0.12)">
                    {/* Media (Image or Video) */}
                    <div className="relative aspect-square overflow-hidden">
                      {example.type === 'video' && example.video_url ? (
                        <video
                          src={example.video_url}
                          className="w-full h-full object-cover"
                          controls
                          loop
                          muted
                          playsInline
                        />
                      ) : example.image_url ? (
                        <Image
                          src={example.image_url}
                          alt={example.title}
                          width={800}
                          height={800}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : null}
                      <div className={`absolute inset-0 bg-gradient-to-t ${getGradientColor(example.category, index)} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                      
                      {/* Type Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className={`${
                          example.type === 'video' 
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
                            : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        }`}>
                          {example.type === 'video' ? (
                            <><Video className="w-3 h-3 mr-1" /> Video</>
                          ) : (
                            <><ImageIcon className="w-3 h-3 mr-1" /> Image</>
                          )}
                        </Badge>
                      </div>
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = example.type === 'video' ? (example.video_url || '') : (example.image_url || '')
                            link.download = `${example.title.replace(/\s+/g, '-').toLowerCase()}.${example.type === 'video' ? 'mp4' : 'jpg'}`
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                          }}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-white font-bold mb-2 group-hover:text-purple-300 transition-colors">
                        {example.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {example.prompt}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          {getModelDisplayName(example.model)}
                        </Badge>
                        <span className="text-gray-500">{example.credits_used} credits</span>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SpotlightCard className="max-w-4xl mx-auto bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 p-12 text-center" spotlightColor="rgba(236, 72, 153, 0.15)">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Your Own?</h2>
            <p className="text-gray-300 text-lg mb-8">
              Start generating stunning AI images like these in seconds
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/image-tools">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/50">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Create Images
                </Button>
              </Link>
              {/* VIDEO TOOLS COMMENTED OUT */}
              {/* <Link href="/video-tools">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-blue-500/50">
                  <Video className="w-4 h-4 mr-2" />
                  Create Videos
                </Button>
              </Link> */}
              <Link href="/pricing">
                <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                  View Pricing
                </Button>
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </section>
    </div>
  )
}
