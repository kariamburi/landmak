import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/shop(.*)',
  '/chat(.*)',
  '/plan(.*)',
  '/pay(.*)',
  '/bookmark(.*)',
  '/reviews(.*)',
  '/settings(.*)',
  '/location(.*)',
  '/performance(.*)',
  '/faq(.*)',
  '/home(.*)',
  '/categories(.*)',
  '/packages(.*)',
]);

export default clerkMiddleware((auth, req) => {
  const userAgent = req.headers.get('user-agent') || '';

  const isBot = /bot|crawler|spider|bing|slurp|duckduckgo|baidu|yandex/i.test(userAgent);

  if (!isBot && isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
