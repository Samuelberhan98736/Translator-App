"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const links = [
  { href: "/", label: "Dashboard", exact: true },
  { href: "/translate", label: "Translate", exact: false },
  { href: "/history", label: "History", exact: false },
  { href: "/profile", label: "Profile", exact: false }
];

function DashboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function TranslateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  );
}

const iconMap = {
  "/": DashboardIcon,
  "/translate": TranslateIcon,
  "/history": HistoryIcon,
  "/profile": ProfileIcon
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-cyan-500/20 bg-gradient-to-b from-slate-900 via-slate-900 to-cyan-950 px-4 py-5 text-slate-100 md:min-h-screen md:border-b-0 md:border-r md:border-r-cyan-400/20">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 md:mx-0 md:max-w-none md:h-full">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/30">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 8 6 6" />
              <path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="m22 22-5-10-5 10" />
              <path d="M14 18h6" />
            </svg>
          </div>
          <div>
            <strong className="block text-sm font-semibold text-white">Translator App</strong>
            <span className="text-xs text-slate-400">Resume intelligence</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Navigation */}
        <nav className="grid gap-1 sm:grid-cols-2 md:grid-cols-1">
          {links.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            const Icon = iconMap[link.href as keyof typeof iconMap];

            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "border-cyan-400/30 bg-cyan-500/15 text-cyan-300"
                    : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-slate-100"
                )}
              >
                <Icon />
                {link.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom status indicator */}
        <div className="mt-auto hidden md:block pt-4">
          <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              <span className="text-xs text-slate-400">MVP Active</span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}
