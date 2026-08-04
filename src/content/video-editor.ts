import type { ServiceFaq } from "@/content/service";

/**
 * Video editor service page content.
 *
 * Layout is an editorial "artboard" treatment: light surface inside the
 * otherwise dark site. Measurements referenced by the components come from
 * a 1512px design frame — see src/styles/video-editor.css.
 *
 * All copy below is placeholder. Swap for real copy; keep line counts similar
 * so the artboard and reel grid keep their proportions.
 */

export const veHero = {
  eyebrow: "(Est. 2026 — Version 1.0)",
  /** Two lines — keep line 2 short so it clears the arrow mark. */
  headline: ["Motion that earns", "the second watch"] as const,
  lead:
    "Placeholder — 2–3 dòng định vị cho dịch vụ video. Thay bằng copy thật, " +
    "giữ độ dài tương đương để khung artboard không đổi tỉ lệ.",
  tags: ["short-form", "motion", "launch"] as const,
};

export const veManifesto =
  "Video tốt bắt đầu từ tay nghề và sự kỹ tính. Chúng tôi tin một sản phẩm " +
  "chỉ giữ được người xem khi câu chuyện, nhịp dựng và kỹ thuật cùng phục vụ " +
  "một ý duy nhất.";

export type VeService = {
  id: string;
  title: string;
  body: string;
};

export const veServices: VeService[] = [
  {
    id: "short-form",
    title: "Short-form & social",
    body:
      "Placeholder — mô tả dịch vụ 01. Dựng dọc 9:16 cho TikTok, Reels, " +
      "Shorts. Hook trong 2 giây đầu, nhịp cắt theo dữ liệu retention.",
  },
  {
    id: "motion",
    title: "Motion & animation",
    body:
      "Placeholder — mô tả dịch vụ 02. Motion graphics dựng bằng code " +
      "(Remotion), nên mọi biến thể đều render lại được, không dựng tay lại.",
  },
  {
    id: "launch",
    title: "Launch films",
    body:
      "Placeholder — mô tả dịch vụ 03. Video ra mắt sản phẩm: script, " +
      "storyboard, dựng, và bộ cut phái sinh cho từng nền tảng.",
  },
];

export type VeStat = { value: string; label: string };

export type VeCase = {
  id: string;
  name: string;
  /** Three vertical 9:16 slots per case — Remotion social output. */
  reels: readonly [string, string, string];
  stats: VeStat[];
};

export const veCases: VeCase[] = [
  {
    id: "alpha",
    name: "Project Alpha",
    reels: ["P01/1", "P01/2", "P01/3"],
    stats: [
      { value: "00M+", label: "Chỉ số một trên nền tảng" },
      { value: "00K+", label: "Chỉ số hai trên nền tảng" },
    ],
  },
  {
    id: "beta",
    name: "Project Beta",
    reels: ["P02/1", "P02/2", "P02/3"],
    stats: [
      { value: "+0.0M", label: "Chỉ số một trong 12 tháng" },
      { value: "000M+", label: "Chỉ số hai trên nền tảng" },
      { value: "0M+", label: "Chỉ số ba trên nền tảng" },
    ],
  },
  {
    id: "gamma",
    name: "Project Gamma",
    reels: ["P03/1", "P03/2", "P03/3"],
    stats: [
      { value: "00M+", label: "Chỉ số một trên nền tảng" },
      { value: "0M+", label: "Chỉ số hai trên nền tảng" },
    ],
  },
  {
    id: "delta",
    name: "Project Delta",
    reels: ["P04/1", "P04/2", "P04/3"],
    stats: [
      { value: "000K+", label: "Chỉ số một trên nền tảng" },
      { value: "0.0K+", label: "Chỉ số hai trên nền tảng" },
    ],
  },
  {
    id: "epsilon",
    name: "Project Epsilon",
    reels: ["P05/1", "P05/2", "P05/3"],
    stats: [
      { value: "000K+", label: "Chỉ số một" },
      { value: "0.0K+", label: "Chỉ số hai" },
    ],
  },
];

export const veWork = {
  kicker: "< Projects >",
  headline: "Placeholder — một câu giới thiệu danh mục dự án.",
};

export type VeQuote = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

export const veQuotes: VeQuote[] = [
  {
    id: "q1",
    quote:
      "Placeholder — trích dẫn feedback của khách hàng 01. Giữ khoảng 3–5 " +
      "dòng để card không đổi chiều cao.",
    name: "Tên khách hàng",
    role: "Chức danh, Công ty",
  },
  {
    id: "q2",
    quote:
      "Placeholder — trích dẫn feedback của khách hàng 02. Giữ khoảng 3–5 " +
      "dòng để card không đổi chiều cao.",
    name: "Tên khách hàng",
    role: "Chức danh, Công ty",
  },
  {
    id: "q3",
    quote:
      "Placeholder — trích dẫn feedback của khách hàng 03. Giữ khoảng 3–5 " +
      "dòng để card không đổi chiều cao.",
    name: "Tên khách hàng",
    role: "Chức danh, Công ty",
  },
  {
    id: "q4",
    quote:
      "Placeholder — trích dẫn feedback của khách hàng 04. Giữ khoảng 3–5 " +
      "dòng để card không đổi chiều cao.",
    name: "Tên khách hàng",
    role: "Chức danh, Công ty",
  },
];

/** Shape matches ServiceFaq so ServiceFaqContact can render these directly. */
export const veFaqs: ServiceFaq[] = [
  {
    id: "timeline",
    question: "Một video short-form mất bao lâu để làm xong?",
    answer:
      "Placeholder — thay bằng câu trả lời thật. Nêu rõ timeline theo từng " +
      "loại deliverable và số vòng revision đi kèm.",
  },
  {
    id: "code-motion",
    question: "Vì sao dựng motion bằng code thay vì dựng tay?",
    answer:
      "Placeholder — thay bằng câu trả lời thật. Nêu lợi ích: render lại " +
      "hàng loạt biến thể, đổi copy hoặc ngôn ngữ mà không dựng lại.",
  },
  {
    id: "prep",
    question: "Chúng tôi cần chuẩn bị gì trước khi bắt đầu?",
    answer:
      "Placeholder — thay bằng câu trả lời thật. Liệt kê brand asset, " +
      "footage sẵn có, và người duyệt cuối.",
  },
];

export const veContactServices: string[] = [
  "Short-form & social",
  "Motion & animation",
  "Launch films",
];
