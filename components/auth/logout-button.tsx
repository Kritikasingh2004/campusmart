"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

interface LogoutButtonProps {
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
  children?: React.ReactNode;
}

export function LogoutButton({
  variant = "ghost",
  size = "default",
  className,
  redirectTo = "/",
  children,
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      // Create a Supabase client
      const supabase = createClient();
      
      // Sign out
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      toast.success("Logged out successfully");

      // Redirect after logout
      router.push(redirectTo);
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? "Logging out..." : children || "Logout"}
    </Button>
  );
}
