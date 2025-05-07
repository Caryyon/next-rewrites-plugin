# Next.js Rewrites Plugin Monorepo

This monorepo contains the Next.js Rewrites Plugin and example applications that demonstrate its usage in a multi-zone setup.

## Structure

- `packages/next-rewrites-plugin`: The plugin source code
- `examples`: Example applications showcasing the plugin functionality
  - `main-app`: The main application (port 3000)
  - `service-app`: Service application for handling registration (port 3001)
  - `blog-app`: Blog application (port 3002)

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/next-rewrites-plugin.git
   cd next-rewrites-plugin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the plugin:
   ```bash
   npm run build
   ```

4. Run the example applications:
   ```bash
   npm run dev
   ```

5. Visit http://localhost:3000 to test the multi-zone setup

## Plugin Features

The Next.js Rewrites Plugin simplifies the creation of multi-zone applications by:

- Generating middleware for handling rewrites between zones
- Supporting feature flags for conditional rewrites
- Working seamlessly with the App Router
- Providing a simple configuration system through the `rewrites/` directory

## License

MIT