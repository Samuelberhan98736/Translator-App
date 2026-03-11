"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { supabase } from "@/lib/supabase/client";
import { setSessionUser } from "@/store/session.store";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function onSignUp() {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Supabase returns a user with no session when email confirmation is required.
    // identities being empty means the email is already registered.
    const needsConfirmation = !data.session;
    if (needsConfirmation) {
      setConfirmed(true);
      return;
    }

    // Email confirmation is disabled — session is available immediately.
    if (data.user && data.session) {
      setSessionUser({
        id: data.user.id,
        email: data.user.email ?? email.trim()
      });
      router.push("/translate");
    }
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
              Create your account
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Join Translator App and start optimizing your resume
            </p>
          </div>
        </div>

        {/* Confirmation screen */}
        {confirmed ? (
          <Card className="space-y-4 p-7 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Check your email</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              We sent a confirmation link to <strong className="text-slate-700 dark:text-slate-200">{email}</strong>. Click it to activate your account.
            </p>
            <Link href="/signin" className="inline-block text-sm font-medium text-cyan-700 hover:underline dark:text-cyan-300">
              Back to sign in
            </Link>
          </Card>
        ) : null}

        {/* Card */}
        {!confirmed ? <Card className="space-y-5 p-7">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="signup-email">
              Email
            </label>
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="student@university.edu"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="signup-password">
              Password
            </label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a strong password"
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

          <Button onClick={onSignUp} disabled={loading} className="w-full">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Creating account...
              </span>
            ) : "Create Account"}
          </Button>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link className="font-medium text-cyan-700 hover:underline dark:text-cyan-300" href="/signin">
              Sign in
            </Link>
          </p>
        </Card> : null}

      </div>
    </div>
  );
}
