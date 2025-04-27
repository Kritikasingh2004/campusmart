import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  // Create a Supabase client with a cookie handler that works with Next.js 15
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Using the synchronous API with type casting to avoid the warning
          // This is a temporary solution until Supabase updates their library
          // for Next.js 15's async cookies API
          const cookieStore = cookies();
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Auth cookies are handled by middleware
        },
        remove(name: string, options: any) {
          // Auth cookies are handled by middleware
        },
      },
    }
  );
}
