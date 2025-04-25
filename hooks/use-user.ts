import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "@/types/user";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getUserProfile } from "@/lib/supabase/auth";

export function useUser() {
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    // Get the current user
    const getUser = async () => {
      try {
        setLoading(true);

        // Get auth user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setAuthUser(user);

        // If user exists, get their profile
        if (user) {
          const { data, error } = await getUserProfile(user.id);

          if (error) {
            throw error;
          }

          setProfile(data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch user")
        );
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setAuthUser(session?.user ?? null);

      if (session?.user) {
        try {
          const { data, error } = await getUserProfile(session.user.id);

          if (error) {
            throw error;
          }

          setProfile(data);
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user: authUser,
    profile,
    loading,
    error,
    isAuthenticated: !!authUser,
    hasProfile: !!profile,
  };
}
