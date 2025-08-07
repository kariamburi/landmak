import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// ✅ Define only the **protected routes**
const isProtectedRoute = createRouteMatcher([
  '/home(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

// ✅ Match middleware to these routes
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', // all routes except static files and _next
    '/',
    '/(api|trpc|property)(.*)',   // include routes like /api, /trpc, /property/:id
  ],
};
