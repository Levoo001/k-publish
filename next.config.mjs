/** @type {import('next').NextConfig} */
const nextConfig = {
  // Windows build fixes
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  staticPageGenerationTimeout: 1000,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  reactStrictMode: true,

  // Your existing image configurations
  images: {
    domains: ["cdn.sanity.io", "img.clerk.com"],
    unoptimized: process.env.NODE_ENV === "development" ? true : false,
  },

  // Your existing turbopack configuration (for development)
    turbopack: {
      rules: {
        "*.md": {
          loaders: ["markdown-loader"],
          as: "*.md",
        },
      },
    },

  // Additional optimizations
  poweredByHeader: false,
  compress: true,
  
  // Environment variables that should be available at build time
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Redirects (optional - add as needed)
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ]
  },
}

export default nextConfig