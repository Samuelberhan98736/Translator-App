import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <strong className="text-sm font-semibold tracking-wide text-slate-900">
          Translator Agent MVP
        </strong>
        <nav>
          <Link
            className="text-sm font-medium text-accent transition hover:text-[#0b3c66]"
            href="/translate"
          >
            Translate
          </Link>
        </nav>
      </div>
    </header>
  );
}
