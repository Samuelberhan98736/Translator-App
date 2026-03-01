import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/translate", label: "Translate" },
  { href: "/history", label: "History" },
  { href: "/profile", label: "Profile" }
];

export default function Sidebar() {
  return (
    <aside className="border-b border-slate-200 bg-[#0b2239] px-4 py-5 text-slate-100 md:min-h-screen md:border-b-0 md:border-r md:border-r-slate-300/20">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:mx-0 md:max-w-none">
        <strong className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-100/90">
          Sandbox Lab
        </strong>
        <nav className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
