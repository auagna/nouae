import type { HTMLAttributes, ReactNode } from "react";

export function Card({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <section className={`rounded-lg border border-line bg-panel p-5 shadow-soft ${className}`} {...props}>
      {children}
    </section>
  );
}

export function SectionTitle({ title, caption }: { title: string; caption?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-normal text-ink">{title}</h2>
        {caption ? <p className="mt-1 text-sm text-muted">{caption}</p> : null}
      </div>
    </div>
  );
}
