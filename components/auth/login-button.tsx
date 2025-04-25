"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/supabase/auth";

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
}

export function LoginButton({
  variant = "default",
  size = "default",
  className,
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
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
