import { AuditsPageView } from "@/components/audits/AuditsPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata, serviceSchema } from "@/lib/seo";

const TITLE = "CX, CRO + Technical Audits for Shopify";
const DESCRIPTION =
  "Data-driven CX, CRO and Technical audits for Shopify brands—actionable insights, prioritised roadmaps, and expert delivery.";
const PATH = "/audits";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

export default function AuditsPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: TITLE,
            description: DESCRIPTION,
            path: PATH,
            serviceType: "eCommerce CRO & technical audit",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Audits", path: PATH },
          ]),
        ]}
      />
      <AuditsPageView />
    </>
  );
}
