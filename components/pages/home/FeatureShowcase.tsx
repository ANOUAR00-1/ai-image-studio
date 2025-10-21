import { FeatureCard } from "@/components/ui/cards"
import { ImageIcon, Video, Wand2 } from "lucide-react"

export function FeatureShowcase() {
  const features = [
    {
      icon: ImageIcon,
      title: "AI Image Generation",
      description: "Create stunning images from text descriptions with our advanced AI models",
      features: [
        "Text-to-image conversion",
        "Style transfer and customization",
        "High-resolution outputs",
        "Batch generation"
      ],
      color: "from-pink-500 to-purple-500"
    },
    {
      icon: Video,
      title: "AI Video Creation",
      description: "Generate professional videos from text prompts or animate your images",
      features: [
        "Text-to-video generation",
        "Image animation",
        "Video style transfer",
        "Automated editing"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Wand2,
      title: "Smart Editing Tools",
      description: "Enhance, modify, and perfect your visuals with AI-powered editing",
      features: [
        "Background removal",
        "Object removal and replacement",
        "Color correction and enhancement",
        "Upscaling and denoising"
      ],
      color: "from-purple-500 to-pink-500"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-[#0a0a1f] to-[#0f0520]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            Powerful Features for Creators
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Everything you need to bring your creative vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              features={feature.features}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
