"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginButton } from "@/components/auth/login-button";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/utils/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LoginContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const redirect = searchParams.get("redirect");

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    const checkAndRedirect = async () => {
      if (!loading && user) {
        console.log("Login page - User is authenticated:", user);

        try {
          // Check if user has a profile
          const supabase = createClient();
          const { data: userProfile, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

          console.log("User profile check:", { userProfile, error });

          if (error || !userProfile) {
            // If no profile, redirect to create profile
            router.push("/create-profile");
          } else if (redirect) {
            // If there's a specific redirect, go there
            router.push(redirect);
          } else {
            // Otherwise go to dashboard
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error checking user profile:", error);
          // Default to dashboard on error
          router.push("/dashboard");
        }
      }
    };

    checkAndRedirect();
  }, [user, loading, router, redirect]);

  // Error messages based on error code
  const errorMessages = {
    auth_error: "Authentication failed. Please try again.",
    server_error: "Server error occurred. Please try again later.",
    access_denied: "Access was denied. Please try again.",
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Checking authentication status...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center justify-center py-8">
          <div className="animate-pulse h-8 w-8 rounded-full bg-primary/20"></div>
        </CardContent>
      </Card>
    );
  }

  // If user is already authenticated, we'll redirect in the useEffect
  // This is just a fallback in case the redirect hasn't happened yet
  if (user) {
    return (
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Already Signed In
          </CardTitle>
          <CardDescription>Redirecting you to the dashboard...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center justify-center py-8">
          <div className="animate-pulse h-8 w-8 rounded-full bg-primary/20"></div>
        </CardContent>
      </Card>
    );
  }

  // Show login form if user is not authenticated
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>
          Sign in to your account to access your dashboard and listings
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessages[error as keyof typeof errorMessages] ||
                "An error occurred. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        <LoginButton className="w-full" redirectTo={redirect || undefined} />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue as guest
            </span>
          </div>
        </div>

        <div className="text-center text-sm">
          By signing in, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href="/"
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Return to Home
        </Link>
      </CardFooter>
    </Card>
  );
}

// Loading fallback that mimics the structure of the login card
function LoginLoadingFallback() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>Loading authentication options...</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="h-10 bg-muted rounded-md animate-pulse" />
        <div className="h-10 bg-muted rounded-md animate-pulse" />

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Loading
            </span>
          </div>
        </div>

        <div className="h-16 bg-muted/50 rounded-md animate-pulse" />
      </CardContent>
      <CardFooter>
        <div className="w-full h-6 bg-muted/30 rounded-md animate-pulse" />
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
}
