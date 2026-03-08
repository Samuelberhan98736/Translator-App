import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/translate", label: "Translate" },
  { href: "/history", label: "History" },
  { href: "/profile", label: "Profile" }
];

export default function Sidebar() {
  return (
    <aside className="border-b border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 px-4 py-5 text-slate-100 md:min-h-screen md:border-b-0 md:border-r md:border-r-cyan-400/20">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 md:mx-0 md:max-w-none">
        <div>
          <strong className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">
            Translator App
          </strong>
          <p className="mt-2 text-xs text-slate-300/80">
            Resume intelligence workspace
          </p>
        </div>

        <nav className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-400/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
