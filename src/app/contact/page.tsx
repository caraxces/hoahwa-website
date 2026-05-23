import { ContactPageView } from "@/components/contact/ContactPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Hoahwa",
  description: "Get in touch with Hoahwa about your eCommerce growth goals.",
};

export default function ContactPage() {
  return <ContactPageView />;
}
