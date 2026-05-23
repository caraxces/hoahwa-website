import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

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
        "group relative block h-[640px] w-[640px] max-w-full shrink-0 overflow-hidden rounded-lg",
        className,
      )}
      data-name="div.project-card"
    >
      <Image
        src={project.image}
        alt=""
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="640px"
        unoptimized={project.image.startsWith("http")}
      />
      <div className="absolute inset-0 bg-[rgba(21,21,21,0.35)] opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute left-11 top-11 rounded border border-white/20 px-3 py-1 text-sm text-white">
        Shopify Plus
      </div>
      <div className="absolute bottom-11 left-11 right-11">
        {project.brandLabel && (
          <p className="mb-6 text-2xl font-medium text-white">{project.brandLabel}</p>
        )}
        <p className="mb-6 max-w-[500px] text-lg leading-snug text-white/90">
          {project.title}
        </p>
        <div className="flex flex-wrap gap-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/30 px-3 py-1 text-sm text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
