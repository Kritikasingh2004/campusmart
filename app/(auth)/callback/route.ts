import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";

/**
 * OAuth callback handler for authentication
 */
export async function GET(request: NextRequest) {
  // Get the code, error, and redirect from the URL
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");
  const redirect = requestUrl.searchParams.get("redirect");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;

  // Log parameters for debugging
  console.log("Auth callback parameters:", {
    code,
    error,
    error_description,
    redirect,
    type,
  });

  // If there's an error, redirect to login with error
  if (error) {
    console.error("OAuth error:", error, error_description);
    return NextResponse.redirect(
      new URL(
        `/login?error=${error}&error_description=${error_description}`,
        request.url
      )
    );
  }

  // Create a Supabase client
  const supabase = await createClient();

  // Handle OTP verification (for email confirmation)
  if (type && code) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: code,
    });

    if (error) {
      console.error("Error verifying OTP:", error);
      return NextResponse.redirect(
        new URL("/login?error=verification_error", request.url)
      );
    }

    // Redirect to dashboard or specified URL
    return NextResponse.redirect(
      new URL(redirect || "/dashboard", request.url)
    );
  }

  // Handle OAuth code exchange
  if (code) {
    try {
      console.log("Exchanging code for session...");

      // Exchange the code for a session
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error("Error exchanging code for session:", exchangeError);
        return NextResponse.redirect(
          new URL("/login?error=auth_error", request.url)
        );
      }

      console.log("Code exchanged successfully, getting user...");

      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error getting user:", userError);
        return NextResponse.redirect(
          new URL("/login?error=auth_error", request.url)
        );
      }

      console.log("User obtained, ID:", user.id);

      // Check if user has a profile in the users table
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error checking user profile:", profileError);
      }

      // If user doesn't exist in the users table, create a basic profile
      if (!userProfile) {
        console.log("User not found in users table, creating profile...");

        // Create a basic user profile from auth data
        const { error: insertError } = await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
          avatar_url: user.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error("Error creating user profile:", insertError);
          // Redirect to create-profile to complete profile setup
          return NextResponse.redirect(new URL("/create-profile", request.url));
        }
      }

      console.log(
        "User has a profile, redirecting to dashboard or specified URL"
      );

      // Redirect to the specified redirect URL or dashboard
      if (redirect) {
        console.log("Redirecting to:", redirect);
        return NextResponse.redirect(new URL(redirect, request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.error("Error in callback processing:", error);
      return NextResponse.redirect(
        new URL("/login?error=server_error", request.url)
      );
    }
  }

  // If there's no code or error, redirect to login
  console.log("No code or error, redirecting to login");
  return NextResponse.redirect(new URL("/login", request.url));
}
