import { NextResponse } from 'next/server';

// This is a simple API to manage feature flags for testing
// It's not meant for production use, just to demonstrate the rewrite plugin
// In a real app, this would be replaced with a proper feature flag service

// Initialize global state for feature flags 
// In a real app, this would be stored in a database or Redis
if (typeof global.__featureFlags === 'undefined') {
  // @ts-ignore - Extending global
  global.__featureFlags = {
    NEW_REGISTRATION: false
  };
}

// Make it accessible to globalThis for middleware
// @ts-ignore - Extending globalThis
globalThis.__featureFlags = global.__featureFlags;

export async function GET() {
  return NextResponse.json(global.__featureFlags);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Update the feature flags
    if (typeof data === 'object') {
      // @ts-ignore - Extending global
      global.__featureFlags = {
        ...global.__featureFlags,
        ...data
      };
      
      // Update globalThis as well for middleware
      // @ts-ignore - Extending globalThis
      globalThis.__featureFlags = global.__featureFlags;
      
      console.log('Feature flags updated:', global.__featureFlags);
      
      return NextResponse.json({
        success: true,
        message: 'Feature flags updated',
        flags: global.__featureFlags
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid data format' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update feature flags' },
      { status: 500 }
    );
  }
}