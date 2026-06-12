import { serviceKeypoints } from "@/content/service-keypoints";

export type TeamMember = {
  name: string;
  role: string;
  badge?: string;
  bio: string;
  image: string;
  category: "Dev" | "MKT" | "Design";
  keypoints: string[];
};

const mktTechnicalLabels = new Set([
  "SEO",
  "Analytics",
  "Linear analysis",
  "Quantitative analysis",
  "Funnel analysis",
  "Cohort tracking",
  "Attribution modeling",
  "KPI dashboards",
  "Heatmap insights",
  "Conversion paths",
  "GA4 & pixels",
  "LTV modeling",
]);

const devKeypoints = serviceKeypoints
  .filter((p) => p.category === "Dev")
  .map((p) => p.label);

const seoTechnicalKeypoints = serviceKeypoints
  .filter((p) => p.category === "MKT" && mktTechnicalLabels.has(p.label))
  .map((p) => p.label);

const marketingKeypoints = serviceKeypoints
  .filter((p) => p.category === "MKT" && !mktTechnicalLabels.has(p.label))
  .map((p) => p.label);

const designKeypoints = serviceKeypoints
  .filter((p) => p.category === "Design")
  .map((p) => p.label);

export const teamMembers: TeamMember[] = [
  {
    name: "Truc",
    badge: "Leader",
    role: "Developer",
    category: "Dev",
    bio: "Developed Hoahwa from the ground up — building the product, shaping delivery, and assembling the first team behind the studio.",
    image: "/img/founder.png",
    keypoints: [...devKeypoints, ...seoTechnicalKeypoints],
  },
  {
    name: "Thao",
    role: "Marketing",
    category: "MKT",
    bio: "Shapes how Hoahwa shows up — brand storytelling, campaign strategy, and content that connects our work with the clients who need it.",
    image: "/img/marketing.png",
    keypoints: marketingKeypoints,
  },
  {
    name: "Designer",
    role: "Assets Material",
    category: "Design",
    bio: "Owns visual direction and production assets — UI layouts, brand imagery, iconography, motion references, and design systems that keep every build on-brand and shippable.",
    image: "/img/designer.png",
    keypoints: designKeypoints,
  },
];

export const teamSection = {
  headline: ["Meet the", "team"] as const,
  lead: "A small, hands-on studio — built by the people who ship the work.",
};
