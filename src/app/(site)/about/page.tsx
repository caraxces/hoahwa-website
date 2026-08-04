import { AboutPageView } from "@/components/about/AboutPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

const PATH = "/about";

export const metadata = pageMetadata({
  title: "About Hoahwa",
  description:
    "A three-person web design and development studio. Meet the people who scope, design, and build your project — no account managers in between.",
  path: PATH,
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: PATH },
        ])}
      />
      <AboutPageView />
    </>
  );
}
