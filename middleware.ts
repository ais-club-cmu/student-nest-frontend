import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(request: NextRequest) {
    // Example: Add a custom header or perform fast edge auth checks before request completion
    const response = NextResponse.next();
    response.headers.set('X-Custom-Housing-App', 'enabled');

    // Geolocation routing example:
    // const country = request.geo?.country || 'US';
    // if (country === 'US' && request.nextUrl.pathname === '/') {
    //    return NextResponse.rewrite(new URL('/us', request.url));
    // }

    return response;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
