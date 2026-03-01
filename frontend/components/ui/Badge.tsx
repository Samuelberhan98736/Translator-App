import type { PropsWithChildren } from "react";

export default function Badge({ children }: PropsWithChildren) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-accent/20 bg-accentSoft px-3 py-1 text-xs font-semibold text-accent">
      {children}
    </span>
  );
}
