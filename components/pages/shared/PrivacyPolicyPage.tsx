import { motion } from 'motion/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react'

export function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This includes your name, email address, payment information, and content you create using our platform.`
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: `We use the information we collect to provide, maintain, and improve our services, process your transactions, send you technical notices and support messages, and respond to your comments and questions.`
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We use encryption, secure servers, and regular security audits.`
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: `You have the right to access, update, or delete your personal information at any time. You can also object to processing, request data portability, and withdraw consent where applicable.`
    },
    {
      icon: Shield,
      title: 'Data Retention',
      content: `We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. When you delete your account, we will delete your data within 30 days.`
    },
    {
      icon: FileText,
      title: 'Third-Party Services',
      content: `We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, and customer support. These providers are bound by confidentiality agreements.`
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
            Privacy Policy
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
                At PixFusion AI, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our platform. Please read this 
                privacy policy carefully. If you do not agree with the terms of this privacy policy, please 
                do not access the site or use our services.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Policy Sections */}
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

        {/* GDPR Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                GDPR Compliance
              </h2>
              <p className="text-gray-300 mb-4">
                If you are a resident of the European Economic Area (EEA), you have certain data 
                protection rights under the General Data Protection Regulation (GDPR).
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• The right to access your personal data</li>
                <li>• The right to rectification of inaccurate data</li>
                <li>• The right to erasure (&quot;right to be forgotten&quot;)</li>
                <li>• The right to restrict processing</li>
                <li>• The right to data portability</li>
                <li>• The right to object to processing</li>
              </ul>
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
                Questions About Privacy?
              </h2>
              <p className="text-gray-300 mb-6">
                If you have questions or concerns about our privacy policy, please contact us at:
              </p>
              <p className="text-purple-300 font-semibold">
                privacy@pixfusion.ai
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

