import { ContactPageView } from "@/components/contact/ContactPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

const PATH = "/contact";

export const metadata = pageMetadata({
  title: "Contact Hoahwa",
  description: "Get in touch with Hoahwa about your eCommerce growth goals.",
  path: PATH,
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: PATH },
        ])}
      />
      <ContactPageView />
    </>
  );
}
