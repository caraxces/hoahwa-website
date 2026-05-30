export type TeamMember = {
  name: string;
  role: string;
  badge?: string;
  bio: string;
  image: string;
};

export const teamMembers: TeamMember[] = [
  {
    name: "Truc",
    badge: "Founder",
    role: "Developer",
    bio: "Developed Hoahwa from the ground up — building the product, shaping delivery, and assembling the first team behind the studio.",
    image: "/img/founder.png",
  },
  {
    name: "Designer",
    role: "Assets Material",
    bio: "Owns visual direction and production assets — UI layouts, brand imagery, iconography, motion references, and design systems that keep every build on-brand and shippable.",
    image: "/img/designer.png",
  },
];

export const teamSection = {
  headline: ["Meet the", "team"] as const,
  lead: "A small, hands-on studio — built by the people who ship the work.",
};
