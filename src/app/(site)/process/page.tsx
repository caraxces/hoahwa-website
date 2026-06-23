import { ProcessPageView } from "@/components/process/ProcessPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

const PATH = "/process";

export const metadata = pageMetadata({
  title: "Our Delivery Process",
  description:
    "A clear delivery process—from audit and wireframes to development, go-live, and technical foundations.",
  path: PATH,
});

export default function ProcessPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Process", path: PATH },
        ])}
      />
      <ProcessPageView />
    </>
  );
}

