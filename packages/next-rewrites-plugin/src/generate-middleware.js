#!/usr/bin/env node

// A simple script to generate middleware.ts from rewrite files
const fs = require('fs');
const path = require('path');

// Get the project root directory
const rootDir = process.cwd();
const rewritesDir = path.join(rootDir, 'rewrites');

if (!fs.existsSync(rewritesDir)) {
  console.error(`Error: Directory '${rewritesDir}' does not exist.`);
  process.exit(1);
}

// Get all JS files in the rewrites directory
const files = fs.readdirSync(rewritesDir)
  .filter(file => file.endsWith('.js'));

if (files.length === 0) {
  console.error(`Error: No rewrite files found in '${rewritesDir}'.`);
  process.exit(1);
}

// Load rewrite configurations
const rewrites = [];
for (const file of files) {
  const filePath = path.join(rewritesDir, file);
  try {
    // Clear require cache to ensure we get fresh config
    delete require.cache[require.resolve(filePath)];
    
    // Import the config file
    const config = require(filePath);
    
    // Generate source if not provided
    if (!config.source) {
      const basename = path.basename(file, '.js');
      config.source = `/${basename}`;
    }
    
    // Generate destination if not provided
    if (!config.destination) {
      config.destination = config.source;
    }
    
    rewrites.push({
      source: config.source,
      destination: config.destination,
      externalUrl: config.externalUrl,
      featureFlag: config.featureFlag
    });
    
    console.log(`Loaded rewrite from ${file}: ${config.source} -> ${config.externalUrl}${config.destination}`);
  } catch (error) {
    console.error(`Error loading rewrite from '${file}':`, error);
  }
}

// Generate middleware.ts
const middlewareContent = `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Types for rewrite configuration
interface RewriteRule {
  source: string;
  destination: string;
  externalUrl: string;
  featureFlag?: string;
}

// List of rewrite rules - auto-generated from /rewrites directory
const REWRITES: RewriteRule[] = ${JSON.stringify(rewrites, null, 2)};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Find matching rewrite rule
  for (const rule of REWRITES) {
    // Check if the path matches the source pattern
    if (matchPath(pathname, rule.source)) {
      console.log(\`Rewriting \${pathname} to \${rule.externalUrl}\`);
      
      // Create URL for the target app domain
      const url = new URL(
        getDestinationPath(pathname, rule.source, rule.destination),
        rule.externalUrl
      );
      
      // Preserve search params
      url.search = request.nextUrl.search;
      
      // Rewrite to target app
      return NextResponse.rewrite(url);
    }
  }
  
  // For other paths, continue normally
  return NextResponse.next();
}

// Match path patterns like /blog/:path*
function matchPath(pathname: string, pattern: string): boolean {
  // Simple exact match
  if (pattern === pathname) return true;
  
  // Handle path patterns
  if (pattern.includes('*') || pattern.includes(':')) {
    // Convert pattern to regex
    let regexPattern = pattern;
    
    // Handle parameters like :id or :path*
    regexPattern = regexPattern.replace(/\/:[^\/]+(\*)?/g, (match) => {
      if (match.endsWith('*')) {
        return '/(.+)'; // Match non-empty segments
      }
      return '/([^/]+)'; // Match single segment
    });
    
    // Replace wildcards
    regexPattern = regexPattern.replace(/\*/g, '.*');
    
    // Escape slashes and other regex special chars
    regexPattern = regexPattern.replace(/\//g, '\\/');
    
    // Create regex with anchors
    const regex = new RegExp(\`^\${regexPattern}$\`);
    
    return regex.test(pathname);
  }
  
  return false;
}

// Map parameters from source path to destination path
function getDestinationPath(pathname: string, source: string, destination: string): string {
  if (source === pathname) {
    return destination;
  }
  
  // Handle parameter substitution
  const sourceSegments = source.split('/');
  const pathnameSegments = pathname.split('/');
  const destSegments = destination.split('/');
  
  // Collect params from source and pathname
  const params: Record<string, string> = {};
  
  sourceSegments.forEach((segment, i) => {
    if (segment.startsWith(':')) {
      const paramName = segment.substring(1).replace('*', '');
      
      // For path* parameters, collect all remaining segments
      if (segment.endsWith('*') && i < sourceSegments.length - 1) {
        params[paramName] = pathnameSegments.slice(i).join('/');
      } else {
        params[paramName] = pathnameSegments[i] || '';
      }
    }
  });
  
  // Replace params in destination
  return destSegments
    .map(segment => {
      if (segment.startsWith(':')) {
        const paramName = segment.substring(1).replace('*', '');
        return params[paramName] || '';
      }
      return segment;
    })
    .join('/');
}

// Configure middleware to run only on the paths we need
export const config = {
  matcher: [
    ${rewrites.map(r => `'${r.source.replace(/\*$/, ':path*')}'`).join(',\n    ')}
  ]
};`;

// Write middleware.ts
const middlewarePath = path.join(rootDir, 'middleware.ts');
fs.writeFileSync(middlewarePath, middlewareContent);
console.log(`Generated middleware.ts at ${middlewarePath}`);