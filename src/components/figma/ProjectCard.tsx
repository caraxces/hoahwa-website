import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { FlowersOverlay } from "@/components/motion/FlowersOverlay";

export type ProjectCardData = {
  slug: string;
  title: string;
  image: string;
  brandLabel?: string;
  tags: string[];
};

export function ProjectCard({
  project,
  className,
  href,
}: {
  project: ProjectCardData;
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href ?? `/case-studies#${project.slug}`}
      className={cn(
        "group group-hover-flowers relative block h-[640px] w-[640px] max-w-full shrink-0 overflow-visible rounded-lg",
        className,
      )}
      data-name="div.project-card"
    >
      <div className="absolute inset-0 overflow-hidden rounded-lg">
      <Image
        src={project.image}
        alt=""
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="640px"
        unoptimized={project.image.startsWith("http")}
      />
      </div>
      <FlowersOverlay />
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--surface-dark)_35%,transparent)] opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute left-11 top-11 rounded border border-[var(--border-subtle)] px-3 py-1 text-sm text-[var(--text-on-dark)]">
        Shopify Plus
      </div>
      <div className="absolute bottom-11 left-11 right-11">
        {project.brandLabel && (
          <p className="mb-6 text-2xl font-medium text-[var(--text-on-dark)]">{project.brandLabel}</p>
        )}
        <p className="mb-6 max-w-[500px] text-lg leading-snug text-[color-mix(in_srgb,var(--text-on-dark)_90%,transparent)]">
          {project.title}
        </p>
        <div className="flex flex-wrap gap-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[color-mix(in_srgb,var(--text-on-dark)_30%,transparent)] px-3 py-1 text-sm text-[var(--text-on-dark)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
