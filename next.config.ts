import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Disable telemetry and tracing to avoid file lock issues
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
}

export default nextConfig;
