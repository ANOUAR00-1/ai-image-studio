import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, AlertCircle, CreditCard, Shield, Scale, Users } from 'lucide-react'

export function TermsPage() {
  const sections = [
    {
      icon: Users,
      title: 'Acceptance of Terms',
      content: `By accessing and using PixFusion AI, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use our services.`
    },
    {
      icon: FileText,
      title: 'Use License',
      content: `We grant you a personal, non-exclusive, non-transferable license to use our platform for your creative projects. You may not sublicense, sell, or commercially exploit our services without written permission.`
    },
    {
      icon: CreditCard,
      title: 'Payment Terms',
      content: `Subscription fees are billed in advance on a monthly or annual basis. All payments are non-refundable except as required by law or as specified in our refund policy. Credits do not roll over to the next billing period.`
    },
    {
      icon: Shield,
      title: 'User Content',
      content: `You retain all rights to the content you create using our platform. However, you grant us a license to use, store, and process your content to provide our services. We do not claim ownership of your creations.`
    },
    {
      icon: AlertCircle,
      title: 'Prohibited Uses',
      content: `You may not use our services to create illegal, harmful, or offensive content. This includes content that violates intellectual property rights, promotes violence, or contains explicit material involving minors.`
    },
    {
      icon: Scale,
      title: 'Limitation of Liability',
      content: `PixFusion AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our total liability shall not exceed the amount paid by you in the last 12 months.`
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a1f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Legal
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-300">
            Last updated: October 9, 2025
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <p className="text-gray-300 text-lg leading-relaxed">
                Welcome to PixFusion AI. These Terms of Service (&quot;Terms&quot;) govern your access to and use 
                of our platform, services, and applications. By using PixFusion AI, you agree to comply 
                with these Terms. Please read them carefully before using our services.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-6 mb-12">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.05 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-white mb-3">
                          {section.title}
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-6 mb-12"
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Termination
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to terminate or suspend your account and access to our services 
                at our sole discretion, without notice, for conduct that we believe violates these 
                Terms or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Changes to Terms
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We may modify these Terms at any time. We will notify you of any material changes 
                by posting the new Terms on our platform and updating the &quot;Last updated&quot; date. Your 
                continued use of our services after such modifications constitutes acceptance of the updated Terms.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Governing Law
              </h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the 
                State of California, United States, without regard to its conflict of law provisions. 
                Any disputes shall be resolved in the courts located in San Francisco, California.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Questions About Our Terms?
              </h2>
              <p className="text-gray-300 mb-6">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-purple-300 font-semibold">
                legal@pixfusion.ai
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

