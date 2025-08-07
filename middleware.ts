import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: [
    "/",                // home
    "/about",           // about page
    "/terms",           // terms page
    "/property/:id",    // dynamic property details
  ],
});

export const config = {
  matcher: ["/((?!_next/image|_next/static|favicon.ico|robots.txt|sitemap.xml).*)"],
};
