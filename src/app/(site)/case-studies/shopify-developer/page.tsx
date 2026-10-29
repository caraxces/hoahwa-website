import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

const PATH = "/case-studies/shopify-developer";

export const metadata = pageMetadata({
  title: "Shopify + Developer — Why You Need Both",
  description:
    "A practical explainer on what Shopify provides vs what custom development is responsible for—plus how we structure delivery and support after launch.",
  path: PATH,
  image: "/og/shopify-developer.png",
});

export default function ShopifyDeveloperCaseStudyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
          { name: "Shopify + Developer", path: PATH },
        ])}
      />
      <PageSection
      padX={false}
      className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] pb-24 pt-[120px] text-[var(--wiro-romance)]"
    >
      <PageContainer>
        <RevealGroup variants={staggerContainer(0.08, 0.05)}>
          <Reveal variants={fadeUp}>
            <p className="text-[length:var(--wiro-body)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
              Case study / explainer
            </p>
          </Reveal>
          <Reveal clip variants={clipUp} className="mt-4">
            <h1 className="text-h1">
              Shopify gives you the platform.
              <span className="block text-[var(--wiro-mauve)]">Development gives you the storefront.</span>
            </h1>
          </Reveal>
          <Reveal variants={fadeUp} className="mt-10 max-w-[900px]">
            <p className="text-[length:40px] leading-[44px] tracking-[-0.04em] text-[var(--wiro-romance)]/85">
              Shopify is the “infrastructure”. Custom development is what makes the brand feel unique—layout,
              sections, metafields, integrations, and performance.
            </p>
          </Reveal>
        </RevealGroup>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--border-subtle)] p-8">
            <h2 className="text-[length:var(--wiro-h4)] tracking-[-0.04em]">What Shopify gives you</h2>
            <ul className="mt-6 space-y-3 text-base leading-6 tracking-[-0.03em] text-[var(--wiro-romance)]/75">
              <li>Hosting, SSL, security, backups, and scaling</li>
              <li>Orders, inventory, customers, and reporting</li>
              <li>Theme editor for basic content changes</li>
              <li>App ecosystem for add-ons</li>
            </ul>
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] p-8">
            <h2 className="text-[length:var(--wiro-h4)] tracking-[-0.04em]">What a developer owns</h2>
            <ul className="mt-6 space-y-3 text-base leading-6 tracking-[-0.03em] text-[var(--wiro-romance)]/75">
              <li>Custom layout + sections (Liquid)</li>
              <li>Metafields schema + rendering for rich product data</li>
              <li>Conditional logic + UX details</li>
              <li>App placement/integration without breaking layout</li>
              <li>Performance fundamentals (LCP/CLS/INP)</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-lg border border-[var(--border-subtle)] p-8">
          <h2 className="text-[length:var(--wiro-h4)] tracking-[-0.04em]">After go‑live</h2>
          <p className="mt-4 text-base leading-6 tracking-[-0.03em] text-[var(--wiro-romance)]/75">
            Launch is the start. We iterate with new landing pages, features, and analytics‑driven UX updates—
            faster because the original builder already knows the theme, schema, and stack.
          </p>
        </div>
      </PageContainer>
    </PageSection>
    </>
  );
}

