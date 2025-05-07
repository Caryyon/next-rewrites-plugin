import { NextConfig } from 'next';
import { RewritesPluginOptions } from './types';
import { createRewritesWatcher, processRewrites, readRewriteConfigs, generateMiddleware } from './utils';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Next.js plugin for dynamically managing rewrites from config files
 */
export default function withRewrites(options: RewritesPluginOptions = {}) {
  return (nextConfig: NextConfig = {}): NextConfig => {
    // Store the original configuration
    const originalRewrites = nextConfig.rewrites;
    const originalAssetPrefix = nextConfig.assetPrefix;
    
    // If using middleware, generate the middleware file
    if (options.useMiddleware !== false) {
      const rootDir = process.cwd();
      
      // Generate middleware.ts immediately
      generateMiddleware(rootDir, options).catch(err => {
        console.error('[next-rewrites-plugin] Error generating middleware:', err);
      });
      
      // Set up watcher for development
      if (process.env.NODE_ENV === 'development') {
        const watcher = createRewritesWatcher(
          rootDir,
          options,
          async () => {
            try {
              await generateMiddleware(rootDir, options);
              console.log('[next-rewrites-plugin] Regenerated middleware.ts after config change');
            } catch (err) {
              console.error('[next-rewrites-plugin] Error regenerating middleware:', err);
            }
          }
        );
        
        // Handle process exit
        process.on('exit', () => {
          watcher?.close();
        });
      }
      
      // When using middleware, we don't need to modify the Next.js config
      return {
        ...nextConfig,
        assetPrefix: originalAssetPrefix,
      };
    }
    
    // Legacy mode: use Next.js rewrites config
    return {
      ...nextConfig,
      assetPrefix: originalAssetPrefix,
      
      rewrites: async () => {
        // Load all rewrite configurations
        const rootDir = process.cwd();
        const rewriteConfigs = await readRewriteConfigs(rootDir, options);
        const processedRewrites = processRewrites(rewriteConfigs, options);
        
        // Filter active rewrites and format them for Next.js
        const dynamicRewrites = processedRewrites
          .filter(rewrite => rewrite.isActive)
          .map(({ source, destination }) => {
            console.log(`[next-rewrites-plugin] Adding rewrite: ${source} -> ${destination}`);
            return {
              source,
              destination
            };
          });
        
        // Handle existing rewrites if any
        let existingRewrites: any[] = [];
        
        if (typeof originalRewrites === 'function') {
          const originalRewritesResult = await originalRewrites();
          
          if (Array.isArray(originalRewritesResult)) {
            existingRewrites = originalRewritesResult;
          } else {
            // For App Router, we need to put our rewrites in beforeFiles
            // to ensure they take precedence over the file system routing
            console.log('[next-rewrites-plugin] Using App Router configuration');
            return {
              beforeFiles: [
                ...dynamicRewrites,
                ...(originalRewritesResult.beforeFiles || [])
              ],
              afterFiles: originalRewritesResult.afterFiles || [],
              fallback: originalRewritesResult.fallback || []
            };
          }
        } else if (Array.isArray(originalRewrites)) {
          existingRewrites = originalRewrites;
        }
        
        // For Pages Router or when rewrites are an array
        console.log('[next-rewrites-plugin] Using Pages Router configuration');
        return [...dynamicRewrites, ...existingRewrites];
      },
      
      // Extend webpack config to watch rewrite files in development
      webpack: (config, { dev, isServer, ...webpackOptions }) => {
        // Call the original webpack function if it exists
        if (typeof nextConfig.webpack === 'function') {
          config = nextConfig.webpack(config, { dev, isServer, ...webpackOptions });
        }
        
        if (dev && isServer) {
          const rootDir = process.cwd();
          const rewritesDir = options.dir || 'rewrites';
          
          // Add the rewrites directory to watchOptions
          if (!config.watchOptions) {
            config.watchOptions = {};
          }
          
          // We'll just set up the directory to be watched without manipulating
          // the ignored patterns to avoid TypeError with read-only properties
          console.log(`[next-rewrites-plugin] Watching ${rewritesDir} directory for changes`);
        }
        
        return config;
      }
    };
  };
}

export * from './types';