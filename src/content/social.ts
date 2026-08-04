/**
 * Single source of truth for social profiles.
 *
 * TO PUBLISH A PROFILE: set its `href` to the full URL. That one edit does all
 * three jobs — renders the footer link, adds the profile to the Organization
 * `sameAs` in JSON-LD, and nothing else needs touching.
 *
 * Leave `href` as null while a profile does not exist yet. A null profile is
 * omitted everywhere rather than rendered as a dead "#" link.
 */
export type SocialProfile = {
  label: string;
  href: string | null;
};

export const socialProfiles: SocialProfile[] = [
  // e.g. "https://www.linkedin.com/in/your-handle/"
  { label: "LinkedIn", href: null },
  { label: "Instagram", href: null },
];

/** Only the profiles that are actually live. */
export const liveSocialProfiles = socialProfiles.filter(
  (p): p is { label: string; href: string } => Boolean(p.href),
);
