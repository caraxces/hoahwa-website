import { AeoPageView } from "@/components/aeo/AeoPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { aeoFaqs } from "@/content/aeo";
import {
  breadcrumbSchema,
  faqSchema,
  pageMetadata,
  serviceSchema,
} from "@/lib/seo";

const TITLE = "AEO & GEO — AI Search Optimization for Shopify";
const DESCRIPTION =
  "Get your brand cited by ChatGPT, Perplexity, and Google AI Overviews. Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO) for Shopify brands—structured data, answer-first content, and agentic-commerce readiness.";
const PATH = "/ai-search-optimization";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

export default function AiSearchOptimizationPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "AI Search Optimization (AEO / GEO)",
            description: DESCRIPTION,
            path: PATH,
            serviceType: "Answer Engine Optimization",
          }),
          faqSchema(aeoFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI Search Optimization", path: PATH },
          ]),
        ]}
      />
      <AeoPageView />
    </>
  );
}
