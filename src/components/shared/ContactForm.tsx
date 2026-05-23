"use client";

import { contactPage } from "@/content/contact";
import { HoahwaContactForm } from "@/components/shared/HoahwaContactForm";

export function ContactForm({ compact = false }: { compact?: boolean }) {
  return (
    <HoahwaContactForm
      services={contactPage.services}
      budgets={contactPage.budgets}
      showBudget={!compact}
    />
  );
}
