import type { PropsWithChildren } from "react";

export default function PageContainer({ children }: PropsWithChildren) {
  return <main className="mx-auto w-full max-w-7xl px-4 py-5">{children}</main>;
}
