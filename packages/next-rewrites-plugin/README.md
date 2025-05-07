# next-rewrites-plugin

A Next.js plugin for dynamically managing rewrites from configuration files. Ideal for Next.js multi-zone applications.

## Features

- Easily add rewrites by creating configuration files
- Support for feature flagged rewrites
- Hot reloading - changes to rewrite files are picked up without restarting
- Works with Next.js multi-zone applications
- Full support for App Router
- Middleware-based rewrites for maximum flexibility

## Installation

```bash
npm install next-rewrites-plugin
# or
yarn add next-rewrites-plugin
```

## Usage

### 1. Add the plugin to your Next.js config

```js
// next.config.js
const withRewrites = require('next-rewrites-plugin').default;

module.exports = withRewrites({
  // Optional plugin configuration
  dir: 'rewrites', // Directory containing rewrite configurations
  useMiddleware: true, // Use middleware.ts instead of Next.js rewrites config
  isFeatureFlagEnabled: (flag) => {
    // Your feature flag implementation
    return process.env[`FEATURE_${flag.toUpperCase()}`] === 'true';
  }
})(
  // Your existing Next.js config
  {
    // For multi-zone setups, set a unique assetPrefix
    assetPrefix: process.env.ASSET_PREFIX,
    // ...other Next.js config options
  }
);
```

### 2. Create rewrite configuration files

Create files in the `rewrites` directory (or your custom directory specified in the plugin options).

```js
// rewrites/registration.js
module.exports = {
  externalUrl: 'https://registration.example.com',
  // Optional feature flag - if present, the rewrite will only be active if enabled
  featureFlag: 'NEW_REGISTRATION_FLOW',
  // Optional source path - defaults to '/registration' based on filename
  source: '/register/:path*',
  // Optional destination path - defaults to same path at externalUrl
  destination: '/new-registration/:path*',
  // Optional setting for cross-zone navigation behavior
  hardNavigation: true, // Use <a> tags instead of <Link> components for this route
}
```

If you don't specify a `source`, it will be automatically generated from the filename. For example, a file named `registration.js` will have a source of `/registration`.

If you don't specify a `destination`, it will use the same path at the external URL.

## Middleware vs Next.js Rewrites Config

This plugin supports two modes of operation:

### 1. Middleware Mode (Recommended)

When `useMiddleware: true` is set, the plugin will:
- Generate a `middleware.ts` file in your project root
- Automatically update the middleware when rewrite configs change
- Handle rewrites using Next.js middleware, which is more flexible and works well with the App Router

This mode is ideal for:
- App Router applications
- Multi-zone setups
- When you need maximum flexibility with rewrites

### 2. Next.js Rewrites Config Mode

When `useMiddleware` is not set or is `false`, the plugin will:
- Modify the Next.js config to include your rewrites
- Use the standard Next.js rewrites configuration

This mode is better for simpler setups or when you specifically need to use Next.js native rewrites.

## Multi-Zone Best Practices

When using this plugin for multi-zone applications, follow these best practices:

1. **Use middleware mode** for maximum compatibility with App Router
2. **Set unique asset prefixes** for each zone to avoid asset conflicts
3. **Use path patterns** with wildcards (`/:path*`) to ensure all nested routes are captured
4. **Enable `hardNavigation: true`** for cross-zone links to ensure proper navigation
5. **Configure proper Server Actions settings** if using across zones

## Rewrite Configuration

Each rewrite configuration file should export an object with the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `externalUrl` | `string` | Yes | The base URL of the external zone to rewrite to |
| `featureFlag` | `string` | No | Optional feature flag name - if provided, the rewrite will only be active if the flag is enabled |
| `source` | `string` | No | Path pattern to match - defaults to filename if not provided |
| `destination` | `string` | No | Path to rewrite to - defaults to same path at externalUrl if not provided |
| `hardNavigation` | `boolean` | No | Whether to use hard navigation for cross-zone links (recommended for multi-zone setups) |

## Examples

### Basic rewrite

```js
// rewrites/auth.js
module.exports = {
  externalUrl: 'https://auth.example.com',
}
```

This will rewrite `/auth` to `https://auth.example.com/auth`.

### Rewrite with custom paths and feature flag

```js
// rewrites/products.js
module.exports = {
  externalUrl: 'https://catalog.example.com',
  featureFlag: 'NEW_CATALOG',
  source: '/products/:category/:id',
  destination: '/catalog/:category/items/:id'
}
```

This will rewrite `/products/electronics/12345` to `https://catalog.example.com/catalog/electronics/items/12345`, but only if the `NEW_CATALOG` feature flag is enabled.

### Capturing all nested routes

```js
// rewrites/dashboard.js
module.exports = {
  externalUrl: 'https://dashboard.example.com',
  source: '/dashboard/:path*',
  destination: '/dashboard/:path*',
  hardNavigation: true
}
```

This will rewrite all routes under `/dashboard` to the external zone, including nested routes like `/dashboard/settings/profile`.

## License

MIT