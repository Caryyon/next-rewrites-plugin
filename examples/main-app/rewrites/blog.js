// Configuration for the blog rewrite
module.exports = {
  externalUrl: "http://localhost:3002",
  source: "/blog/:path*",
  destination: "/blog/:path*",
  // Follow Next.js multi-zone best practices
  hardNavigation: true,
};