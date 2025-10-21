/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['replicate.delivery', 'huggingface.co', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // PWA Configuration
  experimental: {
    optimizeCss: true,
  },
  // Completely disable all development indicators forever
  devIndicators: false,
}

export default nextConfig
