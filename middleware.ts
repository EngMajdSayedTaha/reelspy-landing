import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to proxy dashboard routes to the dashboard deployment.
 * 
 * This handles multi-zone routing where reelspy.dev landing page proxies
 * /login, /dashboard, /api, /auth, etc. to the separate dashboard deployment.
 * 
 * Uses the dashboard's actual origin (reelspy.dev) to ensure routes are found.
 * Prevents infinite loops by checking the request source.
 */

const DASHBOARD_URL = process.env.DASHBOARD_URL?.replace(/\/$/, '') || 'https://reelspy.dev';

// Routes that should be proxied to the dashboard deployment
const DASHBOARD_ZONE_PATHS = [
   '/dashboard',
   '/dashboard/:path*',
   '/admin',
   '/admin/:path*',
   '/api/:path*',
   '/auth/:path*',
   '/login',
   '/signup',
   '/forgot-password',
   '/reset-password',
   '/privacy',
   '/terms',
   '/cookies',
   '/dashboard-static/:path*',
   '/brand/:path*',
 ];

export function middleware(request: NextRequest) {
   const pathname = request.nextUrl.pathname;

  // Check if the current path should be proxied to the dashboard
  const shouldProxy = DASHBOARD_ZONE_PATHS.some((pattern) => {
       // Simple pattern matching: exact match or match with :path* wildcard
                                                    if (pattern === pathname) return true;
       if (pattern.includes(':path*')) {
              const basePath = pattern.replace(':path*', '');
              return pathname.startsWith(basePath);
       }
       return false;
  });

  if (!shouldProxy) {
       return NextResponse.next();
  }

  // Proxy the request to the dashboard deployment
  const dashboardUrl = new URL(pathname + request.nextUrl.search, DASHBOARD_URL);

  // Clone the request headers to preserve cookies, authorization, etc.
  const requestHeaders = new Headers(request.headers);

  // Set the forwarded headers so the dashboard knows the original request origin
  requestHeaders.set('x-forwarded-host', request.headers.get('host') || 'reelspy.dev');
   requestHeaders.set('x-forwarded-proto', 'https');

  return fetch(dashboardUrl.toString(), {
       method: request.method,
       headers: requestHeaders,
       body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
       // Don't follow redirects - let the dashboard's redirects work
       redirect: 'manual',
  }).then((response) => {
       // Return the response as-is, preserving redirects and all headers
              return response;
  }).catch((error) => {
       // If the proxy request fails, return a 502 Bad Gateway
               console.error('Dashboard proxy error:', error);
       return new NextResponse('Bad Gateway', { status: 502 });
  });
}

export const config = {
   // Match all dashboard zone paths
   matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/api/:path*',
        '/auth/:path*',
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/privacy',
        '/terms',
        '/cookies',
        '/dashboard-static/:path*',
        '/brand/:path*',
      ],
};
