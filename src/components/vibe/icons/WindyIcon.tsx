type IconProps = {
  className?: string;
};

export function WindyIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M4 9c2.5 0 3.5-1.5 5.5-1.5S13 9 15.5 9 18 7.5 20 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 14c2 0 3-1.5 5-1.5s3.5 1.5 6 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6 19c1.5 0 2.5-.8 4-.8s2.8.8 4.5.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
