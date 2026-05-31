"use client";

import type { PortfolioPageConfig, PortfolioSectionId, PortfolioSections } from "@/content/portfolio/schema";
import { Field, SectionPanel, TextArea } from "./editor-ui";

const SECTION_ORDER: PortfolioSectionId[] = [
  "header",
  "hero",
  "features",
  "howItWorks",
  "infra",
  "stats",
  "integrations",
  "testimonials",
  "pricing",
  "cta",
  "footer",
];

const SECTION_TITLES: Record<PortfolioSectionId, string> = {
  header: "Header",
  hero: "Hero",
  features: "Work / Features",
  howItWorks: "Process",
  infra: "Stack",
  stats: "Stats",
  integrations: "Tools",
  testimonials: "Testimonials",
  pricing: "Pricing",
  cta: "Contact CTA",
  footer: "Footer",
};

type Props = {
  config: PortfolioPageConfig;
  onChange: (next: PortfolioPageConfig) => void;
};

function patchSection<K extends PortfolioSectionId>(
  config: PortfolioPageConfig,
  id: K,
  patch: Partial<NonNullable<PortfolioSections[K]>>,
): PortfolioPageConfig {
  const section = config.sections[id];
  if (!section) return config;
  return {
    ...config,
    sections: {
      ...config.sections,
      [id]: { ...section, ...patch },
    },
  };
}

