export default function ProfilePage() {
  return (
    <div className="space-y-5">

      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 px-7 py-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-night">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-300/15 via-transparent to-transparent dark:from-amber-500/10" />
        <div className="flex items-center gap-4">
          {/* Avatar placeholder */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-md dark:from-slate-600 dark:to-slate-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              User Profile
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage your details, preferences, and portfolio metadata.
            </p>
          </div>
        </div>
      </section>

      {/* Profile fields placeholder */}
      <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-night">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Personal Info
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {["Full Name", "University Email", "Major / Field", "Graduation Year"].map((field) => (
            <div key={field} className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {field}
              </label>
              <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-night">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Preferences
        </h2>
        <div className="space-y-3">
          {["Target Industry", "Career Level", "Default Resume Format"].map((field) => (
            <div key={field} className="flex items-center justify-between rounded-xl border border-slate-200/80 px-4 py-3 dark:border-slate-700/60">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{field}</span>
              <div className="h-4 w-24 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          Profile editing coming soon.
        </p>
      </section>

    </div>
  );
}
