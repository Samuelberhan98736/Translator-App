"use client";

export default function LoadingSpinner() {
  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-cyan-500 dark:border-slate-600 dark:border-t-cyan-300" />
      Processing...
    </div>
  );
}
