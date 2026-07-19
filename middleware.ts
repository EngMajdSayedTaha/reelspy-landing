import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to proxy dashboard routes to the dashboard deployment.
  * 
   * This handles the multi-zone routing where reelspy.dev serves the landing page
    * but proxies /login, /dashboard, /api, /auth, etc. to the separate dashboard deployment.
     * 
      * Key points:
       * - Keeps a single origin (https://reelspy.dev) for auth cookies, OAuth redirects, and payments
        * - Proxies requests transparently without changing the user's visible URL
         * - Preserves headers and cookies across the proxy boundary
          */

          const DASHBOARD_URL = process.env.DASHBOARD_URL?.replace(/\/$/, '');

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
                                          // If DASHBOARD_URL is not set, we can't proxy - let the request fail naturally (404)
                                            if (!DASHBOARD_URL) {
                                                return NextResponse.next();
                                                  }

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
                                                                                                            
                                                                                                              // Remove host header to let the proxy handle it
                                                                                                                requestHeaders.delete('host');
                                                                                                                  // Set the forwarded host so the dashboard knows the original request origin
                                                                                                                    requestHeaders.set('x-forwarded-host', request.headers.get('host') || 'reelspy.dev');
                                                                                                                      requestHeaders.set('x-forwarded-proto', 'https');
                                                                                                                      
                                                                                                                        return fetch(dashboardUrl.toString(), {
                                                                                                                            method: request.method,
                                                                                                                                headers: requestHeaders,
                                                                                                                                    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
                                                                                                                                        // Don't redirect on 3xx responses - let the dashboard handle redirects
                                                                                                                                            redirect: 'manual',
                                                                                                                                              }).then((response) => {
                                                                                                                                                  // Clone the response to modify headers if needed
                                                                                                                                                      const clonedResponse = response.clone();
                                                                                                                                                      
                                                                                                                                                          // If the dashboard returns a redirect, preserve it
                                                                                                                                                              if (clonedResponse.status >= 300 && clonedResponse.status < 400) {
                                                                                                                                                                    return clonedResponse;
                                                                                                                                                                        }
                                                                                                                                                                        
                                                                                                                                                                            // Otherwise, return the response as-is
                                                                                                                                                                                return clonedResponse;
                                                                                                                                                                                  }).catch((error) => {
                                                                                                                                                                                      // If the proxy request fails, return a 502 Bad Gateway
                                                                                                                                                                                          console.error('Dashboard proxy error:', error);
                                                                                                                                                                                              return new NextResponse('Bad Gateway', { status: 502 });
                                                                                                                                                                                                });
                                                                                                                                                                                                }
                                                                                                                                                                                                
                                                                                                                                                                                                export const config = {
                                                                                                                                                                                                  // Match all paths except Next.js internals and static assets served by this zone
                                                                                                                                                                                                    matcher: [
                                                                                                                                                                                                        // Match all dashboard zone paths
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
                                                                                                                                                                                                                                                              
