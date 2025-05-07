# Contributing to Next.js Rewrites Plugin

Thank you for considering contributing to this project! Here's how to get started.

## Development Setup

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

## Testing Your Changes

1. Run the example applications:
   ```bash
   npm run dev
   ```

2. The example apps will be available at:
   - Main app: http://localhost:3000
   - Service app: http://localhost:3001
   - Blog app: http://localhost:3002

## Project Structure

- `packages/next-rewrites-plugin/`: The plugin source code
  - `src/`: TypeScript source files
  - `dist/`: Compiled JavaScript (generated when you build)

- `examples/`: Example applications
  - `main-app/`: The main application that uses the rewrites plugin
  - `service-app/`: Service application that gets rewritten to
  - `blog-app/`: Blog application that gets rewritten to

## Code Style

Please follow the existing code style and ensure your code passes the linting checks before submitting a PR.

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Release Process

Releases are managed by the project maintainers. The process typically involves:

1. Updating the version in package.json
2. Generating the changelog
3. Publishing to npm

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License.