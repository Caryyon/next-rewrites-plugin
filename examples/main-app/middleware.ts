import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware that handles both rewrites

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle blog paths
  if (pathname.startsWith('/blog')) {
    console.log(`Rewriting ${pathname} to the blog app`);
    // No need to modify the pathname since the blog app has basePath: '/blog'
    const url = new URL(pathname, 'http://localhost:3002');
    url.search = request.nextUrl.search;
    return NextResponse.rewrite(url);
  }
  
  // Handle registration paths
  if (pathname.startsWith('/registration')) {
    console.log(`Rewriting ${pathname} to the service app`);
    const url = new URL(pathname, 'http://localhost:3001');
    url.search = request.nextUrl.search;
    return NextResponse.rewrite(url);
  }
  
  // For other paths, continue normally
  return NextResponse.next();
}

// Configure middleware to run only on the paths we want to rewrite
export const config = {
  matcher: [
    '/blog/:path*',
    '/registration/:path*'
  ]
};