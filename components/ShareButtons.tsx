'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react'
import { toast } from 'sonner'

interface ShareButtonsProps {
  title: string
  url: string
  description?: string
}

export function ShareButtons({ title, url, description = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400')
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleShare('twitter')}
        className="bg-white/5 border-white/10 text-white hover:bg-blue-500/20 hover:border-blue-500/30"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => handleShare('facebook')}
        className="bg-white/5 border-white/10 text-white hover:bg-blue-600/20 hover:border-blue-600/30"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => handleShare('linkedin')}
        className="bg-white/5 border-white/10 text-white hover:bg-blue-700/20 hover:border-blue-700/30"
      >
        <Linkedin className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={handleCopyLink}
        className="bg-white/5 border-white/10 text-white hover:bg-purple-500/20 hover:border-purple-500/30"
      >
        {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
      </Button>
    </div>
  )
}
