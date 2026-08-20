import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  experimental: {
    serverActions: {
      // Default is 1MB, too small for real event photography/media library
      // uploads (see src/lib/actions/admin/media.ts).
      bodySizeLimit: '15mb',
    },
  },
}

export default nextConfig
