import type { AuditPlan } from "@/content/audits";
import { ServicePlanCard } from "@/components/service/ServicePlanCard";

export function AuditPlanCard({ plan }: { plan: AuditPlan }) {
  return <ServicePlanCard plan={plan} />;
}
