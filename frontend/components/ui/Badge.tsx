import type { PropsWithChildren } from "react";

export default function Badge({ children }: PropsWithChildren) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-cyan-300/60 bg-cyan-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-800 dark:border-cyan-500/40 dark:bg-cyan-500/20 dark:text-cyan-300">
      {children}
    </span>
  );
}
