import { appConfig } from "@/lib/config";
import { supabase } from "@/lib/supabase/client";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiPost<TResponse>(
  path: string,
  body: Record<string, unknown>
): Promise<TResponse> {
  const authHeaders = await getAuthHeaders();
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as TResponse;
}

export async function apiGet<TResponse>(path: string): Promise<TResponse> {
  const authHeaders = await getAuthHeaders();
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as TResponse;
}
