"use client";

import { cn } from "@/lib/cn";
import { VIBE_LABELS, VIBE_ORDER, type VibeId } from "@/lib/vibe";
import { useVibe } from "./VibeProvider";
import { RainingIcon } from "./icons/RainingIcon";
import { SunnyIcon } from "./icons/SunnyIcon";
import { WindyIcon } from "./icons/WindyIcon";
import { useVibeToast, VibeToastBubble } from "./VibeToast";

type VibeToggleWithToastProps = {
  variant?: "header" | "floating";
  className?: string;
  toastPlacement?: "below" | "above";
};

const VIBE_ICONS = {
  sunny: SunnyIcon,
  windy: WindyIcon,
  raining: RainingIcon,
} as const;

export function VibeToggleWithToast({
  variant = "header",
  className,
  toastPlacement,
}: VibeToggleWithToastProps) {
  const { vibe, setVibe } = useVibe();
  const { message, visible, showForVibe } = useVibeToast();
  const placement = toastPlacement ?? (variant === "floating" ? "above" : "below");

  const handleSelect = (id: VibeId) => {
    if (id === vibe) return;
    setVibe(id);
    showForVibe(id);
  };

  return (
    <div className={cn("relative", className)}>
      <div
        role="group"
        aria-label="Site color vibe"
        className={cn(
          "inline-flex items-center rounded-full border p-0.5",
          variant === "header"
            ? "border-[var(--border-subtle)] bg-[var(--overlay-glass)]"
            : "border-[var(--border-subtle)] bg-[var(--surface-dark)] shadow-lg backdrop-blur-md",
        )}
      >
        {VIBE_ORDER.map((id) => {
          const Icon = VIBE_ICONS[id];
          const active = vibe === id;
          const label = VIBE_LABELS[id];
          return (
            <button
              key={id}
              type="button"
              title={label.tooltip}
              aria-label={`Switch to ${label.title.toLowerCase()}`}
              aria-pressed={active}
              onClick={() => handleSelect(id)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                active
                  ? "bg-[var(--accent)] text-[var(--text-on-accent)]"
                  : "text-[var(--text-on-dark)] hover:bg-[var(--border-subtle)]",
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
      <VibeToastBubble message={message} visible={visible} placement={placement} />
    </div>
  );
}
