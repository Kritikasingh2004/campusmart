import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/upload',
  '/edit-profile',
  '/edit-listing',
];

// List of paths that should redirect to dashboard if user is already authenticated
const authPaths = [
  '/login',
];

export async function middleware(request: NextRequest) {
  // Create a Supabase client
  const supabase = createClient();
  
  // Get the pathname from the request
  const { pathname } = request.nextUrl;
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));
  
  // Get the user from Supabase
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  
  // If the path is protected and the user is not authenticated, redirect to login
  if (isProtectedPath && !user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If the path is an auth path and the user is authenticated, redirect to dashboard
  if (isAuthPath && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/upload',
    '/edit-profile',
    '/edit-listing/:path*',
    '/login',
  ],
};
