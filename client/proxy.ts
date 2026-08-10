import { clerkMiddleware } from "@clerk/nextjs/server";

// Protected route prefixes requiring Clerk authentication
const protectedPrefixes = ["/tasks", "/projects", "/settings"];

const handler = clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected) {
    await auth.protect();
  }
});

export default function proxy(req: any, evt: any) {
  return handler(req, evt);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};