import { CareersPageView } from "@/components/careers/CareersPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Hoahwa",
  description: "Join Hoahwa—a boutique web design & development team aiming for prestigious global design awards.",
};

export default function CareersPage() {
  return <CareersPageView />;
}
