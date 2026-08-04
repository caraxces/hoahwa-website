/** Diagonal arrow mark used in the hero. Inherits colour from `currentColor`. */
export function VeArrowMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={15}
      strokeLinecap="square"
    >
      <path d="M18 82 L78 22 M30 22 H80 V72" />
    </svg>
  );
}
