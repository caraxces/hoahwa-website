export type ServicePlan = {
  id: string;
  step?: string;
  title: string;
  subtitle: string;
  features: string[];
  variant: "light" | "dark";
  ctaVariant?: "dark" | "mauve";
  showCta?: boolean;
};

export type ServiceFaq = {
  id: string;
  question: string;
  answer: string;
};

export const sharedContactServices = [
  "Audits / Discovery",
  "CRO Retainer",
  "Growth Retainer",
  "Shopify Build",
  "eCommerce Strategy",
] as const;
