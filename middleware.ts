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

const isBot = (userAgent: string | null) => {
  if (!userAgent) return false;
  const botPatterns = [/googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i, /baiduspider/i, /yandex/i];
  return botPatterns.some((pattern) => pattern.test(userAgent));
};

export default clerkMiddleware((auth, req) => {
  const userAgent = req.headers.get('user-agent');
  if (isBot(userAgent)) return; // ✅ Allow bots through without auth
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
