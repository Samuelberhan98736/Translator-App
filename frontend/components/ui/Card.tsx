import type { PropsWithChildren } from "react";
import { clsx } from "clsx";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export default function Card({ children, className }: CardProps) {
  return (
    <section
      className={clsx(
        "space-y-3 rounded-2xl border border-slate-200 bg-panel p-5 shadow-soft",
        className
      )}
    >
      {children}
    </section>
  );
}
