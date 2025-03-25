import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

//export default clerkMiddleware()
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
  if (isProtectedRoute(req)) auth().protect();
});
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};