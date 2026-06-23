import { BuildPageView } from "@/components/build/BuildPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata, serviceSchema } from "@/lib/seo";

const TITLE = "Shopify Theme Development & Web Builds";
const DESCRIPTION =
  "Boutique web design & development focusing on high-end aesthetics, cost-effective pricing, and top-tier browser compatibility.";
const PATH = "/shopify-theme-builds";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

export default function BuildPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: TITLE,
            description: DESCRIPTION,
            path: PATH,
            serviceType: "Shopify theme development",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shopify Theme Builds", path: PATH },
          ]),
        ]}
      />
      <BuildPageView />
    </>
  );
}
