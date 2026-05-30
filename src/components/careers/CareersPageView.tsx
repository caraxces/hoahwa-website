import Link from "next/link";
import Image from "next/image";
import {
  careersHero,
  careersQuotes,
  careersStats,
  openRoles,
  whyJoin,
} from "@/content/careers";
import { teamMembers } from "@/content/team";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

export function CareersPageView() {
  return (
    <>
      <PageSection
        padX={false}
        className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] pb-20 pt-[120px] text-[var(--wiro-romance)]"
      >
        <PageContainer>
          <Reveal variants={fadeUp}>
            <p className="text-[length:var(--wiro-body)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
              {careersHero.eyebrow}
            </p>
          </Reveal>
          <RevealGroup variants={staggerContainer(0.08, 0.05)} className="mt-4">
            <Reveal clip variants={clipUp}>
              <h1 className="text-h1">{careersHero.headline}</h1>
            </Reveal>
          </RevealGroup>

          <div className="mt-20 grid grid-cols-3 gap-8 border-t border-[var(--wiro-romance)]/20 pt-12">
            {careersStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-[length:72px] leading-none tracking-[-0.08em] text-[var(--wiro-mauve)]">
                  {stat.value}
                </p>
                <p className="mt-2 text-base tracking-[-0.03em]">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-24">
            <h2 className="text-[length:var(--wiro-h3)] tracking-[-0.06em]">Open roles</h2>
            <ul className="mt-8 border-t border-[var(--wiro-romance)]">
              {openRoles.map((role) => (
                <li key={role.title} className="border-b border-[var(--wiro-romance)]">
                  <Link
                    href={role.href}
                    className="flex flex-col gap-2 py-8 transition-opacity hover:opacity-80 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-[length:40px] leading-[44px] tracking-[-0.04em]">
                      {role.title}
                    </span>
                    <span className="text-base tracking-[-0.03em] text-[var(--wiro-mauve)]">
                      {role.location}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </PageContainer>
      </PageSection>

      <PageSection className="bg-[var(--wiro-romance)] py-24 text-[var(--wiro-cod-gray)]">
        <PageContainer>
          <h2 className="text-h3">
            <span className="text-[var(--wiro-mauve)]">Why</span>
            <span> Join{" "}
              <Image
                src="/LOGO HOAHWA/hoahwa_logo_board-08.png"
                alt="Hoahwa"
                width={240}
                height={60}
                className="inline-block h-[1em] w-auto align-middle"
              />?
            </span>
          </h2>
          <div className="mt-16 grid gap-12 lg:grid-cols-3">
            {whyJoin.map((item) => (
              <div key={item.title}>
                <h3 className="text-[length:var(--wiro-h4)] tracking-[-0.04em]">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-6 tracking-[-0.03em]">{item.body}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </PageSection>

      <PageSection
        padX={false}
        className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] py-24 text-[var(--wiro-romance)]"
      >
        <PageContainer>
          <div className="grid gap-8 md:grid-cols-2">
            {careersQuotes.map((item) => (
              <blockquote
                key={`${item.name}-${item.role}`}
                className="rounded-lg border border-[var(--wiro-romance)]/20 p-8"
              >
                <p className="text-base leading-6 tracking-[-0.03em]">&ldquo;{item.quote}&rdquo;</p>
                <footer className="mt-6 text-sm tracking-[-0.03em] text-[var(--wiro-mauve)]">
                  {item.name}
                  <span className="text-[var(--wiro-romance)]/50"> — {item.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </PageContainer>
      </PageSection>

      <PageSection className="bg-[var(--wiro-romance)] py-24 text-[var(--wiro-cod-gray)]">
        <PageContainer>
          <h2 className="text-h3">
            <span className="block">Meet the</span>
            <span className="block text-[var(--wiro-mauve)]">dream team</span>
          </h2>
          <div className="mt-16 grid gap-10 md:grid-cols-2">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="overflow-hidden rounded-lg bg-[var(--wiro-spring-wood)]"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6 text-center md:p-8">
                  <p className="text-lg font-medium tracking-[-0.03em]">{member.name}</p>
                  {member.badge ? (
                    <p className="mt-1 text-sm tracking-[-0.02em] text-[var(--wiro-mauve)]">
                      {member.badge}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs tracking-[-0.02em] text-[var(--wiro-cod-gray)]/60">
                    {member.role}
                  </p>
                  <p className="mt-4 text-sm leading-6 tracking-[-0.02em] text-[var(--wiro-cod-gray)]/70">
                    {member.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </PageContainer>
      </PageSection>
    </>
  );
}
