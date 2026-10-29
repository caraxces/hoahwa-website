import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-h3 tracking-[-0.04em] text-[var(--wiro-cod-gray)]">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)]/70">
        The page you requested does not exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-8 text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)] underline decoration-[var(--wiro-mauve)] underline-offset-4 transition-opacity hover:opacity-70"
      >
        Back to home
      </Link>
    </div>
  );
}
