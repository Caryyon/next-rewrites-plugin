/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure features for Next.js 15
  serverExternalPackages: [],

  // Set a different asset prefix for the blog zone
  // This helps avoid asset conflicts between zones in a multi-zone setup
  assetPrefix:
    process.env.NODE_ENV === "production"
      ? "https://blog-assets.example.com"
      : "",
      
  // Set the base path for the blog app
  basePath: '/blog',
};

module.exports = nextConfig;
