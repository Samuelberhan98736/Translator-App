"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabase/client";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-1.4 3.5-5.4 3.5-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 3 14.5 2.1 12 2.1 6.9 2.1 2.8 6.2 2.8 11.3s4.1 9.2 9.2 9.2c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1-.1-1.4H12Z" />
    <path fill="#34A853" d="M2.8 11.3c0 1.6.4 3.1 1.2 4.4l3.4-2.6c-.2-.5-.3-1.1-.3-1.8s.1-1.2.3-1.8L4 6.9c-.8 1.3-1.2 2.8-1.2 4.4Z" />
    <path fill="#4A90E2" d="M12 20.5c2.5 0 4.6-.8 6.2-2.3l-3-2.3c-.8.6-1.8 1-3.2 1-2.5 0-4.7-1.7-5.4-4l-3.5 2.7c1.5 2.9 4.6 4.9 8.9 4.9Z" />
    <path fill="#FBBC05" d="M6.6 12.9c-.2-.5-.3-1.1-.3-1.6s.1-1.1.3-1.6L3.1 7c-.6 1.2-1 2.7-1 4.3s.4 3 1 4.3l3.5-2.7Z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default function SignInPage() {
  const [loading, setLoading] = useState<"google" | "github" | null>(null);
  const [error, setError] = useState("");

  async function signInWith(provider: "google" | "github") {
    setLoading(provider);
    setError("");

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/translate` }
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(null);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-6">

        {/* Logo lockup */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/30">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" /><path d="M7 2h1" />
              <path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Sign in to your Translator App account
            </p>
          </div>
        </div>

        <Card className="space-y-3 p-7">
          <Button
            onClick={() => void signInWith("google")}
            disabled={loading !== null}
            variant="secondary"
            className="w-full"
          >
            <span className="flex items-center justify-center gap-2.5">
              {loading === "google" ? <Spinner /> : <GoogleIcon />}
              {loading === "google" ? "Connecting..." : "Continue with Google"}
            </span>
          </Button>

          <Button
            onClick={() => void signInWith("github")}
            disabled={loading !== null}
            variant="secondary"
            className="w-full"
          >
            <span className="flex items-center justify-center gap-2.5">
              {loading === "github" ? <Spinner /> : <GitHubIcon />}
              {loading === "github" ? "Connecting..." : "Continue with GitHub"}
            </span>
          </Button>

          {error ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-300/60 bg-rose-100/70 px-3.5 py-3 dark:border-rose-500/40 dark:bg-rose-900/20">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400">
                <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
            </div>
          ) : null}

          <p className="pt-1 text-center text-xs text-slate-400 dark:text-slate-500">
            No account yet?{" "}
            <Link className="font-medium text-cyan-700 hover:underline dark:text-cyan-300" href="/signup">
              Sign up free
            </Link>
          </p>
        </Card>

      </div>
    </div>
  );
}
