import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary: "border-ink bg-ink text-white hover:bg-[#33383c]",
  secondary: "border-line bg-panel text-ink hover:border-sage",
  ghost: "border-transparent bg-transparent text-muted hover:bg-[#eeece5] hover:text-ink",
  danger: "border-[#d9b8ac] bg-[#fff7f4] text-clay hover:border-clay"
};

export function Button({
  children,
  className = "",
  variant = "secondary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; children: ReactNode }) {
  return (
    <button
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
