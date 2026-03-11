import Link from "next/link";
import Badge from "@/components/ui/Badge";

export default function HomePage() {
  return (
    <div className="space-y-6">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-night">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-300/25 via-transparent to-blue-400/15 dark:from-cyan-500/20 dark:to-blue-900/20" />
        <div className="absolute -right-12 -top-12 -z-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-400/5" />
        <div className="absolute -bottom-8 -left-8 -z-10 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-400/5" />

        <div className="space-y-4">
          <Badge>MVP Active</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Resume Translator
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Align your resume to any job in seconds. Surface skill gaps, match keywords, and land more interviews.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/translate"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-600 bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-cyan-500/20 transition hover:bg-cyan-500 dark:border-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
            >
              Start Translating
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-500/60 dark:hover:text-cyan-300"
            >
              View History
            </Link>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Resumes Translated",
            value: "0",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
                <line x1="10" x2="8" y1="9" y2="9" />
              </svg>
            )
          },
          {
            label: "Skill Gaps Found",
            value: "0",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
            )
          },
          {
            label: "Keywords Matched",
            value: "0",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )
          }
        ].map((stat) => (
          <section
            key={stat.label}
            className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-night"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {stat.value}
                </p>
              </div>
              <div className="rounded-xl bg-cyan-50 p-2 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                {stat.icon}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            href: "/translate",
            title: "Translate Resume",
            description: "Paste your resume and a job description. Get a tailored version with matched language instantly.",
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" />
                <path d="M2 5h12" /><path d="M7 2h1" />
                <path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
              </svg>
            ),
            cta: "Open Workspace"
          },
          {
            href: "/history",
            title: "Version History",
            description: "Compare past translations, review skill gap trends, and restore previous resume versions.",
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
              </svg>
            ),
            cta: "View History"
          },
          {
            href: "/profile",
            title: "Your Profile",
            description: "Manage your learner details, set preferences, and configure portfolio metadata.",
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            ),
            cta: "Edit Profile"
          }
        ].map((feature) => (
          <section
            key={feature.href}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-soft backdrop-blur transition hover:border-cyan-300/60 dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-night dark:hover:border-cyan-500/30"
          >
            <div className="mb-4 inline-flex rounded-xl bg-slate-100 p-2.5 text-slate-600 transition group-hover:bg-cyan-50 group-hover:text-cyan-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-cyan-500/10 dark:group-hover:text-cyan-400">
              {feature.icon}
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{feature.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">{feature.description}</p>
            <Link
              href={feature.href}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 transition hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              {feature.cta}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </section>
        ))}
      </div>

    </div>
  );
}
