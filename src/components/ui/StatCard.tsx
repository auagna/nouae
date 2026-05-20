import type { ReactNode } from "react";

export function StatCard({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-white p-3">
      <div className="flex items-center gap-2 text-sm text-muted">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold text-ink">{value}</div>
    </div>
  );
}
