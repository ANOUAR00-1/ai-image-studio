import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  User,
  ArrowRight,
  TrendingUp,
  Clock,
  Tag
} from "lucide-react"

export function BlogPage() {
  const posts = [
    {
      title: 'Introducing PixFusion AI 2.0: Next-Gen Image Generation',
      excerpt: 'We\'re excited to announce the biggest update to our AI platform yet, featuring faster processing, better quality, and new creative tools.',
      category: 'Product Updates',
      date: 'October 8, 2025',
      author: 'Sarah Chen',
      readTime: '5 min read',
      featured: true,
      tags: ['AI', 'Updates', 'Image Generation']
    },
    {
      title: 'How AI is Transforming Creative Industries',
      excerpt: 'Explore how artificial intelligence is revolutionizing design, marketing, and content creation across industries.',
      category: 'Industry Insights',
      date: 'October 5, 2025',
      author: 'Michael Rodriguez',
      readTime: '8 min read',
      featured: false,
      tags: ['AI', 'Creativity', 'Industry']
    },
    {
      title: 'Best Practices for AI-Generated Content',
      excerpt: 'Learn professional tips and techniques for getting the most out of AI image and video generation tools.',
      category: 'Tutorials',
      date: 'October 2, 2025',
      author: 'Emily Watson',
      readTime: '6 min read',
      featured: false,
      tags: ['Tutorial', 'Best Practices', 'AI']
    },
    {
      title: 'Behind the Scenes: Training Our AI Models',
      excerpt: 'A deep dive into how we train and refine our AI models to deliver exceptional quality and accuracy.',
      category: 'Technology',
      date: 'September 28, 2025',
      author: 'David Park',
      readTime: '10 min read',
      featured: false,
      tags: ['AI', 'Technology', 'Models']
    },
    {
      title: 'The Future of Content Creation with AI',
      excerpt: 'Discover how AI is democratizing creative tools and empowering creators worldwide.',
      category: 'Insights',
      date: 'September 25, 2025',
      author: 'Lisa Zhang',
      readTime: '7 min read',
      featured: false,
      tags: ['AI', 'Future', 'Creativity']
    },
    {
      title: 'API Integration Guide: Getting Started',
      excerpt: 'Complete guide to integrating PixFusion AI into your applications and workflows.',
      category: 'Developer',
      date: 'September 22, 2025',
      author: 'Alex Johnson',
      readTime: '12 min read',
      featured: false,
      tags: ['API', 'Integration', 'Developer']
    }
  ]

  const categories = ['All', 'Product Updates', 'Tutorials', 'Industry Insights', 'Technology', 'Developer']
  const featuredPost = posts.find(post => post.featured)

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
              <TrendingUp className="w-4 h-4 mr-2" />
              Blog & Insights
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Stay Ahead of the
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                AI Curve
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed mb-12">
              Insights, tutorials, and updates from the forefront of AI-powered creative tools.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="btn-primary inline-flex px-6 py-2">
                  Featured Article
                </Badge>
              </div>

              <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
                <CardContent className="p-8 lg:p-12">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {featuredPost.category}
                    </Badge>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {featuredPost.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="bg-white/5 border-white/20 text-gray-300">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="btn-primary">
                    Read Full Article
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, idx) => (
              <Button
                key={idx}
                variant={idx === 0 ? "default" : "outline"}
                className={idx === 0
                  ? "btn-primary"
                  : "btn-secondary"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {posts.filter(post => !post.featured).map((post, index) => (
              <Card key={index} className="group bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 2).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-white/5 border-white/20 text-gray-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                    Read More
                    <ArrowRight className="ml-2 w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-purple-600/30 border-2 border-purple-500/40 backdrop-blur-2xl shadow-2xl shadow-purple-500/30">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Never Miss an Update
              </h2>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Get the latest AI insights, tutorials, and product updates delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500/50 backdrop-blur-sm"
                />
                <Button className="btn-primary whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
