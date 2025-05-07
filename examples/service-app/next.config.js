/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure features for Next.js 15
  serverExternalPackages: [],
  
  // Set a different asset prefix for the service zone
  // This helps avoid asset conflicts between zones in a multi-zone setup
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://service-assets.example.com' : '',
  
  // Configure server actions to allow the main app domain
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001']
    }
  }
};

module.exports = nextConfig;