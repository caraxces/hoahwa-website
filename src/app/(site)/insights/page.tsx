import { InsightsPageView } from "@/components/insights/InsightsPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

const PATH = "/insights";

export const metadata = pageMetadata({
  title: "eCommerce & Shopify Insights",
  description: "Latest eCommerce, Shopify, and CRO insights from Hoahwa.",
  path: PATH,
});

export default function InsightsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Insights", path: PATH },
        ])}
      />
      <InsightsPageView />
    </>
  );
}
