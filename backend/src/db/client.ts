import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false
  }
});

export interface DbClient {
  query<T>(_sql: string, _params?: unknown[]): Promise<{ rows: T[] }>;
}

class UnsupportedSqlClient implements DbClient {
  async query<T>(): Promise<{ rows: T[] }> {
    throw new Error(
      "Raw SQL queries are not configured for Supabase REST client. Use supabaseAdmin.from(...)."
    );
  }
}

export const dbClient: DbClient = new UnsupportedSqlClient();
