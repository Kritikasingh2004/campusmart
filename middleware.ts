import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

/**
 * Middleware to handle authentication and protected routes
 */
export async function middleware(request: NextRequest) {
  // First, update the session
  const response = await updateSession(request);

  // Get the URL and pathname
  const { pathname } = request.nextUrl;

  // Create a Supabase client to check the session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set() {}, // We don't need to set cookies here
        remove() {}, // We don't need to remove cookies here
      },
    }
  );

  try {
    // Get the user - this is safe to use for protection
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Define protected routes that require authentication
    const protectedRoutes = [
      "/dashboard",
      "/create-listing",
      "/edit-listing",
      "/edit-profile",
      "/messages",
      "/favorites",
      "/settings",
    ];

    // Check if the current route is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // If trying to access a protected route without authentication, redirect to login
    if (!user && isProtectedRoute) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If trying to access auth routes while already authenticated, redirect to dashboard
    const authRoutes = ["/login", "/signup", "/forgot-password"];
    const isAuthRoute = authRoutes.some((route) => pathname === route);

    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch (error) {
    console.error("Error in middleware:", error);
    // Continue with the request even if there's an error
  }

  return response;
}

// Only run middleware on relevant paths (exclude static files)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
