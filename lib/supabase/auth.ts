import { getSupabaseBrowserClient } from "./client";

export async function signInWithGoogle(redirectTo?: string) {
  const supabase = getSupabaseBrowserClient();

  // Get the redirect URL from the current URL if it exists
  const urlParams = new URLSearchParams(window.location.search);
  const redirect = redirectTo || urlParams.get("redirect") || "/dashboard";

  // Build the callback URL with the redirect parameter
  const callbackUrl = new URL(`${window.location.origin}/callback`);
  if (redirect) {
    callbackUrl.searchParams.set("redirect", redirect);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  return { data, error };
}

export async function signOut() {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  return { data, error };
}

export async function createUserProfile(profile: Record<string, unknown>) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("users")
    .insert([profile])
    .select()
    .single();

  return { data, error };
}

export async function updateUserProfile(
  userId: string,
  updates: Record<string, unknown>
) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  return { data, error };
}
