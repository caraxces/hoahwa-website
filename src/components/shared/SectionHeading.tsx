import Image from "next/image";
import { cn } from "@/lib/cn";

/** Render a title string, replacing any occurrence of "Hoahwa" with the brand wordmark image */
function TitleWithBrandImage({ text }: { text: string }) {
  const parts = text.split(/(Hoahwa)/gi);
  return (
    <>
      {parts.map((part, i) =>
        /^hoahwa$/i.test(part) ? (
          <Image
            key={i}
            src="/LOGO HOAHWA/hoahwa_logo_board-08.png"
            alt="Hoahwa"
            width={240}
            height={60}
            className="inline-block h-[1em] w-auto align-middle"
          />
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow?: string;
  title: string;
  className?: string;
}) {
  const hasBrand = /hoahwa/i.test(title);
  return (
    <div className={cn("mb-10 md:mb-14", className)}>
      {eyebrow && (
        <p className="mb-2 text-sm uppercase tracking-widest text-[var(--hoahwa-muted)]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
        {hasBrand ? <TitleWithBrandImage text={title} /> : title}
      </h2>
    </div>
  );
}
