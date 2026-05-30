import type { Metadata } from "next";
import { ProcessPageView } from "@/components/process/ProcessPageView";

export const metadata: Metadata = {
  title: "Process | Hoahwa",
  description:
    "A clear delivery process—from audit and wireframes to development, go-live, and technical foundations.",
};

export default function ProcessPage() {
  return <ProcessPageView />;
}

