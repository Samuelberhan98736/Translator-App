"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { getProfile, saveProfile } from "@/features/profile/services/profile.service";
import type { StudentProfile } from "@/features/profile/types";
import { supabase } from "@/lib/supabase/client";
import { getSessionState, subscribeSession } from "@/store/session.store";
import type { SessionUser } from "@/store/session.store";

const selectClassName =
  "w-full rounded-xl border border-slate-300 bg-white/85 px-3 py-2 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/25 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20";

const initialProfile: StudentProfile = {
  major: "",
  role: "",
  opportunityType: "internship",
  schedulePreference: "full-time",
  handshakeConnected: false,
  summary: ""
};

const providerLabel: Record<string, string> = {
  google: "Google",
  github: "GitHub"
};

export default function ProfilePage() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(getSessionState().user);
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "saved" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeSession((state) => setSessionUser(state.user));
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function loadProfile() {
      try {
        const currentProfile = await getProfile();
        setProfile({
          major: currentProfile.major,
          role: currentProfile.role,
          opportunityType: currentProfile.opportunityType,
          schedulePreference: currentProfile.schedulePreference,
          handshakeConnected: currentProfile.handshakeConnected,
          summary: currentProfile.summary,
          updatedAt: currentProfile.updatedAt
        });
        setStatus("idle");
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load profile.");
        setStatus("error");
      }
    }

    void loadProfile();
  }, []);

  async function onSave() {
    setStatus("saving");
    setError(null);

    try {
      const savedProfile = await saveProfile(profile);
      setProfile(savedProfile);
      setStatus("saved");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save profile.");
      setStatus("error");
    }
  }

  async function onSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/signin");
  }

  const displayName = sessionUser?.name ?? sessionUser?.email ?? "Student";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const provider = sessionUser?.provider ? (providerLabel[sessionUser.provider] ?? sessionUser.provider) : null;

  return (
    <div className="space-y-5">

      {/* Header — identity */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 px-7 py-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-night">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-300/15 via-transparent to-transparent dark:from-amber-500/10" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {sessionUser?.avatarUrl ? (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl shadow-md">
                <Image
                  src={sessionUser.avatarUrl}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="56px"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-sm font-bold text-white shadow-md shadow-cyan-500/20">
                {initials}
              </div>
            )}

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {displayName}
              </h1>
              <div className="mt-0.5 flex items-center gap-2 flex-wrap">
                {sessionUser?.email ? (
                  <span className="text-sm text-slate-500 dark:text-slate-400">{sessionUser.email}</span>
                ) : null}
                {provider ? (
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    via {provider}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Sign out */}
          <Button
            variant="secondary"
            onClick={() => void onSignOut()}
            disabled={signingOut}
            className="shrink-0 text-sm"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </Button>
        </div>
      </section>

      {/* Academic profile */}
      <Card className="space-y-5 p-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Academic Profile</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            These filters drive job search, Handshake matching, and resume translation.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="major">
              Major
            </label>
            <Input
              id="major"
              value={profile.major}
              onChange={(event) => setProfile({ ...profile, major: event.target.value })}
              placeholder="Computer Science"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="role">
              Target Role
            </label>
            <Input
              id="role"
              value={profile.role}
              onChange={(event) => setProfile({ ...profile, role: event.target.value })}
              placeholder="Software Engineering Intern"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="opportunityType">
              Opportunity Type
            </label>
            <select
              id="opportunityType"
              className={selectClassName}
              value={profile.opportunityType}
              onChange={(event) =>
                setProfile({ ...profile, opportunityType: event.target.value as "job" | "internship" })
              }
            >
              <option value="internship">Internship</option>
              <option value="job">Full-time Job</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="schedulePreference">
              Schedule Preference
            </label>
            <select
              id="schedulePreference"
              className={selectClassName}
              value={profile.schedulePreference}
              onChange={(event) =>
                setProfile({ ...profile, schedulePreference: event.target.value as "part-time" | "full-time" })
              }
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="summary">
            Profile Summary
          </label>
          <Textarea
            id="summary"
            rows={5}
            value={profile.summary}
            onChange={(event) => setProfile({ ...profile, summary: event.target.value })}
            placeholder="Summarize the coursework, experiences, and strengths you want reflected in translated resumes."
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Handshake Connection</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Toggle mock Handshake connectivity for role recommendations.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={profile.handshakeConnected}
              onChange={(event) => setProfile({ ...profile, handshakeConnected: event.target.checked })}
            />
            Connected
          </label>
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-300/60 bg-rose-100/70 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-900/20 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {status === "saved"
              ? `Saved${profile.updatedAt ? ` · ${new Date(profile.updatedAt).toLocaleString()}` : ""}`
              : status === "loading"
                ? "Loading profile..."
                : "Profile powers role recommendations and translation context."}
          </p>
          <Button onClick={() => void onSave()} disabled={status === "saving" || status === "loading"}>
            {status === "saving" ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </Card>

    </div>
  );
}
