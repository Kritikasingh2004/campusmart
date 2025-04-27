"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

// Create a singleton instance of the Supabase client
const supabase = createClient();

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get the current user session
    const getUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error getting user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);

      // Refresh the page to update the UI
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signInWithGoogle = async (redirectTo?: string) => {
    try {
      setLoading(true);

      // Format the redirect URL
      const formattedRedirect =
        redirectTo && !redirectTo.startsWith("/")
          ? `/${redirectTo}`
          : redirectTo;

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
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);

      // Sign out
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