export function PortfolioSectionEditor({ config, onChange }: Props) {
  const set = <K extends PortfolioSectionId>(
    id: K,
    patch: Partial<NonNullable<PortfolioSections[K]>>,
  ) => onChange(patchSection(config, id, patch));

  const toggle = (id: PortfolioSectionId) => {
    const section = config.sections[id];
    if (!section) return;
    set(id, { enabled: !section.enabled } as Partial<NonNullable<PortfolioSections[typeof id]>>);
  };

  const hero = config.sections.hero;
  const header = config.sections.header;
  const features = config.sections.features;
  const howItWorks = config.sections.howItWorks;
  const infra = config.sections.infra;
  const stats = config.sections.stats;
  const integrations = config.sections.integrations;
  const testimonials = config.sections.testimonials;
  const cta = config.sections.cta;
  const footer = config.sections.footer;

  return (
    <div className="space-y-3">
      {SECTION_ORDER.map((id) => {
        const section = config.sections[id];
        if (!section) return null;

        if (id === "header" && header) {
          return (
            <SectionPanel key={id} title={SECTION_TITLES[id]} enabled={header.enabled} onToggle={() => toggle(id)}>
              <Field label="Brand name" value={header.brandPrimary} onChange={(v) => set("header", { brandPrimary: v })} />
              <Field label="Brand accent (optional)" value={header.brandAccent} onChange={(v) => set("header", { brandAccent: v })} />
              <Field label="Status text" value={header.statusText ?? ""} onChange={(v) => set("header", { statusText: v })} />
              <Field label="Status subtext" value={header.statusSubtext ?? ""} onChange={(v) => set("header", { statusSubtext: v })} />
              <Field label="CTA label" value={header.ctaLabel} onChange={(v) => set("header", { ctaLabel: v })} />
            </SectionPanel>
          );
        }

        if (id === "hero" && hero) {
          return (
            <SectionPanel key={id} title={SECTION_TITLES[id]} enabled={hero.enabled} onToggle={() => toggle(id)}>
              <Field label="Badge" value={hero.badge} onChange={(v) => set("hero", { badge: v })} />
              <Field label="Headline line 1" value={hero.headline[0]} onChange={(v) => set("hero", { headline: [v, hero.headline[1], hero.headline[2]] })} />
              <Field
                label="Headline line 2 (before rotating word)"
                value={hero.headline[1]}
                onChange={(v) => set("hero", { headline: [hero.headline[0], v, hero.headline[2]] })}
              />
              <Field label="Headline line 3" value={hero.headline[2]} onChange={(v) => set("hero", { headline: [hero.headline[0], hero.headline[1], v] })} />
              <Field
                label="Rotating words (comma-separated)"
                value={hero.rotatingWords.join(", ")}
                onChange={(v) =>
                  set("hero", {
                    rotatingWords: v.split(",").map((w) => w.trim()).filter(Boolean),
                  })
                }
                placeholder="design, develop, ship"
              />
              <TextArea label="Description" value={hero.body} onChange={(v) => set("hero", { body: v })} rows={4} />
              <Field label="Video URL" value={hero.videoUrl} onChange={(v) => set("hero", { videoUrl: v })} />
              <Field label="Primary CTA label" value={hero.primaryCta.label} onChange={(v) => set("hero", { primaryCta: { ...hero.primaryCta, label: v } })} />
              <Field label="Secondary CTA label" value={hero.secondaryCta.label} onChange={(v) => set("hero", { secondaryCta: { ...hero.secondaryCta, label: v } })} />
              {hero.stats.map((stat, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 rounded border border-[var(--wiro-romance)]/10 p-3">
                  <Field label={`Stat ${i + 1} value`} value={stat.value} onChange={(v) => {
                    const next = [...hero.stats];
                    next[i] = { ...stat, value: v };
                    set("hero", { stats: next });
                  }} />
                  <Field label={`Stat ${i + 1} label`} value={stat.label} onChange={(v) => {
                    const next = [...hero.stats];
                    next[i] = { ...stat, label: v };
                    set("hero", { stats: next });
                  }} />
                </div>
              ))}
            </SectionPanel>
          );
        }

        if (id === "features" && features) {
          return (
            <SectionPanel key={id} title={SECTION_TITLES[id]} enabled={features.enabled} onToggle={() => toggle(id)}>
              <Field label="Eyebrow" value={features.eyebrow} onChange={(v) => set("features", { eyebrow: v })} />
              <Field label="Title" value={features.title} onChange={(v) => set("features", { title: v })} />
              <Field label="Title muted" value={features.titleMuted} onChange={(v) => set("features", { titleMuted: v })} />
              <TextArea label="Lead" value={features.lead} onChange={(v) => set("features", { lead: v })} />
              {features.items.map((item, i) => (
                <div key={i} className="space-y-2 rounded border border-[var(--wiro-romance)]/10 p-3">
                  <p className="text-xs text-[var(--wiro-mauve)]">Item {item.number}</p>
                  <Field label="Tag" value={item.tag} onChange={(v) => {
                    const items = [...features.items];
                    items[i] = { ...item, tag: v };
                    set("features", { items });
                  }} />
                  <Field label="Title" value={item.title} onChange={(v) => {
                    const items = [...features.items];
                    items[i] = { ...item, title: v };
                    set("features", { items });
                  }} />
                  <TextArea label="Body" value={item.body} onChange={(v) => {
                    const items = [...features.items];
                    items[i] = { ...item, body: v };
                    set("features", { items });
                  }} rows={2} />
                </div>
              ))}
            </SectionPanel>
          );
        }

        if (id === "howItWorks" && howItWorks) {
          return (
            <SectionPanel key={id} title={SECTION_TITLES[id]} enabled={howItWorks.enabled} onToggle={() => toggle(id)}>
              <Field label="Eyebrow" value={howItWorks.eyebrow} onChange={(v) => set("howItWorks", { eyebrow: v })} />
              <Field label="Title line 1" value={howItWorks.titleLines[0]} onChange={(v) => set("howItWorks", { titleLines: [v, howItWorks.titleLines[1], howItWorks.titleLines[2]] })} />
              <Field label="Title line 2" value={howItWorks.titleLines[1]} onChange={(v) => set("howItWorks", { titleLines: [howItWorks.titleLines[0], v, howItWorks.titleLines[2]] })} />
              <Field label="Title line 3" value={howItWorks.titleLines[2]} onChange={(v) => set("howItWorks", { titleLines: [howItWorks.titleLines[0], howItWorks.titleLines[1], v] })} />
              {howItWorks.steps.map((step, i) => (
                <div key={i} className="space-y-2 rounded border border-[var(--wiro-romance)]/10 p-3">
                  <p className="text-xs text-[var(--wiro-mauve)]">Step {step.number}</p>
                  <Field label="Title" value={step.title} onChange={(v) => {
                    const steps = [...howItWorks.steps];
                    steps[i] = { ...step, title: v };
                    set("howItWorks", { steps });
                  }} />
                  <TextArea label="Body" value={step.body} onChange={(v) => {
                    const steps = [...howItWorks.steps];
                    steps[i] = { ...step, body: v };
                    set("howItWorks", { steps });
                  }} rows={2} />
                </div>
              ))}
            </SectionPanel>
          );
        }

        if (id === "infra" && infra) {
          return (
            <SectionPanel key={id} title={SECTION_TITLES[id]} enabled={infra.enabled} onToggle={() => toggle(id)}>
              <Field label="Eyebrow" value={infra.eyebrow} onChange={(v) => set("infra", { eyebrow: v })} />
              <Field label="Title" value={infra.title} onChange={(v) => set("infra", { title: v })} />
              <Field label="Title muted" value={infra.titleMuted} onChange={(v) => set("infra", { titleMuted: v })} />
              <TextArea label="Lead" value={infra.lead} onChange={(v) => set("infra", { lead: v })} />
              <Field label="Main stat value" value={infra.mainStat.value} onChange={(v) => set("infra", { mainStat: { ...infra.mainStat, value: v } })} />
              <Field label="Main stat label" value={infra.mainStat.label} onChange={(v) => set("infra", { mainStat: { ...infra.mainStat, label: v } })} />
            </SectionPanel>
          );
        }

        if (id === "stats" && stats) {
          return (
            <SectionPanel key={id} title={SECTION_TITLES[id]} enabled={stats.enabled} onToggle={() => toggle(id)}>
              <Field label="Title" value={stats.title} onChange={(v) => set("stats", { title: v })} />
              <Field label="Title muted" value={stats.titleMuted} onChange={(v) => set("stats", { titleMuted: v })} />
              {stats.blocks.map((block, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 rounded border border-[var(--wiro-romance)]/10 p-3">
                  <Field label="Value" value={block.value} onChange={(v) => {
                    const blocks = [...stats.blocks];
                    blocks[i] = { ...block, value: v };
                    set("stats", { blocks });
                  }} />
                  <Field label="Label" value={block.label} onChange={(v) => {
                    const blocks = [...stats.blocks];
                    blocks[i] = { ...block, label: v };
                    set("stats", { blocks });
                  }} />
                </div>
              ))}
            </SectionPanel>
          );
        }

        if (id === "integrations" && integrations) {
          return (
            <SectionPanel key={id} title={SECTION_TITLES[id]} enabled={integrations.enabled} onToggle={() => toggle(id)}>
              <Field label="Eyebrow" value={integrations.eyebrow} onChange={(v) => set("integrations", { eyebrow: v })} />
              <Field label="Title" value={integrations.title} onChange={(v) => set("integrations", { title: v })} />
              <Field label="Title muted" value={integrations.titleMuted} onChange={(v) => set("integrations", { titleMuted: v })} />
              <TextArea label="Lead" value={integrations.lead} onChange={(v) => set("integrations", { lead: v })} />
              {integrations.items.map((item, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 rounded border border-[var(--wiro-romance)]/10 p-3">
                  <Field label="Name" value={item.name} onChange={(v) => {
                    const items = [...integrations.items];
                    items[i] = { ...item, name: v };
                    set("integrations", { items });
                  }} />
                  <Field label="Tag" value={item.tag} onChange={(v) => {
                    const items = [...integrations.items];
                    items[i] = { ...item, tag: v };
                    set("integrations", { items });
                  }} />
                </div>
              ))}
            </SectionPanel>
          );
        }

        if (id === "testimonials" && testimonials) {
          return (
            <SectionPanel key={id} title={SECTION_TITLES[id]} enabled={testimonials.enabled} onToggle={() => toggle(id)}>
              <Field label="Eyebrow" value={testimonials.eyebrow} onChange={(v) => set("testimonials", { eyebrow: v })} />
              <Field label="Title" value={testimonials.title} onChange={(v) => set("testimonials", { title: v })} />
              <Field label="Title muted" value={testimonials.titleMuted} onChange={(v) => set("testimonials", { titleMuted: v })} />
              {testimonials.items.map((item, i) => (
                <div key={i} className="space-y-2 rounded border border-[var(--wiro-romance)]/10 p-3">
                  <TextArea label="Quote" value={item.quote} onChange={(v) => {
                    const items = [...testimonials.items];
                    items[i] = { ...item, quote: v };
                    set("testimonials", { items });
                  }} rows={3} />
                  <Field label="Name" value={item.name} onChange={(v) => {
                    const items = [...testimonials.items];
                    items[i] = { ...item, name: v };
                    set("testimonials", { items });
                  }} />
                  <Field label="Role" value={item.role} onChange={(v) => {
                    const items = [...testimonials.items];
                    items[i] = { ...item, role: v };
                    set("testimonials", { items });
                  }} />
                </div>
              ))}
            </SectionPanel>
          );
        }

        if (id === "pricing" && config.sections.pricing) {
          const pricing = config.sections.pricing;
          return (
            <SectionPanel key={id} title={SECTION_TITLES[id]} enabled={pricing.enabled} onToggle={() => toggle(id)}>
              <p className="text-xs text-[var(--wiro-romance)]/50">Toggle off if you do not need pricing on your page.</p>
            </SectionPanel>
          );
        }

        if (id === "cta" && cta) {
          return (
            <SectionPanel key={id} title={SECTION_TITLES[id]} enabled={cta.enabled} onToggle={() => toggle(id)}>
              <Field label="Title" value={cta.title} onChange={(v) => set("cta", { title: v })} />
              <TextArea label="Body" value={cta.body} onChange={(v) => set("cta", { body: v })} />
              <Field label="Primary CTA" value={cta.primaryCta} onChange={(v) => set("cta", { primaryCta: v })} />
              <Field label="Secondary CTA" value={cta.secondaryCta} onChange={(v) => set("cta", { secondaryCta: v })} />
              <Field label="Footnote" value={cta.footnote} onChange={(v) => set("cta", { footnote: v })} />
            </SectionPanel>
          );
        }

        if (id === "footer" && footer) {
          return (
            <SectionPanel key={id} title={SECTION_TITLES[id]} enabled={footer.enabled} onToggle={() => toggle(id)}>
              <Field label="Brand" value={footer.brandPrimary} onChange={(v) => set("footer", { brandPrimary: v })} />
              <TextArea label="Description" value={footer.description} onChange={(v) => set("footer", { description: v })} rows={3} />
              <Field label="Copyright" value={footer.copyright} onChange={(v) => set("footer", { copyright: v })} />
            </SectionPanel>
          );
        }

        return null;
      })}
    </div>
  );
}
