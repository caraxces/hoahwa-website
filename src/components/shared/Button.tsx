import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function Button({
  href,
  variant = "primary",
  className,
  children,
  type = "button",
  onClick,
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors",
    variant === "primary" &&
      "bg-[var(--hoahwa-accent)] text-[var(--wiro-cod-gray)] hover:opacity-90",
    variant === "outline" &&
      "border border-white/20 text-[var(--wiro-romance)] hover:border-[var(--wiro-mauve)]",
    variant === "ghost" && "text-[var(--wiro-romance)] hover:text-[var(--wiro-mauve)]",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={styles} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={styles} onClick={onClick}>
      {children}
    </button>
  );
}
