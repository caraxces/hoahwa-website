"use client";

import { auditContactServices, auditFaqs } from "@/content/audits";
import { ServiceFaqContact } from "@/components/service/ServiceFaqContact";

export function AuditFaqContact() {
  return (
    <ServiceFaqContact
      faqs={auditFaqs}
      contactTitle={["Lets Talk", "Audits"]}
      contactServices={[...auditContactServices]}
      nodeId="3:5744"
    />
  );
}
