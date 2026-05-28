import Link from "next/link";

export function LatestCaseBadge({ href = "/case-studies/" }: { href?: string }) {
  return (
    <Link
      href={href}
      data-node-id="1:445"
      className="group inline-flex items-center gap-3 rounded-[24px] bg-[var(--wiro-spring-wood)] py-0.5 pl-0.5 pr-4 transition-all duration-300 hover:bg-[var(--wiro-cod-gray)] hover:shadow-lg"
    >
      <span className="rounded-[32px] bg-[var(--wiro-cod-gray)] px-2 py-1 text-base tracking-[-0.02em] text-[var(--wiro-romance)] transition-colors duration-300 group-hover:bg-[var(--wiro-romance)] group-hover:text-[var(--wiro-cod-gray)]">
        New
      </span>
      <span className="text-base tracking-[-0.02em] text-[var(--wiro-cod-gray)] transition-colors duration-300 group-hover:text-[var(--wiro-romance)]">
        Latest Case Study
      </span>
    </Link>
  );
}
