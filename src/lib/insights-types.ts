export type InsightBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

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
