// Import the plugin using CommonJS
const rewrites = require('next-rewrites-plugin');
const withRewrites = rewrites.default;

// Mock feature flag checking function
const isFeatureFlagEnabled = (flag) => {
  // For simplicity in testing, we'll make the registration flag dynamically accessible
  // In a real app, this would be stored in a more persistent way or fetched from an API
  const getRegistrationFlag = () => {
    try {
      // Try to read from global state (won't work across requests)
      return global.__featureFlags?.NEW_REGISTRATION === true;
    } catch (e) {
      return false;
    }
  };

  const flags = {
    NEW_REGISTRATION: getRegistrationFlag(),
    TEST_FEATURE: true
  };
  
  const result = flags[flag] || false;
  console.log(`[Feature Flag] ${flag} = ${result}`);
  return result;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure features for Next.js 15
  serverExternalPackages: [],
  
  // Set a different asset prefix for the main zone
  // This helps avoid asset conflicts between zones in a multi-zone setup
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://main-assets.example.com' : '',
  
  // Configure server actions to allow across zones
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001']
    }
  }
};

module.exports = withRewrites({
  dir: 'rewrites',
  isFeatureFlagEnabled,
  useMiddleware: true // Use middleware.ts instead of Next.js rewrites config
})(nextConfig);