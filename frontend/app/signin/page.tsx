"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { setSessionUser } from "@/store/session.store";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSignIn() {
    if (!email.trim() || !password.trim()) {
      return;
    }

    setSessionUser({ id: `user-${Date.now()}`, email });
  }

  return (
    <Card className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Sign In</h1>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="signin-email">
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

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="signin-password">
          Password
        </label>
        <Input
          id="signin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />
      </div>

      <Button onClick={onSignIn}>Continue</Button>

      <p className="text-sm text-slate-600">
        Need an account? <Link className="text-accent hover:underline" href="/signup">Sign up</Link>
      </p>
    </Card>
  );
}
