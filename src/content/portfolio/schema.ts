export type SectionBase = {
  enabled: boolean;
};

export type NavLink = {
  label: string;
  href: string;
  sectionId?: string;
};

export type HeaderSection = SectionBase & {
  brandPrimary: string;
  brandAccent: string;
  brandSuffix?: string;
  statusText?: string;
  statusSubtext?: string;
  navLinks: NavLink[];
  ctaLabel: string;
  langLabel?: string;
};

export type HeroStat = { value: string; label: string };

export type HeroCodeLine = {
  type: "remove" | "add" | "comment";
  text: string;
};

export type HeroSection = SectionBase & {
  videoUrl: string;
  badge: string;
  headline: [string, string, string];
  rotatingWords: string[];
  body: string;
  codeFileName: string;
  codeLines: HeroCodeLine[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: HeroStat[];
};

export type FeatureItem = {
  number: string;
  tag: string;
  title: string;
  body: string;
  statValue: string;
  statLabel: string;
};

export type FeaturesSection = SectionBase & {
  eyebrow: string;
  title: string;
  titleMuted: string;
  lead: string;
  items: FeatureItem[];
};

export type HowItWorksStep = {
  number: string;
  title: string;
  subtitle: string;
  body: string;
};

export type HowItWorksSection = SectionBase & {
  eyebrow: string;
  titleLines: [string, string, string];
  imageUrl: string;
  steps: HowItWorksStep[];
};

export type RegionCard = {
  name: string;
  nodes: string;
  active?: boolean;
};

export type InfraSection = SectionBase & {
  eyebrow: string;
  title: string;
  titleMuted: string;
  lead: string;
  imageUrl: string;
  mainStat: { value: string; unit: string; label: string };
  sideStats: Array<{ value: string; label: string }>;
  regions: RegionCard[];
};

export type StatsBlock = {
  label: string;
  sublabel: string;
  value: string;
  suffix?: string;
  prefix?: string;
  footnote?: string;
};

export type StatsSection = SectionBase & {
  liveLabel?: string;
  title: string;
  titleMuted: string;
  graphImageUrl: string;
  blocks: StatsBlock[];
  tags: string[];
};

export type IntegrationItem = {
  name: string;
  tag: string;
  logoUrl?: string;
};

export type IntegrationsSection = SectionBase & {
  eyebrow: string;
  title: string;
  titleMuted: string;
  lead: string;
  bannerImageUrl: string;
  items: IntegrationItem[];
};

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

export type TestimonialsSection = SectionBase & {
  eyebrow: string;
  title: string;
  titleMuted: string;
  sideStat: { value: string; label: string };
  companies: string[];
  items: TestimonialItem[];
};

export type PricingFeature = {
  label: string;
  value: string;
};

export type PricingPlan = {
  name: string;
  duration: string;
  price: string;
  features: PricingFeature[];
  footnote?: string;
  popular?: boolean;
  badge?: string;
};

export type PricingRule = string;

export type PricingSection = SectionBase & {
  eyebrow: string;
  title: string;
  titleMuted: string;
  lead: string;
  bundleTabLabel: string;
  paygTabLabel: string;
  rulesTitle: string;
  rules: PricingRule[];
  bundlePlans: PricingPlan[];
  paygPlans: PricingPlan[];
  contactTitle: string;
  contactLead: string;
  contactLinks: Array<{ label: string; href: string; variant: "primary" | "secondary" }>;
};

export type CtaSection = SectionBase & {
  title: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  footnote: string;
  imageUrl: string;
};

export type FooterLinkGroup = {
  title: string;
  links: Array<{ label: string; href: string; badge?: string }>;
};

export type FooterSection = SectionBase & {
  brandPrimary: string;
  brandAccent: string;
  brandSuffix?: string;
  description: string;
  socialLinks: Array<{ label: string; href: string }>;
  linkGroups: FooterLinkGroup[];
  copyright: string;
  statusText?: string;
  bannerImageUrl: string;
};

export type PortfolioTheme = {
  accent?: string;
};

export type PortfolioSections = {
  header?: HeaderSection;
  hero?: HeroSection;
  features?: FeaturesSection;
  howItWorks?: HowItWorksSection;
  infra?: InfraSection;
  stats?: StatsSection;
  integrations?: IntegrationsSection;
  testimonials?: TestimonialsSection;
  pricing?: PricingSection;
  cta?: CtaSection;
  footer?: FooterSection;
};

export type PortfolioPageConfig = {
  slug: string;
  meta: {
    title: string;
    description: string;
  };
  theme?: PortfolioTheme;
  sections: PortfolioSections;
};

export type PortfolioSectionId = keyof PortfolioSections;

export function isSectionEnabled(
  sections: PortfolioSections,
  id: PortfolioSectionId,
): boolean {
  const section = sections[id];
  return Boolean(section?.enabled);
}

export function getEnabledNavLinks(sections: PortfolioSections): NavLink[] {
  const header = sections.header;
  if (!header?.enabled) return [];

  return header.navLinks.filter((link) => {
    if (!link.sectionId) return true;
    return isSectionEnabled(sections, link.sectionId as PortfolioSectionId);
  });
}
