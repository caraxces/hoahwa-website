import type { Metadata } from "next";
import { VibeDemoView } from "@/components/vibe/VibeDemoView";

export const metadata: Metadata = {
  title: "Vibe Palette Demo | Hoahwa",
  robots: { index: false, follow: false },
};

export default function VibeDemoPage() {
  return <VibeDemoView />;
}
