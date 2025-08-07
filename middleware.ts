// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/home(.*)',
]);

export default clerkMiddleware((auth, req) => {
  const userAgent = req.headers.get('user-agent') || '';
  const isBot = /bot|crawl|spider|google/i.test(userAgent);

  if (isBot) {
    req.headers.set('x-skip-auth', 'true');
    return;
  }

  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc|property)(.*)',
  ],
};
