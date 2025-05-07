import { NextConfig } from 'next';

/**
 * Configuration for a single rewrite rule
 */
export interface RewriteConfig {
  /**
   * The base URL of the external zone to rewrite to
   */
  externalUrl: string;
  
  /**
   * Optional feature flag name - if provided, the rewrite will only be active if the flag is enabled
   */
  featureFlag?: string;
  
  /**
   * Optional source path - if not provided, the filename will be used as the source path
   * Example: For a file 'registration.ts', the source will be '/registration' if not explicitly defined
   * 
   * Can include path patterns like '/registration/:path*' for dynamic routing
   */
  source?: string;
  
  /**
   * Optional destination path - if not provided, will use the same path but at the external URL
   * 
   * Can include replacements like '/registration/:path*' that mirror the source pattern
   */
  destination?: string;
  
  /**
   * Optional asset prefix for the zone (important to avoid asset conflicts between zones)
   */
  assetPrefix?: string;
  
  /**
   * Optional flag to force a hard navigation between zones
   * When true, `<Link>` components will use plain `<a>` tags for this zone (App Router only)
   * @default true
   */
  hardNavigation?: boolean;
}

/**
 * Configuration options for the rewrites plugin
 */
export interface RewritesPluginOptions {
  /**
   * Directory to watch for rewrite config files (relative to project root)
   * @default 'rewrites'
   */
  dir?: string;
  
  /**
   * Function to check if a feature flag is enabled
   * If not provided, all rewrites will be active regardless of feature flags
   */
  isFeatureFlagEnabled?: (flagName: string) => boolean;
  
  /**
   * Use middleware instead of Next.js rewrites config
   * @default false
   */
  useMiddleware?: boolean;
}

/**
 * Used internally - represents a processed rewrite rule
 */
export interface ProcessedRewrite {
  source: string;
  destination: string;
  isActive: boolean;
  assetPrefix?: string;
  hardNavigation?: boolean;
}