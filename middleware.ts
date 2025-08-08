// middleware.ts
import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/home(.*)']);

export default clerkMiddleware((auth, req) => {
  const ua = req.headers.get('user-agent') || '';
  const isBot = /(googlebot|bingbot|yandex|duckduckbot|slurp|baiduspider|facebookexternalhit|twitterbot|applebot)/i.test(ua);

  if (isBot && req.nextUrl.pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/google-home';
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc|property)(.*)',
  ],
};
