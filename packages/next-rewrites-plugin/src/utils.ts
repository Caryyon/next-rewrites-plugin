import * as fs from 'fs';
import * as path from 'path';
import { ProcessedRewrite, RewriteConfig, RewritesPluginOptions } from './types';

/**
 * Reads all rewrite configuration files from the specified directory
 */
export async function readRewriteConfigs(
  rootDir: string,
  options: RewritesPluginOptions
): Promise<RewriteConfig[]> {
  const rewritesDir = path.join(rootDir, options.dir || 'rewrites');
  
  if (!fs.existsSync(rewritesDir)) {
    console.warn(`[next-rewrites-plugin] Directory '${rewritesDir}' does not exist. No rewrites will be loaded.`);
    return [];
  }
  
  const files = fs.readdirSync(rewritesDir)
    .filter(file => file.endsWith('.js')); // Only use JS files for simplicity
  
  const configs: RewriteConfig[] = [];
  
  for (const file of files) {
    const filePath = path.join(rewritesDir, file);
    try {
      // Clear require cache to ensure we get fresh config on every load
      delete require.cache[require.resolve(filePath)];
      
      // Import the config file
      const importedConfig = require(filePath);
      
      // Support both default exports and named 'config' exports
      const config = importedConfig.default || importedConfig.config || importedConfig;
      
      if (!config.externalUrl) {
        console.warn(`[next-rewrites-plugin] Config file '${file}' does not export a valid config object with 'externalUrl'.`);
        continue;
      }
      
      // If no source provided, generate one from filename
      if (!config.source) {
        const basename = path.basename(file, path.extname(file));
        config.source = `/${basename}`;
      }
      
      configs.push(config);
    } catch (error) {
      console.error(`[next-rewrites-plugin] Error loading config from '${file}':`, error);
    }
  }
  
  return configs;
}

/**
 * Processes rewrite configs into actual rewrite rules
 */
export function processRewrites(
  configs: RewriteConfig[],
  options: RewritesPluginOptions
): ProcessedRewrite[] {
  return configs.map(config => {
    const { externalUrl, featureFlag, source, destination } = config;
    
    // Determine if the rewrite is active based on feature flag
    const isActive = !featureFlag || 
      !!(options.isFeatureFlagEnabled && options.isFeatureFlagEnabled(featureFlag));
    
    // Normalize the source path
    const normalizedSource = source!.startsWith('/') ? source! : `/${source}`;
    
    // Generate destination if not provided
    const destPath = destination || normalizedSource;
    const normalizedDestination = `${externalUrl.replace(/\/$/, '')}${destPath}`;
    
    return {
      source: normalizedSource,
      destination: normalizedDestination,
      isActive,
      assetPrefix: config.assetPrefix,
      hardNavigation: config.hardNavigation !== false // Default to true if not specified
    };
  });
}

/**
 * Creates a watcher for rewrite config files
 */
export function createRewritesWatcher(
  rootDir: string,
  options: RewritesPluginOptions,
  onChange: () => void
): fs.FSWatcher | null {
  const rewritesDir = path.join(rootDir, options.dir || 'rewrites');
  
  if (!fs.existsSync(rewritesDir)) {
    return null;
  }
  
  return fs.watch(rewritesDir, (eventType, filename) => {
    if (filename && (filename.endsWith('.ts') || filename.endsWith('.js'))) {
      console.log(`[next-rewrites-plugin] Detected change in '${filename}', updating rewrites...`);
      onChange();
    }
  });
}

/**
 * Generates middleware.ts file from rewrite configurations
 */
export async function generateMiddleware(
  rootDir: string,
  options: RewritesPluginOptions
): Promise<void> {
  // Load rewrite configurations
  const rewriteConfigs = await readRewriteConfigs(rootDir, options);
  
  // Read middleware template
  const templatePath = path.join(__dirname, 'middleware-template.ts');
  let template = '';
  
  try {
    // Check if we're running from source or built dist
    if (fs.existsSync(templatePath)) {
      template = fs.readFileSync(templatePath, 'utf8');
    } else {
      // Fall back to source location when running from source
      template = fs.readFileSync(
        path.join(__dirname, '../src/middleware-template.ts'),
        'utf8'
      );
    }
  } catch (err) {
    console.error('[next-rewrites-plugin] Error reading middleware template:', err);
    throw err;
  }
  
  // Create simplified rewrite configs for middleware
  const middlewareRewrites = rewriteConfigs.map(config => ({
    source: config.source || `/${path.basename(config.source || '', path.extname(config.source || ''))}`,
    destination: config.destination || config.source || '',
    externalUrl: config.externalUrl,
    featureFlag: config.featureFlag
  }));
  
  // Format feature flag function
  let featureFlagFunction = options.isFeatureFlagEnabled 
    ? options.isFeatureFlagEnabled.toString()
    : 'function(flag) { return true; }';

  // Clean up any comments in the function string if needed
  featureFlagFunction = featureFlagFunction.trim();
  
  // Replace tokens in the template
  const middlewareContent = template
    // First fix the regex to ensure proper replacement
    .replace(/\/\* REWRITES_JSON_PLACEHOLDER \*\/\[\];?/g, JSON.stringify(middlewareRewrites, null, 2))
    // Replace placeholder for the feature flag function
    .replace(/\/\* FEATURE_FLAG_FUNCTION_PLACEHOLDER \*\/[^;]+;/g, featureFlagFunction + ';');
  
  // Write middleware.ts
  const middlewarePath = path.join(rootDir, 'middleware.ts');
  fs.writeFileSync(middlewarePath, middlewareContent);
  
  console.log(`[next-rewrites-plugin] Generated middleware.ts at ${middlewarePath}`);
}