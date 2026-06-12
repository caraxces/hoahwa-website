import { cn } from "@/lib/cn";
import { forwardRef } from "react";

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--wiro-container)] px-[var(--wiro-gutter)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export const PageSection = forwardRef<
  HTMLElement,
  {
    children: React.ReactNode;
    className?: string;
    padX?: boolean;
  }
>(function PageSection({ children, className, padX = true }, ref) {
  return (
    <section
      ref={ref}
      className={cn(padX && "px-[var(--wiro-page-pad)]", className)}
    >
      {children}
    </section>
  );
});
