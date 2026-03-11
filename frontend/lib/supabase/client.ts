import { createClient } from "@supabase/supabase-js";
import { appConfig } from "@/lib/config";

const supabaseUrl = appConfig.supabaseUrl || "https://placeholder.supabase.co";
const supabaseAnonKey = appConfig.supabaseAnonKey || "placeholder-anon-key";

if (!appConfig.supabaseUrl || !appConfig.supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    "[Translator App] Missing Supabase env vars.\n" +
    "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local and restart the dev server."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
