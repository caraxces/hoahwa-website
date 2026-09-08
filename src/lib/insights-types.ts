/** A phase of a staged rollout, e.g. what to ship in the first 30 days. */
export type InsightPhase = {
  window: string;
  title: string;
  items: string[];
};

export type InsightBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  /**
   * A reserved player. With no `src` or `youtubeId` it renders as a labelled
   * placeholder, so an article can ship before its video exists and start
   * showing it by adding one field later.
   */
  | {
      type: "video";
      caption: string;
      src?: string;
      youtubeId?: string;
      poster?: string;
    }
  /**
   * A still image with an explicit intrinsic size, so next/image can reserve
   * the box and the article does not shift as figures decode.
   */
  | {
      type: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      caption?: string;
    }
  | { type: "phases"; phases: InsightPhase[] }
  | { type: "cta"; href: string; label: string; note?: string };

export type InsightPostRecord = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  body: InsightBlock[];
};

export type InsightsDatabase = {
  version: number;
  posts: InsightPostRecord[];
};
