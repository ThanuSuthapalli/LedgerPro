/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Performance optimizations
  compress: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, must-revalidate',
        },
      ],
    },
  ],
}

export default nextConfig
