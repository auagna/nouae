export function ProgressBar({ value }: { value: number }) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#e8e5dc]">
      <div className="h-full rounded-full bg-sage transition-[width]" style={{ width: `${normalized}%` }} />
    </div>
  );
}
