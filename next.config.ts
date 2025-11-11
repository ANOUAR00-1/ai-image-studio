import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true,
  },
  
  // Experimental features for better performance
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'framer-motion',
      'recharts',
      'clsx',
      'tailwind-merge',
    ],
    // ⚡ Speed up navigation
    optimizeCss: true,
    scrollRestoration: true,
    // 🚀 Preload more aggressively for instant navigation
    ppr: false, // Keep false for now (experimental)
  },
  
  // ⚡ Faster page transitions
  reactStrictMode: true,
  
  // SwcMinify for better compression
  swcMinify: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60,
  },
  
  // Output file tracing - FIXED: Use import.meta for proper path resolution
  // outputFileTracingRoot: __dirname, // REMOVED: Causes issues with TS config in Next 15+
  
  // Webpack optimizations - SIMPLIFIED: Removed aggressive splitting that caused race conditions
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // Only apply custom splitting in PRODUCTION builds
      // DEV mode uses default Next.js behavior (no race conditions)
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Simpler vendor chunk (less aggressive)
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 10,
          },
        },
      }
    }
    return config
  },
}

export default nextConfig;
