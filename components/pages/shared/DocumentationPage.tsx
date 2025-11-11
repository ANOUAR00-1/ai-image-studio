import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Code,
  Image as ImageIcon,
  Video,
  Terminal,
  Database,
  Key,
  ChevronRight,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

export function DocumentationPage() {
  const sections = [
    {
      title: 'Getting Started',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      link: '/documentation/getting-started',
      articles: [
        { title: 'Quick Start Guide', description: 'Get up and running in 5 minutes', link: '/documentation/getting-started' },
        { title: 'Understanding Credits', description: 'How our credit system works', link: '/documentation/getting-started' },
        { title: 'First AI Generation', description: 'Create your first AI image', link: '/documentation/getting-started' },
        { title: 'Account Setup', description: 'Configure your profile and preferences', link: '/documentation/getting-started' },
      ]
    },
    {
      title: 'Image Tools',
      icon: ImageIcon,
      color: 'from-purple-500 to-pink-500',
      link: '/documentation/image-tools',
      articles: [
        { title: 'Text-to-Image Generation', description: 'Create images from text prompts', link: '/documentation/image-tools' },
        { title: 'Background Removal', description: 'Remove backgrounds automatically', link: '/documentation/image-tools' },
        { title: 'Image Enhancement', description: 'Upscale and enhance images', link: '/documentation/image-tools' },
        { title: 'Style Transfer', description: 'Apply artistic styles to images', link: '/documentation/image-tools' },
        { title: 'Batch Processing', description: 'Process multiple images simultaneously', link: '/documentation/image-tools' },
      ]
    },
    {
      title: 'Video Tools',
      icon: Video,
      color: 'from-green-500 to-emerald-500',
      link: '/documentation/video-tools',
      articles: [
        { title: 'Text-to-Video', description: 'Generate videos from descriptions', link: '/documentation/video-tools' },
        { title: 'Video Editing', description: 'Edit videos with AI assistance', link: '/documentation/video-tools' },
        { title: 'Video Enhancement', description: 'Improve video quality', link: '/documentation/video-tools' },
        { title: 'Animation Tools', description: 'Create animations from images', link: '/documentation/video-tools' },
      ]
    },
    {
      title: 'API & Integration',
      icon: Code,
      color: 'from-orange-500 to-red-500',
      link: '/documentation/api',
      articles: [
        { title: 'API Documentation', description: 'Complete API reference', link: '/documentation/api' },
        { title: 'Authentication', description: 'API key setup and usage', link: '/documentation/api' },
        { title: 'Rate Limits', description: 'Understanding API limits', link: '/documentation/api' },
        { title: 'Webhook Integration', description: 'Set up webhooks for notifications', link: '/documentation/api' },
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0520] via-[#1a0f2e] to-[#0a0118]">
      {/* Header */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-4 py-2">
              <BookOpen className="w-4 h-4 mr-2" />
              Documentation
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                Know
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed mb-12">
              Comprehensive guides, tutorials, and API documentation to help you get the most out of PixFusion AI.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Terminal className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-4">Quick Start Guide</CardTitle>
                <p className="text-gray-300 text-lg">Get started in under 5 minutes</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-3">1. Sign Up</h3>
                    <p className="text-gray-400">Create your account and get 10 free credits to explore our AI tools.</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-3">2. Choose a Tool</h3>
                    <p className="text-gray-400">Pick from our image generation, editing, or video creation tools.</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-3">3. Generate</h3>
                    <p className="text-gray-400">Enter your prompt or upload an image and let our AI do the magic.</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-3">4. Download</h3>
                    <p className="text-gray-400">Download your creation in high quality and share it with the world.</p>
                  </div>
                </div>
                <div className="text-center pt-6">
                  <Link href="/documentation/getting-started">
                    <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white border-0 shadow-lg shadow-pink-500/50">
                      Start Your Journey
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Explore Our Documentation
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive guides and tutorials for every feature and integration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <Card key={index} className="group bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                        {section.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {section.articles.map((article, idx) => (
                        <Link key={idx} href={article.link}>
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group/article cursor-pointer">
                            <div>
                              <h4 className="text-white font-semibold mb-1 group-hover/article:text-purple-300 transition-colors">
                                {article.title}
                              </h4>
                              <p className="text-gray-400 text-sm">{article.description}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover/article:text-purple-400 transition-colors" />
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link href={section.link}>
                      <Button variant="outline" className="w-full mt-6 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                        View All {section.title} Docs
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Developer Resources</h2>
                <p className="text-gray-300 text-lg mb-8">
                  Integrate PixFusion AI into your applications with our comprehensive API
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <Key className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold mb-1">API Keys</h3>
                    <p className="text-gray-400 text-sm">Secure authentication</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <Code className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold mb-1">SDKs</h3>
                    <p className="text-gray-400 text-sm">Multiple languages</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <Terminal className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold mb-1">CLI Tools</h3>
                    <p className="text-gray-400 text-sm">Command line access</p>
                  </div>
                </div>
                <Link href="/documentation/api">
                  <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white border-0 shadow-lg shadow-pink-500/50">
                    View API Documentation
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
