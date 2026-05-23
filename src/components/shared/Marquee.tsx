import { cn } from "@/lib/cn";

export function Marquee({
  children,
  direction = "left",
  className,
  testId,
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
  className?: string;
  testId?: string;
}) {
  return (
    <div
      className={cn("overflow-hidden", className)}
      data-testid={testId}
    >
      <div
        className={cn(
          "flex w-max gap-6",
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
        )}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
