import type { PortfolioPageConfig } from "./schema";
import { hoahwaPortfolioDemo } from "./hoahwa-portfolio-demo";

const pages: Record<string, PortfolioPageConfig> = {
  demo: hoahwaPortfolioDemo,
};

export function getPortfolioPage(slug: string): PortfolioPageConfig | undefined {
  return pages[slug];
}

export function getAllPortfolioSlugs(): string[] {
  return Object.keys(pages);
}

export function applySectionOverrides(
  config: PortfolioPageConfig,
  hideSections?: string[],
): PortfolioPageConfig {
  if (!hideSections?.length) return config;

  const sections = { ...config.sections };

  for (const id of hideSections) {
    const key = id as keyof typeof sections;
    const section = sections[key];
    if (section) {
      section.enabled = false;
    }
  }

  return { ...config, sections };
}
