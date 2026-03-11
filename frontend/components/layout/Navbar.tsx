import Link from "next/link";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-sm shadow-cyan-500/30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 8 6 6" />
              <path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="m22 22-5-10-5 10" />
              <path d="M14 18h6" />
            </svg>
          </div>
          <strong className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
            Translator App
          </strong>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-cyan-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
            href="/translate"
          >
            Translate
          </Link>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}
