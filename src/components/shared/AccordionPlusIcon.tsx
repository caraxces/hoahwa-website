import { cn } from "@/lib/cn";

export function AccordionPlusIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex size-6 shrink-0 items-center justify-center",
        className,
      )}
      aria-hidden
    >
      <span className="absolute h-6 w-0.5 bg-current" />
      <span className="absolute h-0.5 w-6 bg-current" />
    </span>
  );
}
