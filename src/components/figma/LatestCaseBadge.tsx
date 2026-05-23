import Link from "next/link";

export function LatestCaseBadge({ href = "#" }: { href?: string }) {
  return (
    <Link
      href={href}
      data-node-id="1:445"
      className="inline-flex items-center gap-3 rounded-[24px] bg-[var(--wiro-spring-wood)] py-0.5 pl-0.5 pr-4"
    >
      <span className="rounded-[32px] bg-[var(--wiro-cod-gray)] px-2 py-1 text-base tracking-[-0.02em] text-[var(--wiro-romance)]">
        New
      </span>
      <span className="text-base tracking-[-0.02em] text-[var(--wiro-cod-gray)]">
        Latest Case Study
      </span>
    </Link>
  );
}
