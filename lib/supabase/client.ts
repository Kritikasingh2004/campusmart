import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create a single supabase client for the entire app
export const createClient = (options = {}) => {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    ...options,
  });
};

// Client-side singleton
let clientInstance: ReturnType<typeof createClient> | null = null;

// For client components
export const getSupabaseBrowserClient = () => {
  if (!clientInstance) {
    clientInstance = createClient();
  }
  return clientInstance;
};

// For server components
export const getSupabaseServerClient = () => {
  return createClient();
};

// For backward compatibility with existing code
export const supabase = getSupabaseBrowserClient();
