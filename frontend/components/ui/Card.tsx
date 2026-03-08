import type { PropsWithChildren } from "react";
import { clsx } from "clsx";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export default function Card({ children, className }: CardProps) {
  return (
    <section
      className={clsx(
        "relative space-y-4 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-night",
        className
      )}
    >
      {children}
    </section>
  );
}
