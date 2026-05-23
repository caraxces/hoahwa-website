import { cn } from "@/lib/cn";

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

export function PageSection({
  children,
  className,
  padX = true,
}: {
  children: React.ReactNode;
  className?: string;
  padX?: boolean;
}) {
  return (
    <section
      className={cn(
        padX && "px-[var(--wiro-page-pad)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
