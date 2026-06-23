type IconProps = {
  className?: string;
};

export function RainingIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M7 14a4.5 4.5 0 0 1-.5-9 5.5 5.5 0 0 1 10.3 2.2A4 4 0 0 1 18 14H7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 17.5v2M12 16.5v3M15 17.5v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
