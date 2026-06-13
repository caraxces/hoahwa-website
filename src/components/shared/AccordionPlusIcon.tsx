import { cn } from "@/lib/cn";

type AccordionPlusIconProps = {
  className?: string;
  open?: boolean;
};

export function AccordionPlusIcon({ className, open = false }: AccordionPlusIconProps) {
  return (
    <span
      className={cn(
        "relative flex size-6 shrink-0 items-center justify-center",
        className,
      )}
      aria-hidden
    >
      <span
        className={cn(
          "absolute h-6 w-0.5 origin-center bg-current transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "scale-y-0 opacity-0" : "scale-y-100 opacity-100",
        )}
      />
      <span className="absolute h-0.5 w-6 rounded-full bg-current" />
    </span>
  );
}
