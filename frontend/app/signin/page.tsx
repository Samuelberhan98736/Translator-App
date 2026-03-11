"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { supabase } from "@/lib/supabase/client";
import { setSessionUser } from "@/store/session.store";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSignIn() {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Sign in failed.");
      setLoading(false);
      return;
    }

    setSessionUser({
      id: data.user.id,
      email: data.user.email ?? email.trim()
    });

    setLoading(false);
    router.push("/translate");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md space-y-6">

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

        {/* Card */}
        <Card className="space-y-5 p-7">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="signin-email">
              Email
            </label>
            <Input
              id="signin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="student@university.edu"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="signin-password">
              Password
            </label>
            <Input
              id="signin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
            />
          </div>

          {error ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-300/60 bg-rose-100/70 px-3.5 py-3 dark:border-rose-500/40 dark:bg-rose-900/20">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400">
                <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
            </div>
          ) : null}

          <Button onClick={onSignIn} disabled={loading} className="w-full">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Signing in...
              </span>
            ) : "Continue"}
          </Button>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Need an account?{" "}
            <Link className="font-medium text-cyan-700 hover:underline dark:text-cyan-300" href="/signup">
              Sign up
            </Link>
          </p>
        </Card>

      </div>
    </div>
  );
}
