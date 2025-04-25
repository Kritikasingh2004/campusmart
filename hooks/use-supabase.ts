import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Hook to access the Supabase client in components
 * @returns Supabase client instance
 */
export function useSupabase() {
  return getSupabaseBrowserClient();
}
