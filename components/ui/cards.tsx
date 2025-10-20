'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

// Feature Card Component - For detailed feature showcase
interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  features?: string[]
  color?: string
  showButton?: boolean
  buttonText?: string
  onButtonClick?: () => void
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  features,
  color = "from-purple-500 to-pink-500",
  showButton = false,
  buttonText = "Learn More",
  onButtonClick
}: FeatureCardProps) {
  return (
    <Card className="group bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
      <CardContent className="p-8">
        <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
          {title}
        </h3>

        <p className="text-gray-400 mb-6 leading-relaxed">
          {description}
        </p>

        {features && features.length > 0 && (
          <ul className="space-y-3 mb-8">
            {features.map((item, idx) => (
              <li key={idx} className="flex items-start text-gray-300">
                <span className="text-purple-400 mr-3 flex-shrink-0 mt-0.5">✓</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {showButton && (
          <Button
            variant="outline"
            className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Simple Card Component - For basic feature display
interface SimpleCardProps {
  icon: LucideIcon
  title: string
  description: string
  color?: string
  showButton?: boolean
  buttonText?: string
  onButtonClick?: () => void
  href?: string
}

export function SimpleCard({
  icon: Icon,
  title,
  description,
  color = "from-purple-500/20",
  showButton = false,
  buttonText = "Learn More",
  onButtonClick,
  href
}: SimpleCardProps) {
  const handleClick = () => {
    if (href) {
      window.location.href = href
    } else if (onButtonClick) {
      onButtonClick()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group hover:shadow-2xl hover:shadow-purple-500/20">
        <CardContent className="p-6">
          <motion.div 
            className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 border border-purple-500/30`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 leading-relaxed">{description}</p>
          {showButton && (
            <Button
              variant="outline"
              className="w-full mt-4 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-500/50 hover:scale-105 transition-all"
              onClick={(e) => {
                e.stopPropagation()
                if (onButtonClick) onButtonClick()
              }}
            >
              {buttonText}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Pricing Card Component - For subscription plans
interface PricingCardProps {
  name: string
  price: string
  period: string
  credits: string
  features: string[]
  popular?: boolean
  onSelect: () => void
}

export function PricingCard({
  name,
  price,
  period,
  credits,
  features,
  popular = false,
  onSelect
}: PricingCardProps) {
  return (
    <Card className={`group bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border transition-all duration-500 hover:scale-[1.02] relative ${
      popular
        ? 'border-2 border-purple-500 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50'
        : 'border-white/10 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10'
    }`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 border-0 px-6 py-2 text-sm font-bold shadow-lg rounded-full">
          Most Popular
        </div>
      )}
      <CardContent className="p-10 text-center">
        <h3 className="text-3xl font-black text-white mb-6 group-hover:text-purple-300 transition-colors">{name}</h3>
        <div className="mb-3">
          <span className="text-6xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{price}</span>
          <span className="text-gray-400 text-xl">{period}</span>
        </div>
        <p className="text-purple-400 font-bold text-lg mb-8">{credits}</p>
        <ul className="space-y-4 mb-10 text-left">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-gray-300">
              <span className="text-green-400 mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className={`w-full h-12 text-base font-bold transition-all duration-300 ${
            popular
              ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 hover:scale-105'
          }`}
          onClick={onSelect}
        >
          {name === "Free" ? "Start Free" : "Get Started"}
        </Button>
      </CardContent>
    </Card>
  )
}

// Testimonial Card Component
interface TestimonialCardProps {
  name: string
  role: string
  content: string
  rating: number
  initials?: string
}

export function TestimonialCard({
  name,
  role,
  content,
  rating,
  initials
}: TestimonialCardProps) {
  return (
    <Card className="group bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
      <CardContent className="p-8">
        <div className="flex items-center space-x-4 mb-6">
          {initials && (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {initials}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <p className="text-sm text-gray-400">{role}</p>
          </div>
        </div>

        <p className="text-gray-300 mb-6 leading-relaxed">
          &quot;{content}&quot;
        </p>

        <div className="flex gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <span key={i} className="text-yellow-400">★</span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Info Card Component - For contact/support info
interface InfoCardProps {
  icon: LucideIcon
  title: string
  details: string[]
  color?: string
}

export function InfoCard({
  icon: Icon,
  title,
  details,
  color = "from-purple-500 to-blue-500"
}: InfoCardProps) {
  return (
    <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
      <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="space-y-2">
        {details.map((detail, idx) => (
          <p key={idx} className="text-gray-400">{detail}</p>
        ))}
      </div>
    </div>
  )
}
