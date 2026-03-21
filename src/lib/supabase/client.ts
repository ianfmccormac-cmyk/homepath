import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Returns a Supabase browser client, or null if credentials are not configured. */
export function createClient() {
  if (!supabaseUrl.startsWith("https://") || supabaseKey.length < 20) {
    return null;
  }
  return createBrowserClient(supabaseUrl, supabaseKey);
}
