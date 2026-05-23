// url=https://www.figma.com/design/9soqpfUEBTJTfhMmYtI9RV/Untitled?node-id=1-445
// source=src/components/figma/LatestCaseBadge.tsx
// component=LatestCaseBadge
import figma from "figma";

const instance = figma.selectedInstance;
const newLabel = instance.getString("New") ?? "New";
const latestLabel = instance.getString("Latest Case Study") ?? "Latest Case Study";

export default {
  example: figma.code`<LatestCaseBadge href="#" />`,
  imports: ['import { LatestCaseBadge } from "@/components/figma/LatestCaseBadge"'],
  id: "wiro-latest-case-badge",
  metadata: { nestable: true, props: { newLabel, latestLabel } },
};
