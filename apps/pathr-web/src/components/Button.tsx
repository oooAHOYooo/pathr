import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = "secondary", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium " +
    "border shadow-soft " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  const styles =
    variant === "primary"
      ? "bg-accent text-white border-accent hover:bg-[#1F56D8]"
      : "bg-white text-ink border-border hover:bg-surface";

  return <button className={[base, styles, className].filter(Boolean).join(" ")} {...props} />;
}

