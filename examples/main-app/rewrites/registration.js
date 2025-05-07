// Example with path patterns for multi-zone setup
module.exports = {
  externalUrl: "http://localhost:3001",
  // featureFlag: process.env.NEW_REGISTRATION,
  source: "/registration/:path*",
  destination: "/registration/:path*",
  // Follow Next.js multi-zone best practices
  hardNavigation: true,
};
