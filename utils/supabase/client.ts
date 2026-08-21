import { createBrowserClient } from "@supabase/ssr";

const defaultUrl = "https://placeholder.supabase.co";
const defaultKey = "placeholder-key";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || defaultUrl;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultKey;
  return createBrowserClient(supabaseUrl, supabaseKey);
};
