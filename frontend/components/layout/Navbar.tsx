import Link from "next/link";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/75 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300">
            TA
          </span>
          <strong className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
            Translator App
          </strong>
        </div>

        <div className="flex items-center gap-3">
          <Link
            className="text-sm font-medium text-slate-700 transition hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300"
            href="/translate"
          >
            Translate
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
