import { createClient } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect") || "/dashboard";

  if (code) {
    const supabase = createClient();

    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(
          new URL("/login?error=auth_error", request.url)
        );
      }

      // URL to redirect to after sign in process completes
      return NextResponse.redirect(new URL(redirectTo, request.url));
    } catch (error) {
      console.error("Exception during auth exchange:", error);
      return NextResponse.redirect(
        new URL("/login?error=server_error", request.url)
      );
    }
  }

  // If no code is present, redirect to login
  return NextResponse.redirect(new URL("/login", request.url));
}
