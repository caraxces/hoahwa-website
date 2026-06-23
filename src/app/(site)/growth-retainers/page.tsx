import { GrowthPageView } from "@/components/growth/GrowthPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata, serviceSchema } from "@/lib/seo";

const TITLE = "Shopify Growth Retainers (CRO + Dev)";
const DESCRIPTION =
  "Ongoing CRO, strategy, and development retainers to compound eCommerce growth month over month.";
const PATH = "/growth-retainers";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

export default function GrowthPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: TITLE,
            description: DESCRIPTION,
            path: PATH,
            serviceType: "eCommerce growth retainer",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Growth Retainers", path: PATH },
          ]),
        ]}
      />
      <GrowthPageView />
    </>
  );
}
