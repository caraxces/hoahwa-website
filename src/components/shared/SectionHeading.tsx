import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 md:mb-14", className)}>
      {eyebrow && (
        <p className="mb-2 text-sm uppercase tracking-widest text-[var(--hoahwa-muted)]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
        {title}
      </h2>
    </div>
  );
}
