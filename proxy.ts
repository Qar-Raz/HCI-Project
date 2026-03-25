import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/clerk(.*)",
  "/api/conversions",
  "/r/(.*)",
  "/clickstream-test",
]);

export default clerkMiddleware(async (auth, request) => {
  // ClickStream Affiliate Tracking - Handle /r/ redirects
  if (request.nextUrl.pathname.startsWith("/r/")) {
    const linkId = request.nextUrl.pathname.split("/r/")[1];

    if (linkId) {
      console.log("[ClickStream] Affiliate link clicked:", linkId);

      // Create redirect URL with ref parameter
      const redirectUrl = new URL("/", request.url);
      redirectUrl.searchParams.set("ref", linkId);

      // Create redirect response and set cookie (not httpOnly so banner can read it)
      const response = NextResponse.redirect(redirectUrl.toString());
      response.cookies.set("cs_ref", linkId, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: false, // Allow JavaScript to read for banner display
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return response;
    }
  }

  // ClickStream Affiliate Tracking - Capture 'ref' parameter and store in cookie
  const ref = request.nextUrl.searchParams.get("ref");

  if (ref) {
    const response = NextResponse.next();
    // Store referral in cookie for 30 days (not httpOnly so banner can read it)
    response.cookies.set("cs_ref", ref, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: false, // Allow JavaScript to read for banner display
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    console.log("[ClickStream] Affiliate referral captured:", ref);
    return response;
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
