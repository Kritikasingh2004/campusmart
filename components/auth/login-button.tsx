"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

interface LoginButtonProps {
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  redirectTo?: string;
}

export function LoginButton({
  variant = "default",
  size = "default",
  className,
  redirectTo,
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      // Format the redirect URL
      const formattedRedirect =
        redirectTo && !redirectTo.startsWith("/")
          ? `/${redirectTo}`
          : redirectTo;

      console.log("Login button - Redirecting to:", formattedRedirect);

      // Create a Supabase client
      const supabase = createClient();
      
      // Sign in with Google
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/callback${
            formattedRedirect ? `?redirect=${encodeURIComponent(formattedRedirect)}` : ""
          }`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        throw error;
      }

      // The page will be redirected by Supabase, so we don't need to do anything else here
    } catch (error) {
      console.error("Error signing in:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogin}
      disabled={isLoading}
    >
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
}
