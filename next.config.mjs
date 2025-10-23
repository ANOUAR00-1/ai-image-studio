import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
  // Performance Optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-icons'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Disable development indicators
  devIndicators: false,
  // Enable React strict mode for better performance warnings
  reactStrictMode: true,
  // Compress responses
  compress: true,
  // Output file tracing
  outputFileTracingRoot: __dirname,
  // Bundle analyzer (run with ANALYZE=true npm run build)
  ...(process.env.ANALYZE === 'true' && {
    webpack: async (config, { isServer }) => {
      if (!isServer) {
        const { default: BundleAnalyzerPlugin } = await import('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin.BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: './analyze.html',
            openAnalyzer: true,
          })
        )
      }
      return config
    },
  }),
}

export default nextConfig
